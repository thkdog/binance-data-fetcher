import moment from 'moment';

export function parseIntervalToMs(interval) {
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
