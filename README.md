# mdc-weixin

Message Distributing Center (MDC) 专用微信模板消息适配器。

## 安装

```console
$ npm install --save mdc-weixin
```
or
```console
$ yarn add  mdc-weixin
```

## 使用

### 配置

在 MDC 配置文件中做好配置，如：

```javascript
{
  ...,
  "pubsub": {
    ...,
    "consumerAdapters": [{
      "queueName": "wechat",
      "require": "mdc-weixin",

      // 其它 mdc-wexin 参数
      ...
    }]
  }
}
```

其中**其它 mdc-weixin 参数**仅有一个 `tokenUrl`，代表获取该微信发送器所必须的 Access Token 获取的地址。

> 因为一个公众号同时只能拥有一个 Access Token，所以不能在该队列系统中维护，需要开发者自行在其主系统维护。而实际上这个 `tokenUrl` 就是 mdc-weixin 在需要 Access Token 的时候主动通过 `GET` 请求的一个地址，其返回 200 的状态码表示获取成功，输出内容直接为 Access Token 即可。

所以一个可能的参数是：

```javascript
"consumerAdapters": [{
  "queueName": "wechat",
  "require": "mdc-weixin",

  "tokenUrl": "http://127.0.0.1/wechat/get-token"
}]
```

> 而通过 cURL 访问这个 `tokenUrl` 时，它的输出结果应该形如下方输出：
> 
> ```console
> $ curl -v http://127.0.0.1/wechat/get-token
> 
> *   Trying 127.0.0.1...
> * TCP_NODELAY set
> * Connected to foo.com (127.0.0.1) port 80 (#0)
> > GET /wechat/get-token HTTP/1.1
> > Host: foo.com
> > User-Agent: curl/7.51.0
> > Accept: */*
> >
> < HTTP/1.1 200 OK
> < Date: Mon, 08 May 2017 09:48:32 GMT
> < Content-Type: text/html; charset=utf-8
> < Content-Length: 138
> < Connection: keep-alive
> <
> * Curl_http_done: called premature == 0
> * Connection #0 to host foo.com left intact
> PuBvH2tdWU-eIe36MeQe8rWp-YkkMtimf3ijQ0nHAKSXFOASijCDVwfhPk05ef7qCG14h6spmM-arz7SZ11w-h_bCC518RuS9KrypFAMAHJnRxQtP4xDuk1q4_DKYn03EF9cACAYZX%
> ```

### 消息格式

在生产者端生产消息的时候，注意使用这样的消息格式：

`发送客服消息`
```json
{
    "emit": "sendCustomer",
    "queue": "queue name",
    "message": {
        "touser": "openId",
        "msgtype": "msgtype",
        "text": {
            "content": "Hello World"
        }
    }
}
```
[客服消息参考](https://mp.weixin.qq.com/wiki?t=resource/res_main&id=mp1443433600&token=&lang=zh_CN)

`发送模板消息`
```json
{
    "emit": "sendTemplate",
    "queue": "queue name",
    "message": {
        "templateId": "templateId",
        "to": "openId",
        "url": "url",
        "data": {
            "first": {
                "value": "value ",
                "color": "color"
            }
        }
    }
}
```
[模板消息参考](https://mp.weixin.qq.com/wiki?t=resource/res_main&id=mp1443433600&token=&lang=zh_CN)

