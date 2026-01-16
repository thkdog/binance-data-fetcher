import axios from 'axios';
import moment from 'moment';

function parseIntervalToMs(interval) {
  const match = interval.match(/^(\d+)([smhdwM])$/);
  if (!match) throw new Error('Unsupported interval: ' + interval);
  const n = parseInt(match[1], 10);
  const unit = match[2];
  switch (unit) {
    case 's': return moment.duration(n, 'seconds').asMilliseconds();
    case 'm': return moment.duration(n, 'minutes').asMilliseconds();
    case 'h': return moment.duration(n, 'hours').asMilliseconds();
    case 'd': return moment.duration(n, 'days').asMilliseconds();
    case 'w': return moment.duration(n, 'weeks').asMilliseconds();
    case 'M': return moment.duration(n, 'months').asMilliseconds();
    default: throw new Error('Unsupported interval unit: ' + unit);
  }
}

function getBaseURL(mode) {
  if (mode === 'spot') return 'https://api.binance.com';
  if (mode === 'futures') return 'https://fapi.binance.com';
  throw new Error('mode must be spot or futures');
}

function getKlinesPath(mode) {
  if (mode === 'spot') return '/api/v3/klines';
  if (mode === 'futures') return '/fapi/v1/klines';
  throw new Error('mode must be spot or futures');
}

export async function fetchKlines({ mode, symbol, interval, startTime, endTime, limit = 1000 } = {}) {
  if (!mode) throw new Error('mode is required');
  if (!symbol) throw new Error('symbol is required');
  if (!interval) throw new Error('interval is required');
  if (!startTime) throw new Error('startTime is required');
  if (!endTime) throw new Error('endTime is required');

  const baseURL = getBaseURL(mode);
  const client = axios.create({ baseURL, timeout: 10000 });
  const intervalMs = parseIntervalToMs(interval);
  let currentStart = Number(startTime);
  const end = Number(endTime);
  const out = [];

  while (currentStart <= end) {
    const params = {
      symbol,
      interval,
      startTime: currentStart,
      endTime: end,
      limit,
    };

    const resp = await client.get(getKlinesPath(mode), { params });
    const data = resp.data;
    if (!Array.isArray(data) || data.length === 0) break;

    out.push(...data);
    if (data.length < limit) break;

    const last = data[data.length - 1];
    const lastOpen = Number(last[0]);
    const next = lastOpen + intervalMs;
    if (next <= currentStart) break;
    currentStart = next;
  }

  return out;
}

export function klinesToCsv(rows) {
  const header = [
    'openTime',
    'openTimeISO',
    'open',
    'high',
    'low',
    'close',
    'volume',
    'closeTime',
    'closeTimeISO',
    'quoteAssetVolume',
    'trades',
    'takerBase',
    'takerQuote',
  ];
  const body = rows.map((r) => {
    const openTime = r[0];
    const closeTime = r[6];
    const openTimeISO = moment(openTime).toISOString();
    const closeTimeISO = moment(closeTime).toISOString();
    return [
      openTime,
      openTimeISO,
      r[1],
      r[2],
      r[3],
      r[4],
      r[5],
      closeTime,
      closeTimeISO,
      r[7],
      r[8],
      r[9],
      r[10],
    ].map(String).join(',');
  });

  return header.join(',') + '\n' + body.join('\n');
}
