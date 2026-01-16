'use client';

import React from 'react';
import { Button, Card, DatePicker, Form, Input, Select, Space, Tag, Typography } from 'antd';

const { RangePicker } = DatePicker;
const { Title, Paragraph, Text } = Typography;

const intervalOptions = [
  '1s',
  '1m',
  '3m',
  '5m',
  '15m',
  '30m',
  '1h',
  '2h',
  '4h',
  '6h',
  '12h',
  '1d',
  '1w',
  '1M',
].map((value) => ({ label: value, value }));

export default function Home() {
  const [form] = Form.useForm();

  const onFinish = (values) => {
    const [start, end] = values.range;
    const params = new URLSearchParams({
      mode: values.mode,
      symbol: values.symbol.trim().toUpperCase(),
      interval: values.interval,
      start: String(start.valueOf()),
      end: String(end.valueOf()),
    });

    window.location.href = `/api/klines?${params.toString()}`;
  };

  return (
    <main className="page">
      <div className="shell dashboard">
        <aside className="sidebar">
          <div className="sidebar-title">工具箱</div>
          <div className="nav-list">
            <div className="nav-item nav-item-active">
              <span>K 线下载器</span>
              <small>历史行情 CSV 下载</small>
            </div>
            <div className="nav-item">
              <span>指标批量计算</span>
              <small>均线、波动率、成交量</small>
            </div>
            <div className="nav-item">
              <span>回测任务管理</span>
              <small>策略回测执行与日志</small>
            </div>
            <div className="nav-item">
              <span>数据健康检查</span>
              <small>缺口检测与报告</small>
            </div>
          </div>
        </aside>

        <div>
          <Card className="tool-card">
            <Space direction="vertical" size={16} style={{ width: '100%' }}>
              <Title level={3} style={{ margin: 0 }}>
                K 线下载器
              </Title>
              <Form
                form={form}
                layout="vertical"
                onFinish={onFinish}
                initialValues={{ mode: 'spot', interval: '1h' }}
              >
                <Form.Item
                  label="市场"
                  name="mode"
                  rules={[{ required: true, message: '请选择市场。' }]}
                >
                  <Select
                    options={[
                      { label: '现货', value: 'spot' },
                      { label: '合约', value: 'futures' },
                    ]}
                  />
                </Form.Item>

                <Form.Item
                  label="交易对"
                  name="symbol"
                  rules={[{ required: true, message: '请输入交易对，例如 BTCUSDT。' }]}
                >
                  <Input placeholder="BTCUSDT" />
                </Form.Item>

                <Form.Item
                  label="K 线周期"
                  name="interval"
                  rules={[{ required: true, message: '请选择周期。' }]}
                >
                  <Select options={intervalOptions} />
                </Form.Item>

                <Form.Item
                  label="时间范围"
                  name="range"
                  rules={[{ required: true, message: '请选择时间范围。' }]}
                >
                  <RangePicker showTime style={{ width: '100%' }} />
                </Form.Item>

                <Form.Item>
                  <Button type="primary" htmlType="submit" block size="large">
                    下载 CSV
                  </Button>
                </Form.Item>
              </Form>
              <Text className="tool-muted">
                文件按需生成并直接下载。范围过大可能耗时更久。
              </Text>
            </Space>
          </Card>
        </div>
      </div>
    </main>
  );
}
