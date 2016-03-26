'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.add = add;

var _koaRoute = require('koa-route');

var _koaCompose = require('koa-compose');

var _koaCompose2 = _interopRequireDefault(_koaCompose);

var _hudozkaMiddlewares = require('hudozka-middlewares');

var _hudozkaMiddlewares2 = _interopRequireDefault(_hudozkaMiddlewares);

var _koaQuery = require('koa-query');

var _koaQuery2 = _interopRequireDefault(_koaQuery);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { return step("next", value); }, function (err) { return step("throw", err); }); } } return step("next"); }); }; }

function add(auth, data) {
    var _this = this;

    return (0, _koaRoute.put)('/timeline', (0, _koaCompose2.default)([_hudozkaMiddlewares2.default.ensureServiceAuth(auth), _hudozkaMiddlewares2.default.ejson(), (0, _koaQuery2.default)({
        save: (0, _koaQuery.toBoolean)()
    }), function () {
        var ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee(ctx) {
            var doSave, post, result;
            return regeneratorRuntime.wrap(function _callee$(_context) {
                while (1) {
                    switch (_context.prev = _context.next) {
                        case 0:
                            doSave = ctx.request.query.save || true;
                            post = ctx.request.body;
                            _context.prev = 2;

                            if (!doSave) data.timeline.disableSaving();
                            _context.next = 6;
                            return data.timeline.add(post);

                        case 6:
                            result = _context.sent;

                            if (!doSave) data.timeline.enableSaving();

                            ctx.body = result;
                            _context.next = 15;
                            break;

                        case 11:
                            _context.prev = 11;
                            _context.t0 = _context['catch'](2);

                            ctx.status = 400;
                            ctx.body = _context.t0;

                        case 15:
                        case 'end':
                            return _context.stop();
                    }
                }
            }, _callee, _this, [[2, 11]]);
        }));

        return function (_x) {
            return ref.apply(this, arguments);
        };
    }()]));
}