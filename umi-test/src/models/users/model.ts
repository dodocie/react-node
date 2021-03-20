import { Effect, Reducer, Subscription } from 'umi';
import {getRemoteList, upload, verifyFile} from '../service'
import {UserState} from '../../utils/interface'

type routeEnterEvent = {
  [k: string]: Function
}

export interface UserModelType {
  namespace: 'users';
  state: UserState;
  effects: {
    queryList: Effect;
    uploadFile: Effect;
  };
  reducers: {
    getList: Reducer<UserState>;
    // 启用 immer 之后
    // save: ImmerReducer<IndexModelState>;
  };
  subscriptions: { setup: Subscription };
}

const UserModel:  UserModelType = {
  namespace: 'users',

  state: {
    dataSource: [],
  },

  effects: {
    *queryList({ payload }, { call, put }) {//第一个参数是action，第二个参数是effects。call用来获取service服务端数据
      const dataSource = yield call(getRemoteList)
      yield put({
        type: 'getList',
        payload: {
          dataSource
        }
      })
    },
    *uploadFile({payload}, {call, input}){
      console.log('payload', payload)
      const data = yield call(upload, payload.formData)
    },
    *verifyUpload({payload}, {call, input}){
      console.log('payload', payload)
      const result = yield call(verifyFile, payload.dataStr)
      yield put({
        type: '',
        payload: {
          fileExistResult: result
        }
      })
    }
  },
  reducers: {
    getList(state, action) {
      return {
        ...state,
        ...action.payload,
      }
    },
    // 启用 immer 之后
    // save(state, action) {
    //   state.name = action.payload;
    // },
    getFileExist(state, action){
      return {
        ...state,
        ...action.payload
      }
    }
  },
  subscriptions: {
    setup({ dispatch, history }) {
      const do_nothing = ()=>({})
      const props: routeEnterEvent = {
        '/users': ()=>dispatch({type: 'queryList'}),
      }
      return history.listen(({ pathname }) => {
        (props[pathname]||do_nothing)()
      });
    }
  }
};

export default UserModel;