'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const items = [
  {
    href: '/spot-klines',
    title: '现货 K 线下载器',
    desc: '现货历史行情 CSV',
  },
  {
    href: '/futures-klines',
    title: '合约 K 线下载器',
    desc: '合约历史行情 CSV',
  },
  {
    href: '/funding-rate',
    title: '资金费率下载器',
    desc: 'U 本位合约历史费率',
  },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="sidebar">
      <div className="sidebar-title">工具箱</div>
      <div className="nav-list">
        {items.map((item) => {
          const isActive = item.href !== '#' && pathname === item.href;
          const className = `nav-item${isActive ? ' nav-item-active' : ''}`;
          if (item.href === '#') {
            return (
              <div key={item.title} className={className}>
                <span>{item.title}</span>
                <small>{item.desc}</small>
              </div>
            );
          }

          return (
            <Link key={item.title} href={item.href} className={className}>
              <span>{item.title}</span>
              <small>{item.desc}</small>
            </Link>
          );
        })}
      </div>
    </aside>
  );
}
