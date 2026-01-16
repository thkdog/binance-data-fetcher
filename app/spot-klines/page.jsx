'use client';

import React, { useEffect } from 'react';
import dayjs from 'dayjs';
import { Button, Card, DatePicker, Form, Input, Select, Space, Typography } from 'antd';
import { Sidebar } from '../components/Sidebar';

const { RangePicker } = DatePicker;
const { Title, Text } = Typography;

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
  '8h',
  '12h',
  '1d',
  '3d',
  '1w',
  '1M',
].map((value) => ({ label: value, value }));

export default function SpotKlinesPage() {
  const [form] = Form.useForm();
  const storageKey = 'spot-kline-form-cache';
  const defaults = { interval: '1h' };

  useEffect(() => {
    const cached = localStorage.getItem(storageKey);
    if (!cached) {
      form.setFieldsValue(defaults);
      return;
    }

    try {
      const parsed = JSON.parse(cached);
      const range = parsed.range?.map((ts) => (ts ? dayjs(ts) : null));
      form.setFieldsValue({ ...defaults, ...parsed, range });
    } catch (err) {
      console.error('Failed to restore spot kline form cache', err);
      form.setFieldsValue(defaults);
    }
  }, [form]);

  const handleValuesChange = (_, allValues) => {
    const payload = {
      ...allValues,
      range: allValues.range?.map((d) => (d ? d.valueOf() : null)),
    };

    try {
      localStorage.setItem(storageKey, JSON.stringify(payload));
    } catch (err) {
      console.error('Failed to cache spot kline form', err);
    }
  };

  const onFinish = (values) => {
    const [start, end] = values.range;
    const params = new URLSearchParams({
      symbol: values.symbol.trim().toUpperCase(),
      interval: values.interval,
      start: String(start.valueOf()),
      end: String(end.valueOf()),
    });

    window.location.href = `/api/spot/klines?${params.toString()}`;
  };

  return (
    <main className="page">
      <div className="shell dashboard">
        <Sidebar />

        <div>
          <Card className="tool-card">
            <Space direction="vertical" size={16} style={{ width: '100%' }}>
              <Title level={3} style={{ margin: 0 }}>
                现货 K 线下载器
              </Title>
              <Form
                form={form}
                layout="vertical"
                onFinish={onFinish}
                initialValues={defaults}
                onValuesChange={handleValuesChange}
              >
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
                  <RangePicker style={{ width: '100%' }} />
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
