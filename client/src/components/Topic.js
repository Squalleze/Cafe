import React, { Component } from 'react';

import PerfectScrollbar from 'react-perfect-scrollbar';

import Message from './Message';

export default class Topic extends Component {
  state = {
    content: ''
  };
  onType = ({ target }) => {
    const maxRows = 10;
    let rows = 1;
    const match = target.value.match(/\n/g);
    if (match) rows += match.length;
    target.rows = Math.min(rows, maxRows);
    this.setState({ content: target.value });
  }
  onSubmit = () => {
    const content = this.state.content.trimRight();
    if (content.length < 2 || content.length > 255) return;
    this.props.postComment(content);
    this.setState({ content: '' });
  }
  showInput() {
    if (!this.props.isLogged) return;
    return (
      <div className=''>
        <textarea rows='1' value={ this.state.content } placeholder='Message' className='Input Text MarginBottom' onChange={ this.onType } />
        <input type='button' value='Submit' className='Input Button' onClick={ this.onSubmit } />
      </div>
    );
  }
  render() {
    if (!this.props.comments) return (<div className='RightContainer' />);
    return (
      <div className='RightContainer'>
        <PerfectScrollbar option={{ suppressScrollX: true }}>
          { this.props.comments.map((comment) => ( <Message key={ comment.id } value={ comment } /> )) }
          { this.showInput() }
        </PerfectScrollbar>
      </div>
    );
  }
}