# -*-coding:utf8-*-
import os
import time
import os
import django
import json
import re
import datetime
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "TyphoonApi.settings")

if django.VERSION >= (1, 7):  # 自动判断版本
    django.setup()

from typhoon.models import Typhoon, Point, GraphPoint

global HEADERS
HEADERS = ''

def readfileToPath(_file_, y):
    """
    读取最佳路径,并整理为点数据,转化为 csv 列表及导入数据库
    """
    global HEADERS
    text = ''
    strong_level = ''
    replaceList = ["198415","198211","198801","199033","199120","199127","199216","200206","200215","200215","200126","200307","200226","200314","200401","200413","200509","200519","200601","200601","200604", "200608","200615","200615","200621","200908","200916","200917","201010"]
    info_row = []
    OneList = []
    rowNum = 0
    j = 0
    i = 0

    try:
        typhoonSelected = Typhoon.objects.get(num=str(y) + '01')
    except:
        pass
    for each in open(_file_, 'r'):
        if "6666" == each[0:4]:
            nId = each[6:10]  # 国际编号 年份最后加两位数编号
            rowNum = each[12:15]  # 行数
            id = each[16:20]  # 包括热带低压在内的序号

            cId = each[21:25]  # 我国的编号
            endInfo = each[26]  # 0 表示消散, 1 表示移出西太台风委员会的责任海区, 2 表示合并, 3 表示准静止;
            engName = each[30:50]
            year = y
            typhoonId = str(year) + id[2:4]
            header_row = [year, nId, id, cId, endInfo, engName]
            print(header_row)
            # HEADERS += ",".join(header_row) + '\r'
            strong_level = ''
            j = 0
            englishname = engName.title()
            engName = re.sub(' +', '', englishname)
            # 先添加Typhoon点之后,再进行,可避免未查找到的情况
            try:
                typhoonSelected = Typhoon.objects.get(num=typhoonId)
            except:
                # newTyphoon = Typhoon(num=typhoonId, name='-', englishname=engName, startat=str(year) +
                #                      '-01-01 00:00:00', endat=str(year) + '-12-31 00:00:00', year=year)
                # newTyphoon.save()
                # typhoonSelected = newTyphoon
                print("*"*20, "NEW")
            print("Typhoon: ", typhoonSelected)
            continue
        YYYYMMDDHH = each[0:10]
        I = each[11]
        rowNum = int(rowNum)
        LAT = float(each[13:16])/10
        LON = float(each[17:21])/10
        Pressure = each[22:26].lstrip(' ')
        WND = each[31:34].lstrip(' ')
        OWD = each[36:39].lstrip(' ')
        if OWD == '':
            OWD = '0'
        date = YYYYMMDDHH[0:4] + "-" + YYYYMMDDHH[4:6] + "-" + \
            YYYYMMDDHH[6:8] + " " + YYYYMMDDHH[8:10] + ":00:00"
        # 判断除名
        if typhoonId in replaceList:
            replaceName = True
        else:
            replaceName = False
        if j == 0:
            typhoonSelected.startat = date
            typhoonSelected.save()
        elif j == rowNum-1:
            typhoonSelected.endat = date
            typhoonSelected.save()

        j += 1
        # 处理强度
        if int(I) == strong_level:
            if j == rowNum:
                strong_level = 0
            else:
                pass
        else:
            if j == rowNum:
                strong_level = 0
                transit_extra_tropical = False
            elif int(I) == 9:
                if transit_extra_tropical == False:
                    strong_level = strong_level
                    transit_extra_tropical = True
                else:
                    pass
            else:
                transit_extra_tropical = False
                strong_level = int(I)


        info_row = [str(typhoonId), date, str(strong_level), engName.rstrip(), str(j),  str(
            LAT), str(LON), Pressure, WND, OWD, str(replaceName), str(transit_extra_tropical)]
        print(info_row)
        nextTyphoon = Point.objects.get_or_create(typhoonnumber=typhoonSelected, intensity=strong_level,
                            is_change=transit_extra_tropical, typhoontime=YYYYMMDDHH, 
                            happenedat=date, latitude=float(LAT), longitude=float(LON), windspeed=float(WND),
                            ordinarywindspeed=float(OWD), airpressure=float(Pressure))

        OneList.append(nextTyphoon)
        text += ','.join(info_row)
        text += '\r'
        i += 1

    # 处理列表之后导入数据库
    print("Length: ", len(OneList))
    # Point.objects.bulk_create(OneList)
    return text


