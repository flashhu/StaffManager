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

staffColumns = ('no', 'id', 'name', 'email', 'phone', 'department', 'position', 'status')

def getStaffList():
    tableName = 't_staff'
    columns = ','.join(staffColumns)
    order = ' order by id'

    sql = "select %s from %s%s" % (columns, tableName, order)
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
        result = 'default' #提示结果
        newNo = no #序号

        if no == 0: #add
            keys = '' 
            values = ''
            isFirst = True
            for key, value in staff.items():
                if isFirst:
                    isFirst = False
                else:
                    keys += ','
                    values += ','
                keys += key
                #隐式类型的副作用 ？
                if isinstance(value, str):
                    values += ("'%s'" % value)
                else:
                    values += str(value)

            sql = "INSERT INTO t_staff (%s) values (%s)" % (keys, values)

            #print(sql)
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

            #print(sql)
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