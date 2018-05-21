#!/usr/local/bin/env python3
# coding:utf-8

import os
import django
import json
import re
import time
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "TyphoonApi.settings")

if django.VERSION >= (1, 7):  # 自动判断版本
    django.setup()

def dumpData(yearpath):
    from typhoon.models import Typhoon, Point, GraphPoint
    path = "../DataProcess/originalData/json/list/" + yearpath
    year = yearpath.split('.')[0]
    f = open(path, "r")
    jsonData = json.load(f)

    TyphoonList = []
    pattern = re.compile('T')
    for each in jsonData:
        # "tfbh": "201803",
        # "name": "\u6770\u62c9\u534e",
        # "ename": "Jelawat",
        # "begin_time": "2018-03-25T14:00:00",
        # "end_time": "2018-04-01T08:00:00",
        # "is_current": 0
        try:
            start_at = pattern.sub(' ', each['begin_time'])
            end_at = pattern.sub(' ', each['end_time'])
            name = (each['name'], '-')[each['name'] == None]
            print(each['tfbh'], name, each['ename'])
        except:
            print('*'*30, ' Warning ', '*'*30)
            start_at = each['begin_time']
            end_at = each['end_time']
            print('id ', each['tfbh'], ' name ', each['name'], each['ename'], start_at, end_at)
            continue
        print("time: ", start_at, end_at)
        englishname = each['ename'].title()
        englishname = re.sub(' +', ' ', englishname)
        newTyphoon = Typhoon(num=each['tfbh'], name=name, englishname=englishname, startat=start_at, endat=end_at, year=year)
        TyphoonList.append(newTyphoon)

    print("Length: ", len(TyphoonList))
    Typhoon.objects.bulk_create(TyphoonList)

def changeChineseName():
    """
    更改中文名
    """
    from typhoon.models import Typhoon, Point, GraphPoint

    path = "./sql/name_englishname_count.tsv"
    table = open(path, 'r')

    for each in table:
        ls = each.split("\t")
        name = ls[0]
        ename = ls[1]
        print(name," ", ename)
        selected = Typhoon.objects.filter(englishname=ename)
        for each in selected:
            each.name = name
            each.save()
            print(each.num)
        
        
def main():
    # pathls = os.listdir('../DataProcess/originalData/json/list/')
    # print(pathls)
    # for eachyear in pathls:
    #     dumpData(eachyear)
    #     time.sleep(1)
    changeChineseName()
    return

if __name__ == "__main__":
    main()
    print('Done!')
