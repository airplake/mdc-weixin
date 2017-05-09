/**
 * XadillaX <i@2333.moe> created at 2017-05-08 17:06:56 with ❤
 *
 * Copyright (c) 2017 xcoder.in, all rights reserved.
 */
"use strict";

const WechatConsumer = require("./lib/consumer");

module.exports.create = function(conf) {
    return new WechatConsumer(conf);
};
