const axios = require('axios');
const moment = require('moment');

function parseIntervalToMs(interval) {
  // support seconds (s), minutes (m), hours (h), days (d), weeks (w), months (M)
  const m = interval.match(/^(\d+)([smhdwM])$/);
  if (!m) throw new Error('Unsupported interval: ' + interval);
  const n = parseInt(m[1], 10);
  const unit = m[2];
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

async function fetchKlines({ symbol, interval, startTime, endTime, limit = 1000, axiosInstance, logger } = {}) {
  if (!symbol) throw new Error('symbol is required');
  if (!interval) throw new Error('interval is required');
  if (!startTime) throw new Error('startTime is required');
  if (!endTime) throw new Error('endTime is required');

  const baseURL = 'https://fapi.binance.com';
  const client = axiosInstance || axios.create({ baseURL, timeout: 10000 });

  const intervalMs = parseIntervalToMs(interval);
  let currentStart = Number(startTime);
  const end = Number(endTime);
  const out = [];
  const log = typeof logger === 'function' ? logger : console.log;
  const role = 'futures';

  while (currentStart <= end) {
    const params = {
      symbol,
      interval,
      startTime: currentStart,
      endTime: end,
      limit,
    };

    const resp = await client.get('/fapi/v1/klines', { params });
    const data = resp.data;
    if (!Array.isArray(data) || data.length === 0) break;

    out.push(...data);
    // logging for this page
    try {
      const fetched = data.length;
      const firstOpen = Number(data[0][0]);
      const lastOpen = Number(data[data.length - 1][0]);
      const rangeStartISO = moment(firstOpen).toISOString();
      const rangeEndISO = moment(Number(data[data.length - 1][6]) || lastOpen + intervalMs).toISOString();
      log(`[${role}] fetched ${fetched} rows; page start param=${currentStart} (${moment(currentStart).toISOString()}); data range ${rangeStartISO} - ${rangeEndISO}; total so far=${out.length}`);
    } catch (e) {
      // ignore logging errors
    }

    if (data.length < limit) break;

    const last = data[data.length - 1];
    const lastOpen = Number(last[0]);
    const next = lastOpen + intervalMs;
    if (next <= currentStart) break;
    currentStart = next;
  }

  return out;
}

module.exports = { fetchKlines };
