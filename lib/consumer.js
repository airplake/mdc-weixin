/**
 * XadillaX <i@2333.moe> created at 2017-05-08 17:07:36 with ❤
 *
 * Copyright (c) 2017 xcoder.in, all rights reserved.
 */
"use strict";

const EventEmitter = require("events").EventEmitter;

const async = require("async");
const spidex = require("spidex");
const WechatTemplateMessagner = require("wechat-template-msg");

class WechatConsumer extends EventEmitter {
    constructor(conf) {
        super();

        const self = this;
        this.conf = conf || {};
        this.on("message", function(message, ack) {
            self.send(message, function(err, info) {
                if(err) {
                    console.error(err);
                    return ack.acknowledge();
                }

                console.log("Sent.", info);
                ack.acknowledge();
            });
        });
    }

    send(message, callback) {
        if(!this.conf.tokenUrl) {
            return callback(new Error("Invalid token url."));
        }

        const self = this;
        let token;
        async.waterfall([
            function(callback) {
                spidex.get(self.conf.tokenUrl, {
                    timeout: 5000
                }, function(_token, status) {
                    if(status !== 200) return callback(new Error("无法获取 token。"));
                    token = _token;
                    callback();
                }).on("error", function(err) {
                    callback(err);
                });
            },

            function(callback) {
                const data = Object.keys(message.data).reduce((ret, key) => {
                    if(typeof message.data[key] === "object") {
                        ret[key] = {
                            value: message.data[key].value,
                            color: message.data[key].color
                        };
                    } else {
                        ret[key] = {
                            value: message.data[key],
                            color: "#000000"
                        }
                    }

                    return ret;
                }, {});

                WechatTemplateMessagner.send({
                    "access_token": token,
                    "template_id": message.templateId,
                    "to_user_openid": message.to,
                    url: message.url,
                    data: data
                }).then(function(ret) {
                    if(ret && (ret.errmsg === "ok" && ret.errcode === 0)) {
                        return callback(undefined, ret);
                    }

                    return callback(new Error((ret || {}).errmsg || "未知错误。"));
                }).catch(function(err) {
                    return callback(err);
                });
            }
        ], function(err, ret) {
            return callback(err, ret);
        });
    }
}

module.exports = WechatConsumer;
