import React, { useState, useEffect } from 'react';
import {Descriptions, Upload, Button, message, Space, Image} from 'antd';
import ProCard from '@ant-design/pro-card';
import {
  ProForm,
  ProFormSelect,
  ProFormText,
  ProFormUploadButton,
  ProFormDatePicker,
} from '@ant-design/pro-form';
import { UploadOutlined } from '@ant-design/icons';
import { getLoginUserUsingGET, updateUserUsingPOST } from '@/services/yslapi-backend/userController';

const PersonalCenter = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [userInfo, setUserInfo] = useState(
    {
      userName: '嘿嘿',
      // userAvatar: 'https://pic.qqtn.com/up/2019-11/2019112309112420225.jpg',
      userInfo: 'Some user info',
      userRole: 'admin',
      gender: '1',
      accessKey: '1234567',
      secretKey: '1234567',
      userPassword: '******',
      createTime: '2023-01-15 14:30:00',}
  );

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const res = await getLoginUserUsingGET();
        setUserInfo(res.data);
        // userInfo.gender = userInfo.gender === '1' ? '男' : (userInfo.gender === '0' ? '女' : '');
      } catch (error) {
        console.error('获取用户信息失败', error);
      }
    };

    fetchUserInfo();
  }, []);

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleSaveClick = async (values) => {
    try {
      // 模拟更新用户信息
      const updatedUserInfo = { ...userInfo, ...values };
      // 将更新后的用户信息发送到服务器
       await updateUserUsingPOST(updatedUserInfo);
      setIsEditing(false);
      const res = await getLoginUserUsingGET();
      setUserInfo(res.data);
      message.success('用户信息更新成功');
    } catch (error) {
      console.error('保存用户信息失败', error);
    }
  };

  const handleCancelClick = () => {
    setIsEditing(false);
  };

  const handleFileChange = (info) => {
    if (info.file.status === 'done') {
      message.success(`${info.file.name} 上传成功`);
    } else if (info.file.status === 'error') {
      message.error(`${info.file.name} 上传失败`);
    }
  };

  return (

      <ProCard>
        <ProForm
          onFinish={handleSaveClick}
          initialValues={userInfo}
          submitter={false}
        >
            {/* 第一列 */}
            <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
              <div style={{ backgroundColor: '#f0f2f5', border: '1px solid #d9d9d9', padding: '16px', borderRadius: '4px', width: '300px', height: '500px', marginRight: '16px' }}>
                <ProFormText name="userName" label="姓名" readonly={!isEditing} />
                {isEditing ? (
                  <ProFormUploadButton
                    name="userAvatars"
                    label="头像"
                    readonly={false}
                    customRequest={({ file }) => {
                      const formData = new FormData();
                      formData.append('file', file);
                    }}
                    showUploadList={false}
                    beforeUpload={() => false}
                  >
                    <Button icon={<UploadOutlined />}>上传头像</Button>
                  </ProFormUploadButton>
                ) : (
                  <ProFormText label="用户头像">
                    <Image src={userInfo.userAvatar} width={100}/>
                  </ProFormText>
                )}
                <ProFormText name="userRole" label="用户角色" readonly={!isEditing}>
                  {userInfo.userRole === 'admin' ? (
                    <p>管理员</p>
                  ) : (
                    <p>普通用户</p>
                  )}
                </ProFormText>
                <ProFormSelect
                  name="gender"
                  label="性别"
                  readonly={!isEditing}
                  options={[
                    { label: '男', value: '1' },
                    { label: '女', value: '0' },
                  ]}
                />
                <ProFormText.Password name="password" label="密码" readonly={!isEditing} />
              </div>

              {/* 第二列 */}
              <div style={{ backgroundColor: '#ffffff', border: '1px solid #d9d9d9', padding: '16px', borderRadius: '4px', width: '300px', height: '500px' }}>
                <ProFormText.Password name="accessKey" label="accessKey" readonly>
                  {userInfo.accessKey}
                </ProFormText.Password>
                <ProFormText.Password name="secretKey" label="secretKey" readonly>
                  {userInfo.secretKey}
                </ProFormText.Password>
                <ProFormDatePicker name="createTime" label="用户创建时间" readonly>
                  {new Date(userInfo.createTime).toLocaleString()}
                </ProFormDatePicker>
              </div>

            </div>

          {/* 按钮居中 */}
          <Space style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
            {!isEditing && (
              <Button type="primary" onClick={handleEditClick}>
                编辑
              </Button>
            )}
            {isEditing && (
              <>
                <Button type="primary" onClick={handleCancelClick}>
                  取消
                </Button>
                <Button type="primary" htmlType="submit">
                  保存
                </Button>
              </>
            )}
          </Space>
        </ProForm>
      </ProCard>
  );
};

export default PersonalCenter;
