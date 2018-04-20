import React, { Component } from 'react';

import PerfectScrollbar from 'react-perfect-scrollbar';

import Login from './components/Login';
import NewTopic from './components/NewTopic';
import Thumb from './components/Thumb';
import Topic from './components/Topic';

import 'react-perfect-scrollbar/dist/css/styles.css';
import './css/main.css';

export default class App extends Component {
  state = {
    topics: [],
    currentTopic: -1,
    mode: 2, // 0: reading, 1: creating, 2: login, 3: nothing
    userID: -1,
  };
  lastSeen = new Map();
  socket = undefined;

  static formatComment(comment) {
    comment.timestamp = new Date(comment.timestamp);
    return comment;
  }
  static formatTopic(topic) {
    topic.comments = topic.comments.map(App.formatComment);
    return topic;
  }
  componentWillMount() {
    this.connect();
  }
  connect() {
    const socket =
      this.socket = global.io.connect('http://localhost:8080');
    
    socket
      .on('pong', (...e) => {
        console.log('pong', ...e);
      })
      .on('login', (ok, user) => {
        if (!ok) return;
        this.setState({ userID: user.id, mode: 3 });
      })
      .on('newTopic', (topic) => {
        topic = App.formatTopic(topic);
        this.state.topics.push(topic);
        this.forceUpdate();
      })
      .on('newComment', (topicID, comment) => {
        const index = this.state.topics.findIndex(topic => topic.id === topicID);
        if (index < 0) return;
        const topic = this.state.topics[index];
        App.formatComment(comment);
        topic.comments.push(comment);
        this.state.topics.splice(index, 1);
        this.state.topics.unshift(topic);
        if (topic.id === this.state.currentTopic)
          this.lastSeen.set(topic.id, new Date());
        this.forceUpdate();
      })
      .on('createTopic', (topic) => {
        this.openTopic(topic.id);
      })
      .on('topics', (topics) => {
        topics = topics.map(App.formatTopic);
        this.setState({ topics });
      })
      ;

    socket.emit('ping', 'test');
  }
  openTopic = (id) => {
    this.lastSeen.set(id, new Date());
    this.setState({ mode: 0, currentTopic: id });
  }
  showTopicCreation = () => {
    this.setState({ mode: 1 });
  }
  postComment = (content) => {
    if (this.state.currentTopic < 0) return;
    this.socket.emit('createComment', { topicID: this.state.currentTopic, content });
  }
  submitLogin = (username, avatar) => {
    this.socket.emit('login', { username, avatar });
  }
  getCurrentTopic() {
    return this.state.topics.find(topic => topic.id === this.state.currentTopic);
  }
  showContent() {
    switch (this.state.mode) {
      case 0: return ( <Topic comments={ this.state.currentTopic >= 0 ? this.getCurrentTopic().comments : null } postComment={ this.postComment } isLogged={ this.state.userID >= 0 } /> );
      case 1: return ( <NewTopic onDone={ this.createTopic } /> );
      case 2: return ( <Login onDone={ this.submitLogin } /> )
      default: return undefined;
    }
  }
  showThumbs() {
    return this.state.topics.map(
      (topic) => (
        <Thumb key={ topic.id } topic={ topic } lastSeen={ this.lastSeen.get(topic.id) } isSelected={ this.state.mode === 0 && topic.id === this.state.currentTopic } openTopic={ this.openTopic } />
      )
    );
  }
  showLogin = () => {
    this.setState({ mode: 2 });
  }
  showMainButton() {
    return this.state.userID < 0
      ? (
        <input type='button' value='Login' className='Input Button' onClick={ this.showLogin } />
      ) : (
        <input type='button' value='Create a new topic' className='Input Button' onClick={ this.showTopicCreation } />
      );
  }
  createTopic = (title, content) => {
    this.socket.emit('createTopic', { title, content });
  }
  render() {
    return (
      <div className='App'>
        <div className='LeftContainer'>
          <PerfectScrollbar option={{ suppressScrollX: true }}>
            { this.showThumbs() }
            <div className='MenuButton'>
              { this.showMainButton() }
            </div>
          </PerfectScrollbar>
        </div>
        { this.showContent() }
      </div>
    );
  }
}