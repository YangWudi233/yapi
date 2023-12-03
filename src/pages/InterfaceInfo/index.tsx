import { PageContainer } from '@ant-design/pro-components';
import React, {useEffect, useState} from 'react';
import {Button, Card, Image, Descriptions, Divider, Form, Input, message, Modal, Select, Upload} from "antd";


import {
  getInterfaceInfoByIdUsingGET, invokeInterfaceInfoUsingPOST, updateInterfaceInfoUsingPOST,
} from "@//services/yslapi-backend/interfaceInfoController";
import {useParams} from "@@/exports";
import {getLoginUserUsingGET} from "@/services/yslapi-backend/userController";
import {UploadOutlined} from "@ant-design/icons";
import {ProFormUploadButton} from "@ant-design/pro-form";
import { v4 as uuidv4 } from 'uuid'; // 使用uuid库生成唯一标识符

  /**
   * 主页
   * @constructor
   */
  const Index: React.FC = () => {

    const [loading, setLoading] = useState(false);
    const [data, setData] = useState<API.InterfaceInfo>();
    const [userdata, setUserData] = useState<API.User>();
    const params = useParams();
    const [invokeRes,setInvokeRes]= useState<any>();
    const [invokeLoading,setInvokeLoading] = useState(false);
    const { Option } = Select;
    const [remainingCount, setRemainingCount] = useState(0); // 初始次数
    const fetchRemainingCount = async (userId, interfaceId) => {
      try {
        // 获取剩余次数的 API 调用
        const response = await fetch(`http://localhost:7529/api/userInterfaceInfo/getLeftNum?userId=${userId}&interfaceInfoId=${interfaceId}`);
        const data = await response.json();
        // 用新的次数更新状态
        setRemainingCount(data.data.leftNum);
      } catch (error) {
        console.error('获取剩余次数时发生错误:', error.message);
      }
    };
    const loadData = async () =>{
      if (!params.id){
        message.error('参数不存在')
        return ;
      }
      setLoading(true);
      try {
        const res = await getInterfaceInfoByIdUsingGET({
          id: Number(params.id)
        });
        const userRes = await getLoginUserUsingGET();
        setUserData(userRes.data);
        setData(res.data);
      } catch (error: any) {
        message.error('请求失败,'+error.message);
        return false;
      }
      setLoading(false);
    }
    useEffect(() => {
      loadData();
      const userId = userdata?.id;
      const interfaceId = params.id;
      fetchRemainingCount(userId, interfaceId);
    },[params.id, userdata?.id]);

    const [downloadStatus, setDownloadStatus] = useState(''); // 状态初始化为空字符串

    const handleDownload = (e, link, index) => {
      e.preventDefault(); // 阻止默认行为

      setDownloadStatus(`下载中 ${index + 1}...`);

      fetch(link)
        .then((response) => response.blob())
        .then((blob) => {
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.style.display = 'none';
          a.href = url;
          a.download = `download${index + 1}`;
          document.body.appendChild(a);
          a.click();
          window.URL.revokeObjectURL(url);
          setDownloadStatus(`下载完成 ${index + 1}`);
        })
        .catch(() => {
          setDownloadStatus(`下载失败 ${index + 1}`);
        });
    };

    const onFinish = async (values: any) => {
      if (!params.id){
        message.error('接口不存在')
        return ;
      }
      setInvokeLoading(true);

      try {
        const res = await invokeInterfaceInfoUsingPOST({
          id: params.id,
          ...values,
        });
        setInvokeRes(JSON.parse(res.data));
        message.success('操作成功');
      } catch (error: any) {
        message.error('操作失败'+error.message);
      }
      setInvokeLoading(false);
    };
      const [modalVisible, setModalVisible] = useState(false);
      const [form] = Form.useForm();

      const showModal = () => {
        setModalVisible(true);
      };

      const handleCancel = () => {
        setModalVisible(false);
      };
    const handleRecharge = async (values) => {
      console.log('Form values:', values);
      try {
        const { mount, interfaceId, interfaceName } = values;
        console.log('F:', values);
        const res = await fetch(`http://localhost:7529/api/aliPay/?mount=${mount}&interfaceId=${interfaceId}&interfaceName=${interfaceName}`);
        const htmlContent = await res.text();
        console.log('F:', htmlContent);
        handleHtmlResponse(htmlContent);
      } catch (error) {
        message.error('充值失败');
      }
    };
    const handleHtmlResponse = (htmlContent) => {
      // Display the HTML content in a modal or new window
      // Example using a modal:
      const newWindow = window.open();
      newWindow.document.write(htmlContent);
    };

    const customRequest = async ({ file, onSuccess }) => {
      // 在这里处理文件上传逻辑
      // 你可以使用 fetch 或 axios 等工具将文件上传到服务器
      // 成功后调用 onSuccess
      try {
        // 模拟上传成功
        setTimeout(() => {
          onSuccess();
          // 文件上传成功后手动调用表单的 submit 方法
          form.submit();
        }, 1000);
      } catch (error) {
        message.error('文件上传失败');
      }
    };
      const renderRechargeButton = () => {
        return (
          <Button type="primary" onClick={showModal} style={{ marginRight: '10px' }}>
            充值
          </Button>
        );
      };

      const renderRemainingTimes = () => {

        return (
          <span style={{ marginRight: '10px' }}>
        剩余次数：{remainingCount}
      </span>
        );
      };
  return (
    <PageContainer title={"查看接口文档"}
                   extra={[
                     renderRemainingTimes(),
                     renderRechargeButton(),
                   ]}>
      <Card>
        {data? (
            <Descriptions title={data.name} column={1}>
              <Descriptions.Item label="描述">{data.description}</Descriptions.Item>
              <Descriptions.Item label="接口状态">{data.status?'正常':'关闭'}</Descriptions.Item>
              <Descriptions.Item label="请求地址">{data.url}</Descriptions.Item>
              <Descriptions.Item label="请求方法">{data.method}</Descriptions.Item>
              <Descriptions.Item label="请求参数">{data.requestParams}</Descriptions.Item>
              <Descriptions.Item label="请求头">{data.requestHeader}</Descriptions.Item>
              <Descriptions.Item label="响应头">{data.responseHeader}</Descriptions.Item>
              <Descriptions.Item label="创建时间">{data.createTime}</Descriptions.Item>
              <Descriptions.Item label="更新时间">{data.updateTime}</Descriptions.Item>
            </Descriptions>
        ):(<>接口不存在</>)}
      </Card>
      <Divider/>
      <Card title="在线测试">
        <Form
          name="invoke"
          initialValues={{remember: true}}
          onFinish = {onFinish}
          >
          {data && (data.id === 6 || data.id === 7 || data.id === 8) ? (
            <ProFormUploadButton
              name="file"
              label="文件"
              readonly={false}
              // action="http://localhost:7529/api/file/upload"
              onChange={({ file }) => {
                const uniqueFileName = `${uuidv4()}-${file.name}`;
                console.log('Custom request triggered:', file);
                const formData = new FormData();
                formData.append('uniqueFileName', uniqueFileName); // 将唯一文件名作为参数传递给后端
                formData.append('file', file); // 确保 'file' 与后端接收文件的参数名称一致
                fetch('http://localhost:8000/api/file/upload', {
                  method: 'POST',
                  body: formData,
                  headers: {
                    'Content-Type': 'multipart/form-data', // 设置正确的 Content-Type
                  },
                });
              }}
            >
              <Button icon={<UploadOutlined />}>上传文件</Button>
            </ProFormUploadButton>
            // 显示上传按钮
          ) : (
            // 显示调用按钮
            <Form.Item
              label="请求参数"
              name="userRequestParams"
              layout="vertical"
            >
              <Input.TextArea placeholder={data ? data.requestParams : '在此输入请求参数'} />
            </Form.Item>
          )}

          <Form.Item wrapperCol={{span: 16}}>
            <Form.Item wrapperCol={{ span: 16 }}>
              <Button type="primary" htmlType="submit">
                调用
              </Button>
            </Form.Item>
          </Form.Item>
        </Form>
      </Card>
      <Divider/>
      <Card title="返回结果" loading={invokeLoading}>
        {Array.isArray(invokeRes) && invokeRes.length > 0 ? (
          <div style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap' }}>
            {invokeRes.map((item, index) => (
              <div key={index} style={{ flex: '0 0 30%', margin: '10px', textAlign: 'center' }}>
                {item.title === 'error' ? (
                  <div>
                    <h3>{item.title}</h3>
                    <p style={{ color: 'red', fontWeight: 'bold' }}>
                      {item.error}
                    </p>
                  </div>
                ) : (
                  <div>
                    {/*歌单下载*/}
                  {item?.musicUrl ? (
                      <div>
                          <Image
                            src={item.picUrl}
                            alt={`Image ${index}`}
                            style={{ maxWidth: '100%', maxHeight: '200px', cursor: 'pointer' }}
                          />
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                          <h3>{item.title}</h3>
                          <a href={item.musicUrl} target="_blank" download>
                            下载
                          </a>
                        </div>
                      </div>

                    ):(
                      /*图片展示*/
                    <div>
                      <a href={item.url} target="_blank" rel="noopener noreferrer">
                        <Image
                          src={item.url}
                          alt={`Image ${index}`}
                          style={{ maxWidth: '100%', maxHeight: '200px', cursor: 'pointer' }}
                        />
                      </a>
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <h3>{item.title}</h3>
                        <a href={item.url} target="_blank" download>
                          下载
                        </a>
                      </div>
                    </div>
                  )}
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div>
            {/*单层数组判断*/}
            {invokeRes !== null && invokeRes !== undefined ? (
                /*数组图片*/
                <div>
                  {/*二维码链接和单个图片显示*/}
                  {invokeRes?.title && invokeRes?.url   ? (
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                      <a href={invokeRes.url} target="_blank" rel="noopener noreferrer">
                        <Image
                          src={invokeRes.url}
                          style={{ maxWidth: '100%', maxHeight: '200px', cursor: 'pointer' }}
                        />
                      </a>
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <h3>{invokeRes.title}</h3>
                        <a href={invokeRes.url} target="_blank" download>
                          下载
                        </a>
                      </div>
                    </div>
                  ) : (
                    <p style={{ color: 'red', fontWeight: 'bold' }}>
                    </p>
                  )}
                  {/*单个歌曲*/}
                  {invokeRes?.title && invokeRes?.musicUrl   ? (
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <h3>{invokeRes.title}</h3>
                        <a href={invokeRes.url} target="_blank" download>
                          下载
                        </a>
                      </div>
                    </div>
                  ) : (
                    <p style={{ color: 'red', fontWeight: 'bold' }}>
                    </p>
                  )}

                  {invokeRes?.title && invokeRes?.address ? (
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                      <p style={{ color: 'red', fontWeight: 'bold' }}>
                        {invokeRes.title}:{invokeRes.address}
                      </p>
                    </div>
                  ) : (
                    <p style={{ color: 'cyan', fontWeight: 'bold' }}>
                    </p>
                  )}
                  {/*语音转文字和视频转文字*/}
                  {invokeRes?.title && invokeRes?.text ? (
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                      <p style={{ color: 'red', fontWeight: 'bold' }}>
                        {invokeRes.title}:{invokeRes.text}
                      </p>
                    </div>
                  ) : (
                    <p style={{ color: 'cyan', fontWeight: 'bold' }}>
                    </p>
                  )}
                  {/*视频转音频*/}
                  {invokeRes?.title && invokeRes?.audioUrl ? (
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                      <p style={{ color: 'red', fontWeight: 'bold' }}>
                        {invokeRes.title}:/n/n{invokeRes.audioUrl}
                      </p>
                      <audio controls>
                        <source src={invokeRes.audioUrl} type="audio/mp3" />
                      </audio>
                    </div>
                  ) : (
                    <p style={{ color: 'cyan', fontWeight: 'bold' }}>
                    </p>
                  )}
                  {invokeRes?.b64_image ? (
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                      <Image
                        src={`data:image/png;base64,${invokeRes.b64_image}`}
                        style={{ maxWidth: '100%', maxHeight: '200px', cursor: 'pointer' }}
                      />
                    </div>
                  ) : (
                    <p style={{ color: 'cyan', fontWeight: 'bold' }}>
                    </p>
                  )}
                  <div style={{ flex: '0 0 30%', margin: '10px', textAlign: 'center' }}>
                    {invokeRes.title === 'error' ? (
                      <div>
                        <h3>{invokeRes.title}</h3>
                        <p style={{ color: 'red', fontWeight: 'bold' }}>
                          {invokeRes.error}
                        </p>
                      </div>
                    ) : (
                      <div>
                        <h3>{invokeRes.Error}</h3>
                        <p style={{ color: 'red', fontWeight: 'bold' }}>
                          {invokeRes.mes}
                        </p>
                      </div>
                    )}
                  </div>
                </div>

              /*直接显示字符*/
              // 处理非数组的情况，直接输出 invokeRes

            ) : (
              <p style={{ color: 'red', fontWeight: 'bold' }}>
                {invokeRes}
              </p>
            )}
          </div>
        )}
      </Card>
      <Modal
        title="充值"
        visible={modalVisible}
        onCancel={handleCancel}
        footer={null}
      >
        <Form
          form={form}
          initialValues={{
            interfaceId: data?.id,
            interfaceName: data?.name || "",
          }}
          onFinish={handleRecharge}
        >
          <Form.Item
            name="interfaceId"
            label="接口ID"
          >
            <Input defaultValue={data?.id} disabled />
          </Form.Item>
          <Form.Item
            name="interfaceName"
            label="接口名字"
          >
            <Input defaultValue={data?.name} disabled />
          </Form.Item>
          <Form.Item
            name="mount"
            label="增加次数"
            rules={[{ required: true, message: '请选择增加的调用次数' }]}
          >
            <Select>
              <Option value={1}>1</Option>
              <Option value={5}>5</Option>
              <Option value={10}>10</Option>
              <Option value={100}>100</Option>
              <Option value={1000}>1000</Option>
              <Option value={10000}>10000</Option>
              <Option value={100000}>100000</Option>
            </Select>
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              保存
            </Button>
          </Form.Item>
        </Form>
      </Modal>


    </PageContainer>
  );
};
    export default Index;
