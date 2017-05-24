/**
 * Filename: /home/wei/Desktop/yedian/mdc-weixin-customer/lib/consumer.js
 * Path: /home/wei/Desktop/yedian/mdc-weixin-customer
 * Created Date: Tue May 23 2017
 * Author: wei
 *
 * Copyright (c) 2017 Airplake
 */
'use strict'

const EventEmitter = require('events').EventEmitter
const request = require('request')
const async = require('async')
const WechatTemplateMessagner = require('wechat-template-msg')

const endpoint = 'https://api.weixin.qq.com'

/**
 *
 *
 * @class WechatConsumer
 * @extends {EventEmitter}
 */
class WechatConsumer extends EventEmitter {
  constructor (conf) {
    super()

    const self = this
    this.conf = conf || {}
    this.token = ''
    this.on('sendCustomer', function (message, callback) {
      self.sendCustomer(message, function (err, info) {
        if (err) {
          console.error(err)
          return callback(err)
        }

        console.log('Sent.', info)
        return callback()
      })
    })

    this.on('sendTemplate', function (message, callback) {
      self.sendTemplate(message, function (err, info) {
        if (err) {
          console.error(err)
          return callback(err)
        }

        console.log('Sent.', info)
        return callback()
      })
    })
  }

    /**
     * customer service
     *
     * @param {any} message
     * @param {any} callback
     * @returns
     *
     * @memberof WechatConsumer
     */
  sendCustomer (message, callback) {
    if (!this.conf.tokenUrl) {
      return callback(new Error('Invalid token url.'))
    }

    const self = this
    async.waterfall([
      function (callback) {
        self._accessToken(callback)
      },
      function (callback) {
        request.post(`${endpoint}/cgi-bin/message/custom/send?access_token=${self.token}`,
                    { json: message },
                    function (error, response, body) {
                      if (!error && response.statusCode === 200) {
                        return callback(null, body)
                      }
                      return callback(error)
                    }
                )
      }
    ], function (err, ret) {
      return callback(err, ret)
    })
  }

    /**
     * sendTemplate
     *
     *
     * @memberof WechatConsumer
     */
  sendTemplate (message, callback) {
    if (!this.conf.tokenUrl) {
      return callback(new Error('Invalid token url.'))
    }

    const self = this
    async.waterfall([
      function (callback) {
        self._accessToken(callback)
      },

      function (callback) {
        const data = Object.keys(message.data).reduce((ret, key) => {
          if (typeof message.data[key] === 'object') {
            ret[key] = {
              value: message.data[key].value,
              color: message.data[key].color
            }
          } else {
            ret[key] = {
              value: message.data[key],
              color: '#000000'
            }
          }

          return ret
        }, {})

        WechatTemplateMessagner.send({
          'access_token': self.token,
          'template_id': message.templateId,
          'to_user_openid': message.to,
          url: message.url,
          data: data
        }).then(function (ret) {
          if (ret && (ret.errmsg === 'ok' && ret.errcode === 0)) {
            return callback(null, ret)
          }

          return callback(new Error((ret || {}).errmsg || '未知错误。'))
        }).catch(function (err) {
          return callback(err)
        })
      }
    ], function (err, ret) {
      return callback(err, ret)
    })
  }

  /**
   * _accessToken private
   *
   *
   * @memberof WechatConsumer
   */
  _accessToken (callback) {
    let self = this
    return request(this.conf.tokenUrl, function (error, response, body) {
      if (error) callback()
      self.token = body
      callback()
    })
  }
}

module.exports = WechatConsumer
