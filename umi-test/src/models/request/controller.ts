import { Effect, Reducer } from 'umi';


type Ctrl <k extends object, v> = {
  [k: string] : WeakMap<k, v>
}

type S = AbortSignal
type V = AbortController

export interface ControllerState{
  controllers: Ctrl<S, V>
}

export interface ControllerType {
  namespace: 'controller';
  state: ControllerState;
  effects: {
    abortRequest: Effect;
    getControllers: Effect
  };
  reducers: {
    setSignal: Reducer,
    deleteController: Reducer,
    clearController: Reducer
  };
  subscriptions: {  };
}
const UserModel:  ControllerType = {
  namespace: 'controller',

  state: {
    controllers: {}
  },
  effects: {
    *abortRequest({ payload: {fetchType, signalList} }, { put, select }){
      const controllers = yield select((state)=>state.controller.controllers)
      const requestMap = controllers[fetchType]
      signalList.forEach((signal: AbortSignal)=>requestMap.has(signal) && requestMap.get(signal).abort())
      yield put({
        type: 'clearController',
        payload: {fetchType}
      })
    },
    *getControllers({ payload}, { put }){
      yield put({
        type: 'setSignal',
        payload
      })
    }
  },
  reducers: {
    setSignal(state, {payload: {controller, fetchType}}){
      const map = state.controllers[fetchType] || new WeakMap()
      const {signal} = controller
      map.set(signal, controller)
      state.controllers[fetchType] = map
      return state
    },
    deleteController(state, {payload: {controller, fetchType}}){
      const {controllers} = state
      const {signal} = controller
      const map = controllers[fetchType]
      map.has(signal) && map.delete(signal)
      controllers[fetchType] = map
      return {controllers}
    },
    clearController(state, {fetchType}){
      const {controllers} = state
      controllers[fetchType] = new WeakMap()
      return {controllers}
    }
  },
  subscriptions: {
    
  }
};

export default UserModel;