def readfileToGraph(_file_, y):
    """
    读取最佳路径,并整理为图表数据,转化为 csv 列表及导入数据库
    """
    global HEADERS
    text = ''
    strong_level = ''
    replaceList = ["198415","198211","198801","199033","199120","199127","199216","200206","200215","200215","200126","200307","200226","200314","200401","200413","200509","200519","200601","200601","200604", "200608","200615","200615","200621","200908","200916","200917","201010"]
    OneList = []
    info_row = []
    rowNum = 0
    j = 0
    i = 0
    try:
        typhoonSelected = Typhoon.objects.get(num=str(y) + '01')
    except:
        pass
    for each in open(_file_, 'r'):
        # 先判断是否为 '头' 行
        if "6666" == each[0:4]:
            nId = each[6:10]  # 国际编号 年份最后加两位数编号
            rowNum = each[12:15]  # 行数
            id = each[16:20]  # 包括热带低压在内的序号 4位
            cId = each[21:25]  # 我国的编号 4位
            endInfo = each[26]  # 0 表示消散, 1 表示移出西太台风委员会的责任海区, 2 表示合并, 3 表示准静止;
            engName = each[30:50] # 英文名
            year = y
            typhoonId = str(year) + id[2:4] # 热带气旋编号,年份四位加包括热带低压编号后两位
            header_row = [year, nId, id, cId, endInfo, engName]
            print(header_row)
            strong_level = ''
            j = 0
            # 处理英文名称多余空格
            englishname = engName.title()
            engName = re.sub(' +', '', englishname)
            # 新增或查询已有 Typhoon 数据, 
            try:
                typhoonSelected = Typhoon.objects.get(num=typhoonId)
            except:
                newTyphoon = Typhoon(num=typhoonId, name='-', englishname=engName, startat=str(year) +
                                     '-01-01 00:00:00', endat=str(year) + '-12-31 00:00:00', year=year)
                newTyphoon.save()
                typhoonSelected = newTyphoon
                print("*"*20, "NEW")
            print("Typhoon: ", typhoonSelected)
            continue
        # 整理信息\字段
        YYYYMMDDHH = each[0:10]
        I = each[11]
        rowNum = int(rowNum)
        LAT = float(each[13:16])/10
        LON = float(each[17:21])/10
        Pressure = each[22:26].lstrip(' ')
        WND = each[31:34].lstrip(' ')
        OWD = each[36:39].lstrip(' ')
        date = YYYYMMDDHH[0:4] + "-" + YYYYMMDDHH[4:6] + "-" + \
            YYYYMMDDHH[6:8] + " " + YYYYMMDDHH[8:10] + ":00:00"
        # 判断除名
        if typhoonId in replaceList:
            replaceName = True
        else:
            replaceName = False
        # 补充初始化单个台风数据 Typhoon 未正确的信息
        if j == 0:
            typhoonSelected.startat = date
            typhoonSelected.is_delate = replaceName
            typhoonSelected.save()
        elif j == rowNum-1:
            typhoonSelected.endat = date
            typhoonSelected.save()

        j += 1
        # 处理强度
        if int(I) == strong_level:
            # 去掉重复的数据
            if j == rowNum:
                # 末尾封闭
                strong_level = 0
            else:
                continue
        else:
            if j == rowNum:
                # 末尾封闭
                strong_level = 0
                transit_extra_tropical = False
            elif int(I) == 9:
                # 变性情况
                if transit_extra_tropical == False:
                    strong_level = strong_level
                    transit_extra_tropical = True
                else:
                    continue
            else:
                # 正常传递数据
                transit_extra_tropical = False
                strong_level = int(I)

        info_row = [str(typhoonId), date, str(strong_level), engName.rstrip(), str(j),  str(
            LAT), str(LON), Pressure, WND, OWD, str(replaceName), str(transit_extra_tropical)]
        # 添加单个台风图表点数据.
        nextTyphoon = GraphPoint.objects.get_or_create(typhoonnumber=typhoonSelected, intensity=strong_level, is_change=transit_extra_tropical, typhoontime=YYYYMMDDHH, happenedat=date)
        OneList.append(nextTyphoon)

        text += ','.join(info_row)
        text += '\r'
        i += 1

    # 处理列表之后导入数据库
    print("Length: ", len(OneList))
    # GraphPoint.objects.bulk_create(OneList)
    return text


