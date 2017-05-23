'use strict'

require('should')

const conf = require('./_conf')
// const mocha = require('mocha')
const WechatConsumer = require('../')

describe('WechatConsumer', function () {
  it('should send', function (done) {
    const consumer = WechatConsumer.create(conf.options)
    consumer.emit('sendCustomer', conf.params, function () {
      done()
    })
  })
})
