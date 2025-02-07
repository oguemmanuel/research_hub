"use client"

import React from 'react';


import { DownOutlined, SmileOutlined } from '@ant-design/icons';
import { Dropdown, Space } from 'antd';
const items = [
  {
    key: '1',
    label: (
      <a target="_blank">
        Italian
      </a>
    ),
  },
  {
    key: '2',
    label: (
      <a target="_blank">
        Fench
      </a>
    ),
  },
  {
    key: '3',
    label: (
      <a target="_blank">
        English
      </a>
    ),
  },
  {
    key: '4',
    label: 'Spanish',
  },
];
const DropdownMenuBox = () => (
  <Dropdown
    menu={{
      items,
    }}
  >
    <a onClick={(e) => e.preventDefault()}>
      <Space className='bg-blue-500 text-white px-3 py-2 rounded-md cursor-pointer'>
        Select Language
        <DownOutlined />
      </Space>
    </a>
  </Dropdown>
);
export default DropdownMenuBox;