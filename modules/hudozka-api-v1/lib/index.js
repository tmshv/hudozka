'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

exports.default = function (auth, data) {
    return (0, _koaCompose2.default)([(0, _timeline.add)(auth, data)]);
};

var _timeline = require('./api/timeline');

var _koaCompose = require('koa-compose');

var _koaCompose2 = _interopRequireDefault(_koaCompose);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

;