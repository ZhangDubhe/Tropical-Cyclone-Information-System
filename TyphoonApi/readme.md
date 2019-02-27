##  Typhoon System API
热带气旋生命史系统 api 文档

> api 路径包括  `/typhoon/` 和  `/tools/` 两个主要的分支目录, 其中前者属于数据接口, 用于获取台风数据, 根目录可访问接口文档, 后者包括一些简单的工具, 例如使用 `/qrcode/<link>` 可得到 link 的二维码, 扫描二维码能够直接访问该页面.

### API
数据来源于[中国气象局热带气旋资料中心](http://tcdata.typhoon.org.cn/zjljsjj_sm.html).
最新数据至2017年, 数据文件提供下载。更新日期:2018年5月14日

强度标记, 以正点前2分钟至正点内的平均风速为准, 参见《热带气旋等级》国家标准（GB/T 19201-2006）：

    0-	弱于热带低压(TD), 或等级未知,
    1-	热带低压(TD, 10.8-17.1m/s),
    2-	热带风暴(TS,17.2-24.4 m/s),
    3-	强热带风暴(STS, 24.5-32.6 m/s),
    4-	台风(TY, 32.7-41.4 m/s),
    5-	强台风(STY, 41.5-50.9 m/s),
    6-	超强台风(SuperTY, ≥51.0 m/s),
    9- 变性,第一个标记表示变性完成.

### 台风数据
#### 台风年频数据
> typhoon/ total
> method : GET
 请求所有台风的年数据列表, 返回 `[{"year":"2017","count":"23"},...]`

#### 台风年数据
> typhoon/ lists
> method : GET
> params: year

 参数 year ,可根据年份查询该年所有台风列表,无参数时返回所有年份,以下为`year=2017`返回部分样例:
 ```json
[
    {
        "num": 201730,
        "name": "天秤",
        "englishname": "Tembin",
        "startat": "2017-12-20T00:00:00",
        "endat": "2017-12-26T06:00:00",
        "year": 2017
    },
    {
        "num": 201729,
        "name": "启德",
        "englishname": "Kai-Tak",
        "startat": "2017-12-13T00:00:00",
        "endat": "2017-12-22T18:00:00",
        "year": 2017
    }
]
 ```
#### 台风路径点数据

> typhoon/ points
> method: GET
> params: typhoonnumber
参数为台风编号 `typhoonnumber`, 请求单个台风的路径信息
例如`points?typhoonnumber=199901`返回如下:
```json
[{
    "name": "-",
    "ename": "Iris",
    "typhoonnumber": 199901,
    "happenedat": "1999-02-16T06:00:00",
    "typhoontime": "1999021606",
    "latitude": 11.5,
    "longitude": 132.9,
    "intensity": 1.0,
    "windspeed": 15.0,
    "airpressure": 1002.0,
    "ordinarywindspeed": 0.0,
    "is_change": false,
    "isdelete": false
},
{
    "name": "-",
    "ename": "Iris",
    "typhoonnumber": 199901,
    "happenedat": "1999-02-16T12:00:00",
    "typhoontime": "1999021612",
    "latitude": 11.5,
    "longitude": 132.2,
    "intensity": 1.0,
    "windspeed": 15.0,
    "airpressure": 1002.0,
    "ordinarywindspeed": 0.0,
    "is_change": false,
    "isdelete": false
}]
```
#### 台风生命史图点数据
> typhoon/graphpoints
> method: GET
> params: typhoonnumber
参数为台风编号 `typhoonnumber`, 请求单个台风的路径信息
例如`points?typhoonnumber=199901`返回如下:
```json
[
    {
        "name": "-",
        "ename": "Iris",
        "typhoonnumber": 199901,
        "happenedat": "1999-02-16T06:00:00",
        "intensity": 1.0,
        "isdelete": false,
        "is_change": false
    },
    {
        "name": "-",
        "ename": "Iris",
        "typhoonnumber": 199901,
        "happenedat": "1999-02-18T12:00:00",
        "intensity": 0.0,
        "isdelete": false,
        "is_change": false
    }
]
```
### TOOLS
####  URLtoQRCODE
> tools/qrcode/<path:url>
> method: GET
> params: url
参数为需要转换的地址, 地址需作 uricomponent 转码, 返回该地址的二维码
例如`tools/qrcode/http%3A%2F%2Ftyphoon.dubheee.cn%2F%23`返回如下:
[二维码返回情况](http://api.dubheee.cn/tools/qrcode/http%3A%2F%2Ftyphoon.dubheee.cn%2F%23)




# Api Server 配置 8000 转端口配域名
1. 全局配置
```bash
server
	{
        listen 80; 
        listen [::]:80;
        server_name api.dubheee.com;  #域名
        server_name_in_redirect off;  
        location / {
            tcp_nodelay     on;  
            proxy_set_header Host            $host;  
            proxy_set_header X-Real-IP       $remote_addr;  
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;  
            proxy_pass http://127.0.0.1:8080;  #转接链接
            #root /...;  #或者目录
        }
    }
server
	{
        listen 80; 
        listen [::]:80;
        server_name api.dubheee.cn;  #域名
        server_name_in_redirect off;
        location / {
            tcp_nodelay     on;  
            proxy_set_header Host            $host;  
            proxy_set_header X-Real-IP       $remote_addr;  
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;  
            proxy_pass http://127.0.0.1:8080;  #转接链接
            #root /...;  #或者目录
        }
    }
```

2. 单域名配置
```bash
server
{
    listen 80;
    server_name api.dubheee.cn api.dubheee.com;
    index index.php index.html index.htm default.php default.htm default.html;
    root /home/ubuntu/typhoon;
    
    #SSL-START SSL相关配置，请勿删除或修改下一行带注释的404规则
    #error_page 404/404.html;
    #SSL-END
    
    #ERROR-PAGE-START  错误页配置，可以注释、删除或修改
    error_page 404 /404.html;
    error_page 502 /502.html;
    #ERROR-PAGE-END
    
    #PHP-INFO-START  PHP引用配置，可以注释或修改
    include enable-php-00.conf;
    #PHP-INFO-END
    
    #REWRITE-START URL重写规则引用,修改后将导致面板设置的伪静态规则失效
    include /www/server/panel/vhost/rewrite/api.dubheee.cn.conf;
    #REWRITE-END
    
    #禁止访问的文件或目录
    location ~ ^/(\.user.ini|\.htaccess|\.git|\.svn|\.project|LICENSE|README.md)
    {
        return 404;
    }
    
    #一键申请SSL证书验证目录相关设置
    location ~ \.well-known{
        allow all;
    }
    
    location ~ .*\.(gif|jpg|jpeg|png|bmp|swf)$
    {
        expires      30d;
        error_log off;
        access_log off;
    }
    
    location ~ .*\.(js|css)?$
    {
        expires      12h;
        error_log off;
        access_log off; 
    }
    location / {
        tcp_nodelay     on;  
        proxy_set_header Host            $host;  
        proxy_set_header X-Real-IP       $remote_addr;  
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;  
        proxy_pass http://127.0.0.1:8080;  #转接链接
        #root /...;  #或者目录
    }
    access_log  /www/wwwlogs/api.dubheee.cn.log;
    error_log  /www/wwwlogs/api.dubheee.cn.error.log;
}
```