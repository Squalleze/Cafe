import React, { Component } from 'react';

export default class Message extends Component {
  formatDate(date) {
    const hours = date.getHours(), minutes = date.getMinutes();
    return `${ hours.toString().padStart(2, '0') }:${ minutes.toString().padStart(2, '0') }`;
  }
  render() {
    const comment = this.props.value;
    return (
      <div className='Message'>
        <div className='Message-avatar'>
          <img src={ comment.author.avatar } alt='[Avatar]' className='Avatar' />
        </div>
        <div className='Message-content'>
          <div className='Message-header'>
            <span className='T'>{ comment.author.username }</span>
            <time dateTime={ comment.timestamp.toISOString() } style={{ float: 'right' }}>{ this.formatDate(comment.timestamp) }</time>
          </div>
          <span className='Message-body'>{ comment.content }</span>
        </div>
      </div>
    );
  }
}