def findall(dir):
    exts = ".txt"
    text = ""
    files = os.listdir(dir)
    print(files)
    for name in files:
        if exts in name:
            path = dir + name
            # text = text + readfile(path)
            year = name[2:6]
            text += readfileToGraph(path, year)
            print(path, "finish~")
    store_all(text, "someData")

def querySpecialYear(dir, query_type, startYear, endYear):
    """
    读取最佳路径, 按年份循环
    """
    text = ''
    for year in range(startYear, endYear):
        name = "CH" + str(year) + "BST.txt"
        path = dir + name
        text = "id,date,I,name,seq,LAT,LON,Pressure,WND,OWD,replaceName,IsChange\r"
        first_row = str(year) + "00,"+ str(year) +"-01-01 00:00:00,0,First,0,0,0,0,0,,False,False\r"
        last_row = str(year) + "99,"+ str(year) +"-12-31 23:59:59,0,First,0,0,0,0,0,,False,False"
        text += first_row
        # text = "id,date,I"
        if query_type == 'path':
            text += readfileToPath(path, year)  # 从最佳数据集里读取数据
        else:
            text += readfileToGraph(path, year)  # 从最佳数据集里读取数据
        text += last_row
        # store path
        if query_type == 'graph':
            store_all(text, "../DataProcess/exportData/chart/"+str(year)) # To graph
        else:
            store_all(text, "../DataProcess/exportData/path/"+str(year)) # To path
        print("Finished <", year, "> At ", time.asctime(time.localtime(time.time())) )

def store_all(_text_, _name_):
    txt_path = _name_ + ".csv"
    path = txt_path
    _file = open(path, "w")
    _file.write(_text_)
    _file.close()

def readLandFile():
    text = ""
    i = 0
    header = ''
    year = ""
    new = ["year", "id", "cid", "name", "chinesename"]
    for each in open("../DataProcess/originalData/台风登陆信息表.csv", 'rb'):
        if i == 0:
            i += 1
            header = each
            continue
        e = each.split(",")
        if e[1] == '':
            i += 1
            continue

        if e[0] == '':
            e[0] = year
        else:
            year = str(e[0])

        new[0] = e[0]
        new[1] = e[1]
        new[2] = e[2]
        new[3] = e[3]
        new[4] = e[4]
        print(','.join(new))
        text += ','.join(new)
        text += '\r'
        i += 1

    fo = open("landInfo.csv", 'wb')
    fo.write(text)


INIT_YEAR = 1949
def main():
    global HEADERS
    
    querySpecialYear("../DataProcess/originalData/bst4915/",
                     'graph', INIT_YEAR, datetime.datetime.now().year)
    querySpecialYear("../DataProcess/originalData/bst4915/",
                     'path', INIT_YEAR, datetime.datetime.now().year)
    # readLandFile()
    # store_all(HEADERS, "headerData")


if __name__ == '__main__':
    main()
