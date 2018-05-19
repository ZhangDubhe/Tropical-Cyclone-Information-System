# -*-coding:utf8-*-
import os
import time
global HEADERS
HEADERS = ''

def readfile(_file_, y):
    global HEADERS
    text = ''
    replaceList = ["198415","198211","198801","199033","199120","199127","199216","200206","200215","200215","200126","200307","200226","200314","200401","200413","200509","200519","200601","200601","200604", "200608","200615","200615","200621","200908","200916","200917","201010"]
    i = 0
    info_row = []
    strong_level = ''
    for each in open(_file_, 'rb'):

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
            # HEADERS += ",".join(header_row) + '\r'
            strong_level = ''
            j = 0
            continue
            
        YYYYMMDDHH = each[0:10]
        I = each[11]
        rowNum = int(rowNum)
        j += 1



        if int(I) == strong_level:
            if j == rowNum:
                strong_level = 0
            else:
                continue
        else:
            if j == rowNum:
                strong_level = 0
                transit_extra_tropical = "false"
            elif int(I) == 9:
                if transit_extra_tropical == "false":
                    strong_level = strong_level
                    transit_extra_tropical = "true"
                else:
                    continue
            else:
                transit_extra_tropical = "false"
                strong_level = int(I)



        LAT = float(each[13:16])/10
        LON = float(each[17:21])/10
        Pressure = each[22:26].lstrip(' ')
        WND = each[31:34].lstrip(' ')
        OWD = each[36:39].lstrip(' ')

        date = YYYYMMDDHH[0:4] + "-" + YYYYMMDDHH[4:6] + "-" + YYYYMMDDHH[6:8] + " " + YYYYMMDDHH[8:10] + ":00:00"


        if typhoonId in replaceList:
            replaceName = "True"
        else:
            replaceName = "False"
        info_row = [str(typhoonId),date, str(strong_level), engName.rstrip(), str(j),  str(LAT), str(LON), Pressure, WND, OWD,replaceName]
        # print info_row
        # info_row = [str(typhoonId),date, str(I)]
        text += ','.join(info_row)
        text += '\r'
        i += 1

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
            text += readfile(path, year)
            print(path, "finish~")
    store_all(text, "someData")

def querySpecialYear(dir):
    text = ''
    for i in range(1981,2011):
        year = i
        name = "CH" + str(year) + "BST.txt"
        path = dir + name
        text = "id,date,I,name,seq,LAT,LON,Pressure,WND,OWD,replaceName\r"
        first_row = str(year) + "00,"+ str(year) +"-01-01 00:00:00,0,First,0,0,0,0,0,,False\r"
        last_row = str(year) + "99,"+ str(year) +"-12-31 23:59:59,0,First,0,0,0,0,0,,False"
        text += first_row
        # text = "id,date,I"
        # todo: Store in mysql
        text += readfile(path, year) # 从最佳数据集里读取数据
        text += last_row
        #  store path
        store_all(text, "exportData/chart/"+str(year))

def store_all(_text_, _name_):
    txt_path = _name_ + ".csv"
    path = txt_path
    _file = open(path, "wb")
    _file.write(_text_)
    _file.close()


def readLandFile():
    text = ""
    i = 0
    header = ''
    year = ""
    new = ["year", "id", "cid", "name", "chinesename"]
    for each in open("originalData/台风登陆信息表.csv", 'rb'):
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


def main():
    global HEADERS
    querySpecialYear("orginalData/bst4915/")
    # readLandFile()
    # store_all(HEADERS, "headerData")


if __name__ == '__main__':
    main()
