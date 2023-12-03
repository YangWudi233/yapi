
import {SortOrder} from "antd/lib/table/interface";
import {PageContainer, ProTable, ActionType, TableDropdown, ProColumns} from '@ant-design/pro-components';
import {Button, Modal, Form, Input, Dropdown, Space, Tag, Table} from 'antd';
import {default as React, useEffect, useRef, useState} from 'react';
import { Image , message} from 'antd';
import {listUserUsingGET} from "@/services/yslapi-backend/userController";
import {deleteUser} from "@/services/swagger/user";
import {updateInterfaceInfoUsingPOST} from "@/services/yslapi-backend/interfaceInfoController";
import {listUserInterfaceInfoByPageUsingGET} from "@/services/yslapi-backend/userInterfaceInfoController";



export default (values: API.User) => {
  const UserInterfaceInfoList = ({ userId }) => {
    const [userList1, setData] = useState([]); // 存放接口数据
    useEffect(() => {
      // 在组件加载时调用接口函数
      listUserInterfaceInfoByPageUsingGET({ userId }) // 传入用户 ID
        .then((response) => {
          // 处理接口返回的数据
          if (response && response.data) {
            setData(response.data); // 更新状态以显示数据
          }
        })
        .catch((error) => {
          console.error('获取数据失败:', error);
        });
    }, [userId]); // 当用户 ID 变化时重新调用
    const columns: ProColumns<API.listUserInterfaceInfoByPageUsingGETParams>[] = [
      {
        title: '接口id',
        dataIndex: 'interfaceInfoId',
        key: 'interfaceInfoId',
      },
      {
        title: '总调用次数',
        dataIndex: 'totalNum',
        key: 'totalNum',
      },
      {
        title: '剩余调用次数',
        dataIndex: 'leftNum',
        key: 'leftNum',
      },
      {
        title: '状态',
        dataIndex: 'status',
        key: 'status',
      },
      {
        title: '更新时间',
        dataIndex: 'updateTime',
        key: 'updateTime',
      },
      {
        title: '操作',
        valueType: 'option',
        key: 'option',
        render: (_, row) => [
          <a
            key="edit1"
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
            onClick={(e) => {
              e.stopPropagation(); // 阻止事件冒泡
              handleRemove(row);
            }}
          >
            删除
          </Button>,
        ],
      },
    ];
    return (
      <ProTable<API.listUserInterfaceInfoByPageUsingGETParams>
        columns={columns}
        actionRef={actionRef}
        cardBordered
        request={async (params, sort, filter) => {
          actionRef.current?.reload();
          console.log(sort, filter);
          const userList1 = await listUserInterfaceInfoByPageUsingGET({
            userId,
            ...params,
          });
          return {
            total: userList1.data.total,
            data: userList1.data.records
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
          pageSize: 3,
          onChange: (page) => console.log(page),
        }}
        dateFormatter="string"
        headerTitle="高级表格"
        toolBarRender={() => [
        ]}
      />

    );
  };
  const [modalVisible, setModalVisible] = useState(false); // 控制对话框的显示和隐藏
  const [interfaceInfo, setInterfaceInfo] = useState({}); // 存储接口信息
  const [form] = Form.useForm(); // 创建一个表单
    const [isInterfaceInfoModalVisible, setIsInterfaceInfoModalVisible] = useState(false); // 控制弹窗显示和隐藏的状态
    const [selectedUser, setSelectedUser] = useState(null); // 存储选中的用户
    // ... 其他状态和逻辑 ...
    const showUserInterfaceInfo = (record) => {
      setSelectedUser(record); // 设置选中的用户
      setIsInterfaceInfoModalVisible(true); // 显示弹窗
    };
  const showInterfaceInfo = (record) => {
    setModalVisible(true); // 显示对话框
    setInterfaceInfo(record); // 设置接口信息到状态
    form.setFieldsValue({
      // 设置表单初始值
      totalCalls: record.totalCalls,
      remainingCalls: record.remainingCalls,
    });
  };
  const handleSave = async () => {
    try {
      const values = await form.validateFields(); // 获取表单数据
      const result = await updateInterfaceInfoUsingPOST({
        id: interfaceInfo.id,
        totalCalls: values.totalCalls,
        remainingCalls: values.remainingCalls,
      });
      if (result) {
        message.success('保存成功');
        setModalVisible(false); // 隐藏对话框
      }
    } catch (error) {
      message.error('保存失败，' + error.message);
    }
  };
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
      title: '操作',
      valueType: 'option',
      editable: false,
      key: 'option',
      render: (_, row) => (
        <button
          key="edit"
          onClick={() => showUserInterfaceInfo(row)}
        >
          编辑
        </button>
      ),
    }
    ,
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

    {
      title: '操作',
      valueType: 'option',
      key: 'option',
      render: (_, row) => [
        <a
          key="edit"
          onClick={(e) => {
            e.stopPropagation(); // 阻止事件冒泡
            actionRef.current?.startEditable?.(row.id);
          }}
        >
          编辑
        </a>,
        <Button
          type="text"
          key="config"
          danger
          onClick={(e) => {
            e.stopPropagation(); // 阻止事件冒泡
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
      pageSize: 3,
      onChange: (page) => console.log(page),
    }}
      dateFormatter="string"
      headerTitle="高级表格"
      toolBarRender={() => [
    ]}
      />
      <Modal
        title="用户接口信息"
        visible={isInterfaceInfoModalVisible}
        onOk={() => setIsInterfaceInfoModalVisible(false)} // 关闭弹窗
        onCancel={() => setIsInterfaceInfoModalVisible(false)} // 关闭弹窗
        width={800} // 设置宽度
        height={600} // 设置高度
      >
        {/* 在这里显示 UserInterfaceInfoList 的信息 */}
        {selectedUser && <UserInterfaceInfoList userId={selectedUser.id} />}
      </Modal>
    </PageContainer>
      );
      };
