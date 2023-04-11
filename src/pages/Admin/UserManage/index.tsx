import { EllipsisOutlined, PlusOutlined } from '@ant-design/icons';
import { ProTable, TableDropdown } from '@ant-design/pro-components';
import { Button, Dropdown, Space, Tag } from 'antd';
import {default as React, useRef} from 'react';
// import {searchUser} from "@/services/ant-design-pro/api";
import { Image } from 'antd';
import {listUserUsingGET} from "@/services/yslapi-backend/userController";

type GithubIssueItem = {
  url: string;
  id: number;
  number: number;
  title: string;
  labels: {
    name: string;
    color: string;
  }[];
  state: string;
  comments: number;
  created_at: string;
  updated_at: string;
  closed_at?: string;
};

const columns: ProColumns<API.CurrentUser>[] = [
  {
    dataIndex: 'id',
    valueType: 'indexBorder',
    width: 48,
  },
  {
    title: '用户名',
    dataIndex: 'userName',
    copyable: true,
  },
{
  title: '用户账户',
    dataIndex: 'userAccount',
  copyable: true,
},
{
  title: '头像',
    dataIndex: 'userAvatar',
    render: (_,recode) => (
  <div>
    <Image src={recode.userAvatar} width={100}/>
  </div>
),
  copyable: true,
},
{
  title: '性别',
    dataIndex: 'gender',
  copyable: true,
},
{
  title: '秘密',
    dataIndex: 'secretKey',
  copyable: true,
},
{
  title: '通道',
    dataIndex: 'accessKey',
  copyable: true,
},
{
  title: '状态',
    dataIndex: 'userStatus',
  copyable: true,
},
{
  title: '角色',
    dataIndex: 'userRole',
  copyable: true,
  valueType: 'select',
    valueEnum: {
      'admin': { text: '普通用户',status:'Default'},
      'user': {
        text: '管理员',
        status: 'Success',
      },
    },
},
{
  title: '创建时间',
    dataIndex: 'createTime',
  valueType: 'dateRange',
  copyable: true,
},
{
  title: '更新时间',
    dataIndex: 'updateTime',
  valueType: 'dateRange',
  copyable: true,
},
  // {
  //   disable: true,
  //   title: '状态',
  //   dataIndex: 'state',
  //   filters: true,
  //   onFilter: true,
  //   ellipsis: true,
  //   valueType: 'select',
  //   valueEnum: {
  //     all: { text: '超长'.repeat(50) },
  //     open: {
  //       text: '未解决',
  //       status: 'Error',
  //     },
  //     closed: {
  //       text: '已解决',
  //       status: 'Success',
  //       disabled: true,
  //     },
  //     processing: {
  //       text: '解决中',
  //       status: 'Processing',
  //     },
  //   },
  // },
  // {
  //   disable: true,
  //   title: '标签',
  //   dataIndex: 'labels',
  //   search: false,
  //   renderFormItem: (_, { defaultRender }) => {
  //     return defaultRender(_);
  //   },
  //   render: (_, record) => (
  //     <Space>
  //       {record.labels.map(({ name, color }) => (
  //         <Tag color={color} key={name}>
  //           {name}
  //         </Tag>
  //       ))}
  //     </Space>
  //   ),
  // },
  // {
  //   title: '创建时间',
  //   key: 'showTime',
  //   dataIndex: 'created_at',
  //   valueType: 'date',
  //   sorter: true,
  //   hideInSearch: true,
  // },
  // {
  //   title: '创建时间',
  //   dataIndex: 'created_at',
  //   valueType: 'dateRange',
  //   hideInTable: true,
  //   search: {
  //     transform: (value) => {
  //       return {
  //         startTime: value[0],
  //         endTime: value[1],
  //       };
  //     },
  //   },
  // },
  {
    title: '操作',
    valueType: 'option',
    key: 'option',
    render: (text, record, _, action) => [
      <a
        key="editable"
        onClick={() => {
          action?.startEditable?.(record.id);
        }}
      >
        编辑
      </a>,
      <a href={record.url} target="_blank" rel="noopener noreferrer" key="view">
        查看
      </a>,
      <TableDropdown
        key="actionGroup"
        onSelect={() => action?.reload()}
        menus={[
          { key: 'copy', name: '复制' },
          { key: 'delete', name: '删除' },
        ]}
      />,
    ],
  },
];

export default (values: API.CurrentUser) => {
  const actionRef = useRef<ActionType>();
  return (
    <ProTable<API.CurrentUser>
      columns={columns}
      actionRef={actionRef}
      cardBordered
      request={async (params = {}, sort, filter) => {
      console.log(sort, filter);
      const userList = await listUserUsingGET({
        ...params,
    });
      return {
      data: userList.data
      }
    }}
      editable={{
      type: 'multiple',
    }}
      columnsState={{
      persistenceKey: 'pro-table-singe-demos',
      persistenceType: 'localStorage',
      onChange(value) {
        console.log('value: ', value);
      },
    }}
      rowKey="id"
      search={{
      labelWidth: 'auto',
    }}
      options={{
      setting: {
        listsHeight: 400,
      },
    }}
      form={{
      // 由于配置了 transform，提交的参与与定义的不同这里需要转化一下
      syncToUrl: (values, type) => {
        if (type === 'get') {
          return {
            ...values,
            // created_at: [values.startTime, values.endTime],
          };
        }
        return values;
      },
    }}
      pagination={{
      pageSize: 5,
      onChange: (page) => console.log(page),
    }}
      dateFormatter="string"
      headerTitle="高级表格"
      toolBarRender={() => [
      <Button key="button" icon={<PlusOutlined />} type="primary">
        新建
      </Button>,
    ]}
      />
      );
      };
