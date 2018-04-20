import React, { Component } from 'react';

export default class Login extends Component {
  state = {
    username: '',
    avatar: 'https://i.imgur.com/to20rVh.gif',
    imgError: null,
    unError: null,
  };
  updateAvatar = (e) => {
    this.setState({ avatar: e.target.value });
  }
  onAvatarError = (e) => {
    this.setState({ imgError: 'Error loading image' });
  }
  onAvatarLoad = (e) => {
    const img = e.target;
    if (img.naturalWidth !== img.naturalHeight)
      return this.setState({ imgError: 'The image must be a square' });
    if (img.naturalWidth > 100)
      return this.setState({ imgError: 'The image must not be bigger than 100x100' });
    this.setState({ imgError: null });
  }
  submitInfo = () => {
    if (this.state.unError || this.state.imgError) return;
    return this.props.onDone(this.state.username, this.state.avatar);
  }
  updateUsername = (e) => {
    const username = e.target.value.toLowerCase().replace(/[^a-z]/, '').replace(/^[a-z]/, e => e.toUpperCase());
    if (username.length < 2)
      return this.setState({ username, unError: 'Name too short' });
    if (username.length > 10)
      return this.setState({ username, unError: 'Name too long' });
    this.setState({ username, unError: null });
  }
  showImageError() {
    if (!this.state.imgError) return;
    return (
      <span className='R MarginBottom'>{ this.state.imgError }</span>
    );
  }
  showUsernameError() {
    if (!this.state.unError) return;
    return (
      <span className='R MarginBottom'>{ this.state.unError }</span>
    );
  }
  render() {
    return (
      <div className='RightContainer Login'>
        <img src={ this.state.avatar } alt='Error' className='Avatar MarginBottom' onLoad={ this.onAvatarLoad } onError={ this.onAvatarError } />
        <input type='text' value={ this.state.username } maxLength='10' placeholder='Chewbacca' className='Input Text MarginBottom' onChange={ this.updateUsername } />
        { this.showUsernameError() }
        <input type='text' value={ this.state.avatar } placeholder='imgur.com/...' className='Input Text MarginBottom' onChange={ this.updateAvatar } />
        { this.showImageError() }
        <input type='button' value='Login' className='Input Button' onClick={ this.submitInfo } />
      </div>
    );
  }
}