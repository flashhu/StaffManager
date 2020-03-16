from flask import Flask, request
import json
import SqliteUtil as DBUtil

app = Flask(__name__, template_folder='../front-end', static_folder='../front-end', static_url_path='')

@app.route('/hello')
def hello_world():
    return "Hello, world"

# api接口前缀, ApiUtil.URL_ROOT
apiPrefix = '/api/v1/'

#Staff接口
@app.route(apiPrefix + 'getStaffList')
def getStaffList():
    array = DBUtil.getStaffList()
    jsonStaffs = DBUtil.getStaffsFromData(array)
    return json.dumps(jsonStaffs)

@app.route(apiPrefix + 'updateStaff', methods=['POST'])
def updateStaff():
    data = request.get_data(as_text=True)
    re = DBUtil.addOrUpdateStaff(data)
    #print('data：', data)
    return json.dumps(re)

@app.route(apiPrefix + 'deleteStaff<int:no>')
def deleteStaff(no):
	re = DBUtil.deleteStaff(no)
	return json.dumps(re)

@app.route(apiPrefix + 'searchStaff')
def searchStaff():
    # 拿到数据searchItems 字符串
    data = request.args.get('search') 
    # 变为原有类型
    search = json.loads(data)
    array = DBUtil.searchStaff(search)
    jsonStaffs = DBUtil.getStaffsFromData(array)
    return json.dumps(jsonStaffs)

#login接口
@app.route(apiPrefix + 'doLogin', methods=["POST"])
def doLogin():
    data = request.get_data(as_text=True)
    re = DBUtil.doLogin(data)
    return json.dumps(re)

#register接口
@app.route(apiPrefix + 'doRegister', methods=["POST"])
def doRegister():
    data = request.get_data(as_text=True)
    re = DBUtil.doRegister(data)
    return json.dumps(re)
