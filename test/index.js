/**
 * XadillaX <i@2333.moe> created at 2017-05-08 17:34:41 with ❤
 *
 * Copyright (c) 2017 xcoder.in, all rights reserved.
 */
"use strict";

require("should");

const conf = require("./_conf");
const WechatConsumer = require("../");

describe("WechatConsumer", function() {
    it("should send", function(done) {
        const consumer = WechatConsumer.create(conf.options);
        consumer.emit("message", conf.params, {
            acknowledge: function() {
                done();
            }
        });
    });
});
