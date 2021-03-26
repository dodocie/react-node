import {useState, FC} from 'react'
import {connect, Dispatch, Loading} from 'umi'
import {Table, Tag} from 'antd'
import UserModel from './components/UserModel' 
import {UserState, Record} from '../../utils/interface'

interface UserProps {
  users: UserState
  dispatch: Dispatch
}

const Users: FC<UserProps> = ({users, dispatch})=>{
  const {dataSource} = users

  const [showModal, setModalVisible] = useState(false)
  const [curRecord, setCurRecord] = useState({})

  function editHandler(record: Record){
    setModalVisible(true)
    setCurRecord(record)
  }

  function closeModal(){
    setModalVisible(false)
  }

  const columns = [
    {
      title: '姓名',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '年龄',
      dataIndex: 'age',
      key: 'age',
    },
    {
      title: '标签',
      dataIndex: 'tags',
      key: 'tags',
    },
    // {
    //   title: '住址',
    //   dataIndex: 'address',
    //   key: 'address',
    // }, 
    {
      title: '操作',
      key: 'action',
      render: (text: string, record: Record, index: number) => (//见 antd table组件api render函数参数
        <span>
          <a onClick={()=>editHandler(record)}>编辑</a>&nbsp;&nbsp;
          <a onClick={()=>editHandler(record)}>删除</a>
        </span>
      ),
    },
  ];

  return (
    <div>USERS PAGE
    <Table dataSource={dataSource} columns={columns} />;
    <UserModel showModal={showModal} modalAction={closeModal} record={curRecord}></UserModel>
  </div>)
}

const mapState2Props = ({users}: {users: UserState}) => {//users: model.ts namespace:users 
  return {
    users
  }
}

export default connect(mapState2Props)(Users)