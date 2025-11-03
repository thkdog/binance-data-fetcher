# Binance Kline Fetcher

基于 Node.js 的小工具，用于从币安（Binance）现货与 USDT 永续合约（期货）接口分页拉取 K 线（klines/candles），并支持导出 JSON 或 CSV。

主要特性
- 支持现货（api.binance.com）与期货（fapi.binance.com）两个独立模块
- 自动分页（处理 Binance 每次最大 limit 限制）
- 支持 interval 单位：s, m, h, d, w, M（秒/分/时/日/周/月）
- CLI（基于 commander）支持参数：mode, symbol, interval, start, end, limit, output, csv
- 导出 CSV 时保留原始 timestamp（openTime/closeTime）并额外增加 ISO 可读列（openTimeISO/closeTimeISO）
- 每次分页抓取会打印日志（便于调试/监控）

快速开始

1. 安装依赖

在项目根目录运行（该仓库使用 pnpm，但也支持 npm/yarn）：

```bash
pnpm install
# 或
# npm install
# yarn install
```

2. CLI 用法

基本参数：
- `-m, --mode <mode>`: 模式 `spot` 或 `futures`（必需）
- `-s, --symbol <symbol>`: 交易对，例如 `BTCUSDT`（必需）
- `-i, --interval <interval>`: k 线周期，例如 `1m`、`1h`、`1s`（必需）
- `--start <start>`: 开始时间（ISO 字符串或毫秒时间戳）（必需）
- `--end <end>`: 结束时间（ISO 字符串或毫秒时间戳）（必需）
- `--limit <n>`: 每次请求的最大返回条数（默认 1000，Binance 单次上限 1000）
- `-o, --output <file>`: 指定输出文件（JSON 或 CSV，根据 `--csv` 决定）
- `--csv`: 导出 CSV（在当前目录生成带时间戳的文件，或使用 `--output` 指定文件名）

示例：

拉取现货 BTCUSDT 最近 10 分钟的 1 分钟 K 线并打印到终端：

```bash
node bin/cli -m spot -s BTCUSDT -i 1m --start $(node -e "console.log(Date.now()-600000)") --end $(node -e "console.log(Date.now())")
```

导出期货 2025-11-01 至 2025-11-02 的 1 小时 K 线为 CSV：

```bash
node bin/cli -m futures -s BTCUSDT -i 1h --start "2025-11-01T00:00:00Z" --end "2025-11-02T00:00:00Z" --csv -o myklines.csv
```

时间格式说明
- 当参数为纯数字（匹配 /^\d+$/）时，会被视为毫秒时间戳（ms since epoch）。
  - 注意：如果你有 Unix秒（例如 `1698888000`），请先乘以 1000 或使用 ISO 格式。
- 否则会使用 `moment` 解析时间字符串，推荐使用 ISO 8601（例如 `2025-11-01T00:00:00Z`）。

CSV 说明
- CSV 文件包含以下列（按顺序）：
  - openTime（原始毫秒时间戳）、openTimeISO（ISO 可读）、open、high、low、close、volume、closeTime（原始毫秒）、closeTimeISO、quoteAssetVolume、trades、takerBase、takerQuote
- 每次分页抓取会在终端打印类似的日志：
  - [spot] fetched 1000 rows; page start param=... (ISO); data range ... - ...; total so far=...

实现细节与注意事项
- 分页策略：每次请求使用 `startTime` 和 `endTime`，若返回条数 == `limit` 则计算最后一行的 openTime + interval 作为下一次请求的 startTime，直到超出 endTime 或返回条数 < limit。
- 目前 `--start` 与 `--end` 必须都提供（可以在未来添加省略参数的语法，如“最近 N 条”）。
- 请注意 Binance API 的速率限制（429/418），大量历史数据抓取时请谨慎并加入退避/重试策略。后续可扩展：重试、限速、并发控制、请求断点续传。

开发与测试
- 源码位置：
  - `src/spot.js`：现货抓取实现
  - `src/futures.js`：期货抓取实现
  - `bin/cli`：命令行入口与 CSV/JSON 导出

本仓库未包含自动化测试（可后续加入）。运行时请确保网络可访问 Binance 并遵守其 API 限制。

贡献
- 欢迎提交 issue 或 PR：增加错误重试、限流、断点续传与更多输出格式支持。

许可证
- MIT（请根据需要自行补充许可证信息）
