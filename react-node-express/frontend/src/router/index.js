import React, {Component} from 'react'
import {HashRouter, Switch, Route} from 'react-router-dom'
import {
  ApolloClient,
  ApolloProvider,
  createHttpLink
} from '@apollo/client'


import Register          from "../page/register/register"
import Login             from "../page/login/login"
import Home              from "../page/home/home"
import BookList          from "../page/Book/BookList"
import Add               from "../containers/add/add"
import App               from "../App"
import {cache, typeDefs} from '../ApolloState/cache'
import {resolvers}       from "../resolvers/books";

const httpLink = createHttpLink({
  uri: 'http://localhost:5000/graphql'
});

const client = new ApolloClient({
  link: httpLink,
  cache,
  typeDefs
});

export default class RouteConfig extends Component {
  render () {
    return (
        <HashRouter>
          <ApolloProvider client={client}>
            <Route path='/' component={App}></Route>
            <Switch>
              <Route path='/home' component={Home}></Route>
              <Route path='/register' component={Register}></Route>
              <Route path='/login' component={Login}></Route>
              <Route path='/add' component={Add}></Route>
              <Route path='/books' component={BookList}></Route>
            </Switch>
          </ApolloProvider>
        </HashRouter>
    )
  }
}