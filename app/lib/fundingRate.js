import axios from 'axios';
import moment from 'moment';

const baseURL = 'https://fapi.binance.com';

export async function fetchFundingRates({ symbol, startTime, endTime, limit = 1000 } = {}) {
  if (!symbol) throw new Error('symbol is required');

  const client = axios.create({ baseURL, timeout: 10000 });
  const out = [];
  let currentStart = startTime ? Number(startTime) : undefined;
  const end = endTime ? Number(endTime) : undefined;

  while (true) {
    const params = {
      symbol,
      limit,
    };
    if (Number.isFinite(currentStart)) params.startTime = currentStart;
    if (Number.isFinite(end)) params.endTime = end;

    const resp = await client.get('/fapi/v1/fundingRate', { params });
    const data = resp.data;
    if (!Array.isArray(data) || data.length === 0) break;

    out.push(...data);
    if (data.length < limit) break;

    const last = data[data.length - 1];
    const lastTime = Number(last.fundingTime);
    if (!Number.isFinite(lastTime)) break;
    const nextStart = lastTime + 1;

    if (Number.isFinite(end) && nextStart > end) break;
    if (currentStart === nextStart) break;
    currentStart = nextStart;
  }

  return out;
}

export function fundingRatesToCsv(rows) {
  const header = ['symbol', 'fundingRate', 'fundingTime', 'fundingTimeISO', 'markPrice'];
  const body = rows.map((row) => {
    const fundingTime = Number(row.fundingTime);
    const fundingTimeISO = Number.isFinite(fundingTime)
      ? moment(fundingTime).toISOString()
      : '';

    return [
      row.symbol ?? '',
      row.fundingRate ?? '',
      Number.isFinite(fundingTime) ? fundingTime : '',
      fundingTimeISO,
      row.markPrice ?? '',
    ].map(String).join(',');
  });

  return header.join(',') + '\n' + body.join('\n');
}
