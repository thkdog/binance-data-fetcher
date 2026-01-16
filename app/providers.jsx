'use client';

import React from 'react';
import { ConfigProvider, theme } from 'antd';

const appTheme = {
  algorithm: theme.defaultAlgorithm,
  token: {
    colorPrimary: '#1f6feb',
    colorInfo: '#1f6feb',
    colorSuccess: '#2ea043',
    colorWarning: '#d29922',
    colorError: '#cf222e',
    borderRadius: 8,
    fontFamily: "'IBM Plex Sans', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
  },
};

export function Providers({ children }) {
  return <ConfigProvider theme={appTheme}>{children}</ConfigProvider>;
}
