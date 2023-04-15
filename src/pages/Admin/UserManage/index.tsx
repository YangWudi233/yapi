import { EllipsisOutlined, PlusOutlined } from '@ant-design/icons';
import {SortOrder} from "antd/lib/table/interface";
import { PageContainer,ProTable, ActionType, TableDropdown } from '@ant-design/pro-components';
import { Button, Dropdown, Space, Tag } from 'antd';
import {default as React, useRef, useState } from 'react';
// import {searchUser} from "@/services/ant-design-pro/api";
import { Image , message} from 'antd';
import {listUserUsingGET} from "@/services/yslapi-backend/userController";
import {deleteUser} from "@/services/swagger/user";
// const reloadOne = async (fields: API.User) => {
//     actionRef.current?.reload();
// };

export default (values: API.User) => {
//  const [ handleModalOpen] = useState<boolean>(false);
  const actionRef = useRef<ActionType>();
  const handleRemove = async (record: API.User) => {
    const hide = message.loading('正在删除');
    if (!record) return true;
    try {
      await deleteUser({
        id: record.id
      });
      hide();
      message.success('删除成功');
      actionRef.current?.reload();
      return true;
    } catch (error: any) {
      hide();
      message.error('删除失败，'+error.message);
      return false;
    }
  };
  const columns: ProColumns<API.User>[] = [
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
      hideInSearch:true,
      render: (_,recode) => (
        <div>
          <Image src={recode.userAvatar} width={100}/>
        </div>
      ),
      hide: true,
    },
    {
      title: '性别',
      dataIndex: 'gender',
      valueType: 'select',
      valueEnum: {
        1: { text: '男'},
        0: {
          text: '女'
        },
      },
    },
    {
      title: 'secretKey',
      dataIndex: 'secretKey',
      copyable: true,
    },
    {
      title: 'accessKey',
      dataIndex: 'accessKey',
      copyable: true,
    },
    {
      title: '角色',
      dataIndex: 'userRole',
      valueType: 'select',
      valueEnum: {
        'user': { text: '普通用户',status:'Default'},
        'admin': {
          text: '管理员',
          status: 'Success',
        },
      },
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      valueType: 'date',
      // hideInTable: true // 列表隐藏
    },
    {
      title: '更新时间',
      dataIndex: 'updateTime',
      valueType: 'date',
      // hideInTable: true // 列表隐藏
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
      render: (_, row) => [
        <a
          key="edit"
          onClick={() => {
            actionRef.current?.startEditable?.(row.id);
          }}
        >
          编辑
        </a>,
        <Button
          type="text"
          key="config"
          danger
          onClick={() => {
            handleRemove(row);
          }}
        >
          删除
        </Button>,
      ],
    },
  ];

  return (
    <PageContainer>
    <ProTable<API.User>
      columns={columns}
      actionRef={actionRef}
      cardBordered
      request={async(params,sort:Record<string,SortOrder>,filter:Record<string,(string|number)[]|null>)=>{
      actionRef.current?.reload();
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
    ]}
      />
    </PageContainer>
      );
      };
