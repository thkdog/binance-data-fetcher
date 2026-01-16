# Binance Kline Downloader (Web)

基于 Next.js + Ant Design 的 Web 工具，用于从币安（Binance）现货与 USDT 永续合约接口分页拉取 K 线，并直接下载 CSV 文件。

主要特性
- App Router + Route Handler 生成 CSV 下载
- 支持现货（api.binance.com）与期货（fapi.binance.com）
- 支持 interval 单位：s, m, h, d, w, M（秒/分/时/日/周/月）
- 支持时间范围选择并直接下载 CSV
- 基础 Basic Auth 登录保护（用于 Vercel 部署）

快速开始

1. 安装依赖

```bash
npm install
```

2. 启动开发服务器

```bash
npm run dev
```

3. 访问页面

打开 `http://localhost:3000`，填写市场、交易对、K 线间隔和时间范围，点击下载。

Basic Auth
- 设置环境变量：
  - `BASIC_AUTH_USER`
  - `BASIC_AUTH_PASS`
- 本地开发可用 `.env.local`：

```bash
BASIC_AUTH_USER=yourname
BASIC_AUTH_PASS=yourpassword
```

部署到 Vercel
1. 将该仓库导入 Vercel。
2. 设置环境变量 `BASIC_AUTH_USER` / `BASIC_AUTH_PASS`。
3. 直接部署即可。使用默认的 `npm run build` 作为构建命令。

部署到 Cloudflare Pages
1. 将该仓库连接到 Cloudflare Pages。
2. 设置环境变量 `BASIC_AUTH_USER` / `BASIC_AUTH_PASS`。
3. 使用以下构建配置：
   - 构建命令：`npm run pages:build`
   - 输出目录：`.vercel/output/static`
4. 项目已包含 `wrangler.json` 配置文件用于 Cloudflare Workers 部署。

CSV 说明
- CSV 文件包含以下列（按顺序）：
  - openTime（毫秒时间戳）、openTimeISO（ISO 可读）、open、high、low、close、volume、closeTime（毫秒）、closeTimeISO、quoteAssetVolume、trades、takerBase、takerQuote

实现细节与注意事项
- 分页策略：每次请求使用 `startTime` 和 `endTime`，若返回条数 == `limit` 则计算最后一行的 openTime + interval 作为下一次请求的 startTime，直到超出 endTime 或返回条数 < limit。
- 请注意 Binance API 的速率限制（429/418），大量历史数据抓取时请谨慎并加入退避/重试策略。后续可扩展：重试、限速、并发控制、请求断点续传。

源码位置
- `app/page.jsx`：前端页面
- `app/api/klines/route.js`：CSV 下载接口
- `lib/klines.js`：抓取与 CSV 转换逻辑

许可证
- MIT（请根据需要自行补充许可证信息）
