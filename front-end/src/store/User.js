import { observable, action, runInAction } from 'mobx'
import { message } from 'antd'
import HttpUtil from '../util/HttpUtil';
import ApiUtil from '../util/ApiUtil';

class User {
  @observable 
  currUser = undefined

  @action 
  login(user) {
    HttpUtil.post(ApiUtil.API_USER_LOGIN, user)
    .then(
        re => {
            if(re.isLogin) {
                runInAction(() => {
                    this.currUser = re.currUser
                })
                message.success(re.message)
            }else{
                message.error(re.message);
            }
        }
    ).catch(error => {
        message.error(error.message);
        // console.log(error.message);
    })
  }

  @action
  logout() {
      this.currUser = undefined
  }
}

export default new User()