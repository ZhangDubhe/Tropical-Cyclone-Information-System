import requests
import json
import os
import time

import django

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "TyphoonApi.settings")

django.setup()

def queryYearData():
    url = "http://www.readearth.com/publictyphoon/PatrolHandler.ashx?provider=Readearth.PublicSrviceGIS.BLL.TyphoonBLL&assembly=Readearth.PublicSrviceGIS.BLL&method=GetTyhoonByYear&queryYear=true&year="
    initYear = 1949
    from TyphoonApi.typhoon.models import Typhoon
    for i in range(0, 70):
        year = initYear + i
        newUrl = url + str(year)
        res = requests.get(newUrl, timeout=10000)
        if res.status_code == 200:
            json = res.json()
            TyphoonList = []
            for each in json:
                # "tfbh": "201803",
                # "name": "\u6770\u62c9\u534e",
                # "ename": "Jelawat",
                # "begin_time": "2018-03-25T14:00:00",
                # "end_time": "2018-04-01T08:00:00",
                # "is_current": 0
                newTyphoon = Typhoon(num=each['tfbh'], name=each['name'], englishname=each['ename'], startat=each['begin_time'], endat=each['end_time'], year=year)
                TyphoonList.append(newTyphoon)
                print(newTyphoon)
            storeYearFile(year=year, text=json)
            print(year)

def queryTyphoonId():
    initYear = 1949
    for i in range(0, 70):
        year = initYear + i
        print("[list] year:", year)
        path = "originalData/json/list/" + str(year) + ".json"
        f = open(path, "r")
        s = json.load(f)
        for each in s:
            id = each["tfbh"]
            queryDetailsData(id)


def queryDetailsData(testId):
    url = "http://www.readearth.com/publictyphoon/PatrolHandler.ashx?provider=Readearth.PublicSrviceGIS.BLL.TyphoonBLL&assembly=Readearth.PublicSrviceGIS.BLL&method=GetTyphoonDetail&sno="
    time.sleep(1)
    newUrl = url + str(testId)
    res = requests.get(newUrl, timeout=10000)
    if res.status_code == 200:
        data = res.json()
        print("--id:", testId)
        storeEachYearFile(str(testId)[0:4], testId, data)


def storeYearFile(year, text):
    path = "./originalData/json/list/" 
    if (os.path.exists(path)):
        pass
    else:
        os.mkdir(path)
    path = path + str(year) + ".json"
    f = open(path, "w")
    json.dump(text,f)
    f.close()

def storeEachYearFile(year, id ,text):
    path = "originalData/json/detail/" + str(year) + "/"
    if (os.path.exists(path)):
        pass
    else:
        os.mkdir(path)
    path = path  + str(id) +".json"
    f = open(path, "w")
    json.dump(text,f)
    f.close()

def main():
    # 1. 先爬取每年的数据列表
    # 2. queryTyphoonId
    queryYearData()
    # queryTyphoonId()

if __name__ == '__main__':
    main()
