import {useState, FC} from 'react'
import {connect, Dispatch} from 'umi'
import {ControllerState} from '../models/request/controller'

interface AbortCtrl {
  styles?: string[]
}
interface AbortProps {
  controller: ControllerState
  dispatch: Dispatch
  signalList: AbortSignal[]
  fetchType: string
  styles?: string[]
  handler: Function
}
const Abort: FC<AbortProps> = ({controller, styles, dispatch, signalList, fetchType, handler}) => {
  const abort = () => {
    dispatch({type: 'controller/abortRequest', payload: {signalList, fetchType}})
    handler()
  }
  const classNames = styles?.join(' ')
  return (
    <p className={`abort-button ${classNames}`} onClick={abort}>pause</p>
  )
}

const mapState2Props = ({controller}: {controller: ControllerState}) => {
  return {
    controller
  }
}

export default connect(mapState2Props)(Abort)