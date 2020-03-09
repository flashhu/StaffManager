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

