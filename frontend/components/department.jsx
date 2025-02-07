"use client"

import React from 'react';

const DEPARTMENTS = [
    "Computer Science", 
    "Environmental Science", 
    "Physics", 
    "Psychology", 
    "Economics", 
    "Medicine", 
    "Engineering", 
    "Mathematics", 
    "Chemistry", 
    "Literature"
  ];


import { DownOutlined, SmileOutlined } from '@ant-design/icons';
import { Dropdown, Space } from 'antd';
const items = [
  {
    key: '1',
    label: (
      <a target="_blank">
        Computer Science
      </a>
    ),
  },
  {
    key: '2',
    label: (
      <a target="_blank">
        Environmental Science
      </a>
    ),
  },
  {
    key: '3',
    label: (
      <a target="_blank">
        Physics
      </a>
    ),
  },
  {
    key: '4',
    label: 'Psychology',
  },
  {
    key: '6',
    label: (
      <a target="_blank">
        Environmental Science
      </a>
    ),
  },
  {
    key: '7',
    label: (
      <a target="_blank">
       Economics
      </a>
    ),
  },
  {
    key: '8',
    label: (
      <a target="_blank">
       Medicine
      </a>
    ),
  },
  {
    key: '9',
    label: (
      <a target="_blank">
       Engineering
      </a>
    ),
  },
  {
    key: '10',
    label: (
      <a target="_blank">
       Mathematics
      </a>
    ),
  },
  {
    key: '11',
    label: (
      <a target="_blank">
       Mathematics
      </a>
    ),
  },
];
const Department = () => (
  <Dropdown
    menu={{
      items,
    }}
  >
    <a onClick={(e) => e.preventDefault()}>
      <Space className='bg-blue-500 text-white px-3 py-2 rounded-md cursor-pointer'>
        Select Department
        <DownOutlined />
      </Space>
    </a>
  </Dropdown>
);
export default Department;