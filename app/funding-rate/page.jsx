'use client';

import React from 'react';
import { Button, Card, DatePicker, Form, Input, Space, Typography } from 'antd';
import { Sidebar } from '../components/Sidebar';

const { RangePicker } = DatePicker;
const { Title, Text } = Typography;

export default function FundingRatePage() {
  const [form] = Form.useForm();

  const onFinish = (values) => {
    const [start, end] = values.range;
    const params = new URLSearchParams({
      symbol: values.symbol.trim().toUpperCase(),
      start: String(start.valueOf()),
      end: String(end.valueOf()),
    });

    window.location.href = `/api/funding-rate?${params.toString()}`;
  };

  return (
    <main className="page">
      <div className="shell dashboard">
        <Sidebar />

        <div>
          <Card className="tool-card">
            <Space direction="vertical" size={16} style={{ width: '100%' }}>
              <Title level={3} style={{ margin: 0 }}>
                U 本位合约资金费率下载器
              </Title>
              <Form
                form={form}
                layout="vertical"
                onFinish={onFinish}
                initialValues={{}}
              >
                <Form.Item
                  label="交易对"
                  name="symbol"
                  rules={[{ required: true, message: '请输入交易对，例如 BTCUSDT。' }]}
                >
                  <Input placeholder="BTCUSDT" />
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
