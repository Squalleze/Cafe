import React, { Component } from 'react';

export default class Topic extends Component {
  render() {
    const { topic, lastSeen, isSelected, openTopic } = this.props;
    const lastComment = topic.comments[topic.comments.length - 1];

    return (
      <div className={ `Thumb ${ isSelected ? 'Selected' : '' }` } onClick={ () => openTopic(topic.id) }>
        <div className='Thumb-avatar'>
          <img src={ topic.author.avatar } alt='[Avatar]' className='Avatar' />
        </div>
        <div className='Thumb-content'>
          <div className='Thumb-header'>{ topic.title }</div>
          <div className='Thumb-body BL'>
            <span className={ (isSelected || lastSeen > lastComment.timestamp) ? 'G' : 'CS' }>{ topic.comments.length }</span>, { lastComment.author.username }
          </div>
        </div>
      </div>
    );
  }
}