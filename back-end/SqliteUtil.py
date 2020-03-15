# -*- coding:utf-8 -*-

import sqlite3
import json
import csv

db_name = 'staff_manager'
#创建一个Connection代表数据库的对象
conn = sqlite3.connect(db_name + '.db', check_same_thread=False)
#以创建一个Cursor 对象并调用其execute()方法来执行SQL命令
cursor = conn.cursor()

def createTables():
    try:
        sql_create_t_staff = '''create table IF NOT EXISTS t_staff(
            no INTEGER PRIMARY KEY AUTOINCREMENT,
            id VARCHAR(10) NOT NULL,
            name VARCHAR(40) NOT NULL,
            passwd VARCHAR(40) NOT NULL,
            email VARCHAR(50),
            phone VARCHAR(11) NOT NULL,
            department VARCHAR(20) NOT NULL,
            position VARCHAR(10) NOT NULL,
            status INTEGER NOT NULL
        )'''

        cursor.execute(sql_create_t_staff)

    except Exception as e:
        print(repr(e))

createTables()

staffColumns = ('no', 'id', 'name', 'passwd', 'email', 'phone', 'department', 'position', 'status')

def getStaffList():
    tableName = 't_staff'
    columns = ','.join(staffColumns)
    order = ' ORDER BY id'

    sql = "SELECT %s FROM %s%s" % (columns, tableName, order)
    #print('getStaffList:', sql)

    cursor.execute(sql)

    dateList = cursor.fetchall()     # fetchall() 获取所有记录
    return dateList

def getStaffsFromData(dataList):
    staffs = []
    for itemArray in dataList:   # dataList数据库返回的数据集，是一个二维数组
        staff = {}
        for columnIndex, columnName in enumerate(staffColumns):
            columnValue = itemArray[columnIndex]
            if columnValue is None:
                columnValue = ''   #只有email为选填
            staff[columnName] = columnValue

        staffs.append(staff)

    return staffs

def addOrUpdateStaff(json_str):
    try:
        print('addOrUpdateStaff:', json_str)
        staff = json.loads(json_str) #字典
        no = staff.get('no', 0) #默认为0 判断操作类型
        passwd = staff.get('passwd', '123456')
        result = 'default' #提示结果
        newNo = no #序号
        
        if no == 0: #add
            keys = '' 
            values = ''
            for key, value in staff.items():
                keys += key
                #隐式类型的副作用 ？
                if isinstance(value, str):
                    values += ("'%s'" % value)
                else:
                    values += str(value)
                keys += ','
                values += ','
            keys += "passwd"
            values += ("'%s'" % passwd)
            sql = "INSERT INTO t_staff (%s) values (%s)" % (keys, values)

            # print(sql)
            cursor.execute(sql)
            result = '添加成功'
            newNo = cursor.lastrowid
            print(result, "newNo:", cursor.lastrowid)
        else: #修改
            update = ''
            isFirst = True
            for key, value in staff.items():
                if key == 'no':
                    continue
                if isFirst:
                    isFirst = False
                else:
                    update += ","
                if isinstance(value, str):
                    update += (key + "='" + value + "'")
                else:
                    update += (key + "=" + str(value))

            where = "WHERE id=" + str(staff.get('id'))
            sql = "UPDATE t_staff SET %s %s" % (update, where)

            # print(sql)
            cursor.execute(sql)
            result = '更新成功'
            print(result, 'noSum:', cursor.rowcount)

        conn.commit()
        re = {
            'message': result
        }
        return re
    except Exception as e:
        print('addOrUpdate:', repr(e))
        re = {
            'message': repr(e)
        }
        return re

def deleteStaff(no):
    try:
        sql = "DELETE FROM t_staff WHERE no=%d" % (no)
        print('delete:', sql)
        cursor.execute(sql)
        conn.commit()
        re = {
            'message': '删除成功'
        }
        return re
    except Exception as e:
        print('delete:', repr(e))
        re = {
            'message': repr(e)
        }
        return re

def searchStaff(search):
    try:
        where = ''
        like = ''
        status = ''
        
        if search.get('department', 'empty') != 'empty':
            if search.get('department') != 'all':
                where += ("WHERE department='%s'" % str(search['department']))

        # 0 => 所有 1,2，3表示状态
        if search.get('status', -1) > 0:
            status = ("status=" + str(search['status']))
        if len(where) > 0:
            if len(status) >0:
                where += (" AND " + status)
        else:
            if len(status) >0:
                where = ("WHERE " + status)

        likeItems = []
        for key, value in search.items():
            if key != 'department':
            # strip() 方法用于移除字符串头尾指定的字符（默认为空格或换行符）或字符序列
                if isinstance(value, str) and (len(value.strip()) > 0):
                    item = (key + " LIKE '%" + value + "%'")
                    likeItems.append(item)
        if len(likeItems) > 0:
            like = "%s" % ' OR '.join(likeItems)

        if len(where) > 0:
            if len(like) > 0:
                where += (" AND " + like)
        else:
            if len(like) > 0:
                where = ("WHERE " + like)

        columns = ','.join(staffColumns)
        order = ' ORDER BY id'
        sql = "SELECT %s FROM t_staff %s%s" % (columns, where, order)
        
        # print(sql)
        cursor.execute(sql)

        dataList = cursor.fetchall() #获取所有记录
        return dataList
    except Exception as e:
        print('search:', repr(e))
        return []

def doLogin(json_str):
    try:
        print('doLogin:', json_str)
        user = json.loads(json_str)  # 字典
        isLogin = False

        columns = ','.join(staffColumns)
        sql = "SELECT %s FROM t_staff WHERE id=%s" % (columns, user["id"])

        # print(sql)
        cursor.execute(sql)
        dataList = cursor.fetchall()
        currUser = getStaffsFromData(dataList)
        # print(len(currUser))
        
        if len(currUser) > 0:
            if currUser[0]["passwd"] == user["passwd"]:
                isLogin = True
                result = "登录成功"
            else:
                result = "密码错误"
        else:
            result = "工号不存在"
        # print(isLogin)

        re = {
            'isLogin': isLogin,
            'message': result,
            'currUser': currUser[0]
        }
        return re
    except Exception as e:
        print('Login:', repr(e))
        re = {
            'message': repr(e)
        }
        return re
