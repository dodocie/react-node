import React, {Component}   from 'react'
import {Redirect}       from 'react-router-dom'

export default class App extends Component{
    render(){
        return (<Redirect to='/home'/>)
    }
}
