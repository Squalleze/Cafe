import React, { Component } from 'react';

export default class NewTopic extends Component {
  title = '';
  content = '';

  render() {
    return (
      <div className='RightContainer'>
        <input type='text' placeholder='Title' className='Input Text MarginBottom' onChange={ e => this.title = e.target.value } />
        <textarea rows='1' placeholder='Message' className='Input Text MarginBottom' onChange={ e => this.content = e.target.value } />
        <input type='button' value='Post' className='Input Button' onClick={ () => this.props.onDone(this.title, this.content) } />
      </div>
    );
  }
}