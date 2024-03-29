import {  removeRule,} from '@/services/ant-design-pro/api';
import { PlusOutlined } from '@ant-design/icons';
import type { ActionType, ProColumns, ProDescriptionsItemProps } from '@ant-design/pro-components';
import {
  FooterToolbar,
  PageContainer,
  ProDescriptions,
  ProTable,
} from '@ant-design/pro-components';
import '@umijs/max';
import { Button, Drawer,  message } from 'antd';
import React, { useRef, useState } from 'react';

import {SortOrder} from "antd/lib/table/interface";
import {
  addInterfaceInfoUsingPOST,
  deleteInterfaceInfoUsingPOST,
  listInterfaceInfoByPageUsingPOST,
  offlineInterfaceInfoUsingPOST,
  onlineInterfaceInfoUsingPOST,
  updateInterfaceInfoUsingPOST
} from "@/services/yslapi-backend/interfaceInfoController";
import CreateModal from "@/pages/Admin/interface_info/components/CreateModal";
import UpdateModal from "@/pages/Admin/interface_info/components/UpdateModal";
import {getInitialState} from "@/app";
const loginPath = 'http://localhost:8000/admin/interface_info';

/**
 * @en-US Add node
 * @zh-CN 添加节点
 * @param fields
 */
/*const handleAdd = async (fields: API.InterfaceInfo) => {
  const hide = message.loading('正在添加');
  try {
    await addInterfaceInfoUsingPOST({
      ...fields,
    });
    hide();
    message.success('创建成功');
    return true;
  } catch (error) {
    hide();
    message.error('Adding failed, please try again!');
    return false;
  }
};*/
const TableList: React.FC = () => {
  /**
   * @en-US Pop-up window of new window
   * @zh-CN 新建窗口的弹窗
   *  */
  const [createModalOpen, handleModalOpen] = useState<boolean>(false);
  /**
   * @en-US The pop-up window of the distribution update window
   * @zh-CN 分布更新窗口的弹窗
   * */
  const [updateModalOpen, handleUpdateModalOpen] = useState<boolean>(false);
  const [showDetail, setShowDetail] = useState<boolean>(false);
  const actionRef = useRef<ActionType>();
  const [currentRow, setCurrentRow] = useState<API.InterfaceInfo>();
  const [selectedRowsState, setSelectedRows] = useState<API.InterfaceInfo[]>([]);
  /**
   * @en-US Add node
   * @zh-CN 添加节点
   * @param fields
   */
    const handleAdd = async (fields: API.InterfaceInfo) => {
    const hide = message.loading('正在添加');
    try {
      await addInterfaceInfoUsingPOST({
        ...fields,
      });
      hide();
      message.success('创建成功');
      actionRef.current?.reload();
      handleModalOpen(false);
      return true;
    } catch (error: any) {
      hide();
      message.error('创建失败，'+error.message);
      return false;
    }
  };

  /**
   *  Delete node
   * @zh-CN 发布接口
   *
   * @param selectedRows
   */
  const handleOnline = async (record: API.IdRequest) => {
    const hide = message.loading('正在发布');
    if (!record) return true;
    try {
      await onlineInterfaceInfoUsingPOST({
        id: record.id
      });
      hide();
      message.success('发布成功');
      actionRef.current?.reload();
      return true;
    } catch (error: any) {
      hide();
      message.error('发布失败，'+error.message);
      return false;
    }
  };

  /**
   *  Delete node
   * @zh-CN 下线接口
   *
   * @param selectedRows
   */
  const handleOffline = async (record: API.IdRequest) => {
    const hide = message.loading('下线中');
    if (!record) return true;
    try {
      await offlineInterfaceInfoUsingPOST({
        id: record.id
      });
      hide();
      message.success('操作成功');
      actionRef.current?.reload();
      return true;
    } catch (error: any) {
      hide();
      message.error('操作失败，'+error.message);
      return false;
    }
  };

  /**
   *  Delete node
   * @zh-CN 删除节点
   *
   * @param selectedRows
   */
  const handleRemove = async (record: API.InterfaceInfo) => {
    const hide = message.loading('正在删除');
    if (!record) return true;
    try {
      await deleteInterfaceInfoUsingPOST({
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
  /**
   * @en-US International configuration
   * @zh-CN 国际化配置
   * */

  /**
   * @en-US Update node
   * @zh-CN 更新节点
   *
   * @param fields
   */
  const handleUpdate = async (fields: API.InterfaceInfo) => {
    if (!currentRow){
      return ;
    }
    const hide = message.loading('操作中');
    try {
      await updateInterfaceInfoUsingPOST({
        id: currentRow.id,
        ...fields
      });
      hide();
      message.success('操作成功');
      // actionRef.current?.reload();
      return true;
    } catch (error: any) {
      hide();
      message.error('操作失败，'+error.message);
      return false;
    }
  };

  const columns: ProColumns<API.InterfaceInfo>[] = [
    {
      title: 'id',
      dataIndex: 'id',
      valueType: 'index',
    },
    {
      title: '接口名称',
      dataIndex: 'name',
      valueType: 'text',
      formItemProps: {
        rules: [{
          required: true,
          message: '接口信息是必填项',
        }
        ]
      }
    },
    {
      title: '描述',
      dataIndex: 'description',
      valueType: 'textarea',
    },

    {
      title: '请求方法',
      dataIndex: 'method',
      width: 48,
    },
    {
      title: '网络地址url',
      // hideInForm:true,
      dataIndex: 'url',
      valueType: 'textarea',

    },
    {
      title: '请求参数',
      dataIndex: 'requestParams',
      // hideInForm:true,
      valueType: 'textarea',
    },
    // {
    //   title: '请求头',
    //   dataIndex: 'requestHeader',
    //   hideInForm:true,
    //   valueType: 'textarea',
    // },
    // {
    //   title: '响应头',
    //   dataIndex: 'responseHeader',
    //   valueType: 'textarea ',
    // },
    {
      title: '状态',
      dataIndex: 'status',
      hideInForm:true,
      valueEnum: {
        0:{text: '关闭'},
        1:{text: '开启'},
      }
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      valueType: 'dateRange',
      hideInTable: true // 列表隐藏
    },
    {
      title: '更新时间',
      dataIndex: 'updateTime',
      valueType: 'dateRange',
      hideInTable: true // 列表隐藏
    },
    {
      title: '操作',
      dataIndex: 'option',
      valueType: 'option',
      render: (_, record) => [
        <a
          key="config"
          onClick={() => {
            handleUpdateModalOpen(true);
            setCurrentRow(record);
          }}
        >
          修改
        </a>,
        record.status === 0 ? <a
          key="config"
          onClick={() => {
            handleOnline(record);
          }}
        >
          发布
        </a>:
         <Button
          type="text"
          key="config"
          danger
          onClick={() => {
            handleOffline(record);
          }}
        >
          下线
        </Button>,
        <Button
          type="text"
          key="config"
          danger
          onClick={() => {
            handleRemove(record);
          }}
        >
          删除
        </Button>,
      ],
    },

  ];
  return (
    <PageContainer>
      <ProTable<API.RuleListItem,API.PageParams>
        headerTitle={'查询表格'}
        columns={columns}
        actionRef={actionRef}
        rowKey="key"
        search={{
          labelWidth: 'auto',
        }}
        toolBarRender={() => [
          <Button
            type="primary"
            key="primary"
            onClick={() => {
            handleModalOpen(true);
          }}
          >
            <PlusOutlined /> 新建
          </Button>,
        ]}
        request = {async (params, sort: Record<string, SortOrder>, filter: Record<string, (string | number)[] | null>) => {
          const res: any = await listInterfaceInfoByPageUsingPOST({
            ...params
          })
          if (res?.data){
            return {
              data: res?.data.records || [],
              success: true,
              total: res.data.total,
            }
          }else {
            return {
              data: [],
              success: false,
              total: 0,
            }
          }
        }}
        rowSelection={{
          onChange: (_, selectedRows) => {
            setSelectedRows(selectedRows);
          },
        }}
      />
      {/*{selectedRowsState?.length > 0 && (*/}
        {/*<FooterToolbar*/}
          {/*extra={*/}
            {/*<div>*/}
              {/*已选择{' '}*/}
              {/*<a*/}
                {/*style={{*/}
                  {/*fontWeight: 600,*/}
                {/*}}*/}
              {/*>*/}
                {/*{selectedRowsState.length}*/}
              {/*</a>{' '}*/}
              {/*项 &nbsp;&nbsp;*/}
              {/*<span>*/}
                {/*服务调用次数总计 {selectedRowsState.reduce((pre, item) => pre + item.callNo!, 0)} 万*/}
              {/*</span>*/}
            {/*</div>*/}
          {/*}*/}
        {/*>*/}
          {/*<Button*/}
            {/*onClick={async () => {*/}
              {/*await handleRemove(selectedRowsState);*/}
              {/*setSelectedRows([]);*/}
              {/*actionRef.current?.reloadAndRest?.();*/}
            {/*}}*/}
          {/*>*/}
            {/*批量删除*/}
          {/*</Button>*/}
          {/*<Button type="primary">批量审批</Button>*/}
        {/*</FooterToolbar>*/}
      {/*)}*/}

      <UpdateModal
        columns={columns}
        onSubmit={async (value) => {
          const success = await handleUpdate(value);
          if (success) {
            handleUpdateModalOpen(false);
            setCurrentRow(undefined);
            if (actionRef.current) {
              actionRef.current.reload();
            }
          }
        }}
        onCancel={() => {
          handleUpdateModalOpen(false);
          if (!showDetail) {
            setCurrentRow(undefined);
          }
        }}
        visible={updateModalOpen}
        values={currentRow || {}}
      />

      <Drawer
        width={600}
        open={showDetail}
        onClose={() => {
          setCurrentRow(undefined);
          setShowDetail(false);
        }}
        closable={false}
      >
        {currentRow?.name && (
          <ProDescriptions<API.RuleListItem>
            column={2}
            title={currentRow?.name}
            request={async () => ({
              data: currentRow || {},
            })}
            params={{
              id: currentRow?.name,
            }}
            columns={columns as ProDescriptionsItemProps<API.RuleListItem>[]}
          />
        )}
      </Drawer>
      <CreateModal columns={columns} onCancel={() => {handleModalOpen(false)}} onSubmit={(values) => {handleAdd(values)}} visible={createModalOpen} />
    </PageContainer>
  );
};
export default TableList;
