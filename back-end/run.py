from flask import Flask, request
import json

app = Flask(__name__, template_folder='../front-end', static_folder='../front-end', static_url_path='')

@app.route('/hello')
def hello_world():
    return "Hello, world"

# api接口前缀, ApiUtil.URL_ROOT
apiPrefix = '/api/v1/'

#Staff接口
@app.route(apiPrefix + 'updateStaff', methods=['POST'])
def updateStaff():
    data = request.get_data(as_text=True)
    re = {
        'code': 0,
        'data': data,
        'message': 'ok'
    }
    print('data：', data)
    return json.dumps(re)
