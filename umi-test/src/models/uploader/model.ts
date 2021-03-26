import { Effect, Reducer, Subscription } from 'umi';
import {upload, verifyFile} from '../service'

type routeEnterEvent = {
  [k: string]: Function
}

type fileResult = {
  shouldUpload: boolean
  uploadList?: []
}
export interface UploaderState {
  fileExistResult: fileResult
}
export interface UploaderModelType {
  namespace: 'uploader';
  state: UploaderState;
  effects: {
    uploadFile: Effect;
    verifyUpload: Effect
  };
  reducers: {
    getFileExist: Reducer<UploaderState>;
    // 启用 immer 之后
    // save: ImmerReducer<IndexModelState>;
  };
  subscriptions: { setup: Subscription };
}

const UploaderModel:  UploaderModelType = {
  namespace: 'uploader',

  state: {
    fileExistResult: {
      shouldUpload: true
    }
  },

  effects: {
    *uploadFile({payload: {formData, controller, fetchType}}, {call, put, select}){
      const {signal} = controller
      yield put({
        type: 'controller/setSignal',
        payload: {
          controller,
          fetchType
        }
      })
      const data = yield call(upload, formData, signal)
      // yield put({
      //   type: 'controller/deleteController',
      //   payload: {
      //     controller,
      //     fetchType
      //   }
      // })
    },
    *verifyUpload({payload}, {call, put}){
      const fileExistResult = yield call(verifyFile, payload.dataStr)
      yield put({
        type: 'getFileExist',
        payload: {
          fileExistResult
        }
      })
    }
  },
  reducers: {
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

export default UploaderModel;