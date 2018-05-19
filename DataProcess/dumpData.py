#!/usr/local/bin/env python3
# coding:utf-8

import os
import django

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "mysite.settings")

if django.VERSION >= (1, 7):  # 自动判断版本
    django.setup()


def main():
    from TyphoonApi.typhoon.models import Typhoon, Point, GraphPoint
    f = open('oldblog.txt')

    BlogList = []
    for line in f:
        parts = line.split(',')
        BlogList.append(Typhoon(title=parts[0], content=parts[1]))

    f.close()

    # 以上四行 也可以用 列表解析 写成下面这样
    # BlogList = [Blog(title=line.split('****')[0], content=line.split('****')[1]) for line in f]

    Typhoon.objects.bulk_create(BlogList)


if __name__ == "__main__":
    main()
    print('Done!')
