export default class HttpUtil {
	//http get请求
  static get(url) {
    return new Promise((resolve, reject) => {
      fetch(url)
      .then(response => {
        if(response.ok) {
          return response.json(); //文本转化为JSON
        } else {
          throw new Error(response.status + " : " + response.statusText)
        }
      })
      .then(result => resolve(result))
      .catch(error => {
        reject(error);
      })
    });
  }

  //http post请求
  static post(url, data) {
    return new Promise((resolve, reject) => {
      fetch(url, {
        method: 'POST',
        header: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data) //JSON转为文本
      })
      .then(response => response.json())
      .then(result => resolve(result))
      .catch(error => {
        reject(error)
      })
    })
  }
}