import { MouseEv } from '@/utils/interface'
import {Modal, Form, Input} from 'antd'
import React, {useEffect} from 'react'
import {Record} from '../../../utils/interface'


type props = {
  showModal: boolean
  record: Record
  modalAction: MouseEv
}

const layout = {//horizontal layout 在小于575px时无效
  labelCol: { span: 4 },
  wrapperCol: { span: 8 },
};

const UserModel = (props: props) => {
  const {showModal, modalAction, record} = props
  const [form] = Form.useForm()

  useEffect(()=>form.setFieldsValue(record), [showModal])//为了防止在render期间触发数据更新(cb是antd from的函数)

  const onFinish = (values: any) => {
    console.log('Success:', values);
  };

  const onFinishFailed = (errorInfo: any) => {
    console.log('Failed:', errorInfo);
  };
  return (
    <div>
      <Modal title='basic modal' visible={showModal} onOk={modalAction} onCancel={modalAction} forceRender>
        <Form layout="horizontal" form={form} name="basic" onFinish={onFinish} onFinishFailed={onFinishFailed}>
          <Form.Item name="name" label="Name" rules={[{ required: true, message: '请输入名字' }]}>
            <Input />
          </Form.Item>
        </Form>  
      </Modal>
    </div>
  )
}

export default UserModel