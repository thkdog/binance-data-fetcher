import { NextResponse } from 'next/server';
import { fetchFuturesKlines } from '@/lib/klines/futures';
import { klinesToCsv } from '@/lib/klines/shared';

export const runtime = 'edge';

function sanitizeFilename(value) {
  return String(value).replace(/[^a-zA-Z0-9-_]+/g, '_');
}

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const symbol = searchParams.get('symbol');
  const interval = searchParams.get('interval');
  const start = searchParams.get('start');
  const end = searchParams.get('end');

  if (!symbol || !interval || !start || !end) {
    return NextResponse.json({ error: 'Missing required query params.' }, { status: 400 });
  }

  const startTime = Number(start);
  const endTime = Number(end);
  if (!Number.isFinite(startTime) || !Number.isFinite(endTime) || startTime >= endTime) {
    return NextResponse.json({ error: 'Invalid time range.' }, { status: 400 });
  }

  try {
    const rows = await fetchFuturesKlines({
      symbol: symbol.toUpperCase(),
      interval,
      startTime,
      endTime,
      limit: 1000,
    });

    const csv = klinesToCsv(rows);
    const filename = [
      sanitizeFilename(symbol),
      'futures',
      sanitizeFilename(interval),
      startTime,
      endTime,
    ].join('_');

    return new NextResponse(csv, {
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': `attachment; filename="${filename}.csv"`,
      },
    });
  } catch (error) {
    const message = error?.response?.data?.msg || error?.message || 'Fetch failed.';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
