import React, { Component } from 'react'
import { Redirect } from 'react-router-dom'
import { inject, observer } from 'mobx-react'
import { computed } from 'mobx'

@inject('userStore')
@observer
class Post extends Component {
  
  @computed
  get currUser() {
    return this.props.userStore.currUser
  }

  render() {
    if(!this.currUser) {
      return <Redirect to='/login' />
    }

    return (
      <div>post</div>
    )
  }
}

export default Post;