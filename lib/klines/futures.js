import axios from 'axios';
import { parseIntervalToMs } from './shared';

const BASE_URL = 'https://fapi.binance.com';
const KLINES_PATH = '/fapi/v1/klines';

export async function fetchFuturesKlines({ symbol, interval, startTime, endTime, limit = 1000 } = {}) {
  if (!symbol) throw new Error('symbol is required');
  if (!interval) throw new Error('interval is required');
  if (!startTime) throw new Error('startTime is required');
  if (!endTime) throw new Error('endTime is required');

  const client = axios.create({ baseURL: BASE_URL, timeout: 10000 });
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

    const resp = await client.get(KLINES_PATH, { params });
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
