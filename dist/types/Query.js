"use strict";
var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
exports.Query = void 0;
var schema_1 = require("@nexus/schema");
var utils_1 = require("../utils");
exports.Query = schema_1.queryType({
    definition: function (t) {
        var _this = this;
        t.field('me', {
            type: 'User',
            nullable: true,
            resolve: function (parent, args, ctx) {
                var userId = utils_1.getUserId(ctx);
                return ctx.prisma.user.findOne({
                    where: {
                        id: Number(userId)
                    }
                });
            }
        });
        t.list.field('users', {
            type: 'User',
            resolve: function (parent, args, ctx) {
                return ctx.prisma.user.findMany();
            }
        });
        t.list.field('feed', {
            type: 'Server',
            args: {
                date: schema_1.stringArg({ "default": new Date().toISOString(), nullable: false }),
                page: schema_1.intArg({ "default": 0, nullable: false })
            },
            resolve: function (parent, _a, ctx) {
                var date = _a.date, page = _a.page;
                var pageLimit = 10;
                var _b = utils_1.getDates(date), d = _b[0], f = _b[1];
                var servers = ctx.prisma
                    .$queryRaw(templateObject_1 || (templateObject_1 = __makeTemplateObject(["SELECT s.id, s.title, s.content, sum(case WHEN v.\"createdAt\" >= ", " AND v.\"createdAt\" < ", "\n          THEN 1 ELSE 0 END ) AS \"voteCount\" \n          FROM \"Server\" AS s \n          LEFT JOIN \"Vote\" AS v ON (s.id = \"serverId\")\n          GROUP BY s.id ORDER BY \"voteCount\" DESC\n          OFFSET ", " LIMIT 25;"], ["SELECT s.id, s.title, s.content, sum(case WHEN v.\"createdAt\" >= ", " AND v.\"createdAt\" < ", "\n          THEN 1 ELSE 0 END ) AS \"voteCount\" \n          FROM \"Server\" AS s \n          LEFT JOIN \"Vote\" AS v ON (s.id = \"serverId\")\n          GROUP BY s.id ORDER BY \"voteCount\" DESC\n          OFFSET ", " LIMIT 25;"])), d, f, page > 10 ? pageLimit * 25 : page);
                return servers;
            }
        });
        t.list.field('searchServers', {
            type: 'Server',
            args: {
                date: schema_1.stringArg({ "default": new Date().toISOString(), nullable: false }),
                searchString: schema_1.stringArg({ nullable: true }),
                page: schema_1.intArg({ "default": 0, nullable: false })
            },
            resolve: function (parent, _a, ctx) {
                var searchString = _a.searchString, date = _a.date, page = _a.page;
                return __awaiter(_this, void 0, void 0, function () {
                    var _b, d, f, pageLimit;
                    return __generator(this, function (_c) {
                        switch (_c.label) {
                            case 0:
                                _b = utils_1.getDates(date), d = _b[0], f = _b[1];
                                pageLimit = 10;
                                return [4 /*yield*/, ctx.prisma
                                        .$queryRaw(templateObject_2 || (templateObject_2 = __makeTemplateObject(["SELECT s.id, s.title, s.content, s.slots, s.cover, sum(case WHEN v.\"createdAt\" >= ", " AND v.\"createdAt\" < ", "\n          THEN 1 ELSE 0 END ) AS \"voteCount\" FROM \"Server\" AS s LEFT JOIN \"Vote\" AS v ON (s.id = \"serverId\") WHERE title LIKE ", " OR content LIKE ", " GROUP BY s.id ORDER BY \"voteCount\" DESC\n        OFFSET ", " LIMIT 25;;"], ["SELECT s.id, s.title, s.content, s.slots, s.cover, sum(case WHEN v.\"createdAt\" >= ", " AND v.\"createdAt\" < ", "\n          THEN 1 ELSE 0 END ) AS \"voteCount\" FROM \"Server\" AS s LEFT JOIN \"Vote\" AS v ON (s.id = \"serverId\") WHERE title LIKE ",
                                        " OR content LIKE ",
                                        " GROUP BY s.id ORDER BY \"voteCount\" DESC\n        OFFSET ", " LIMIT 25;;"])), d, f, '%' + searchString + '%', '%' + searchString + '%', page > 10 ? pageLimit * 25 : page)];
                            case 1: return [2 /*return*/, _c.sent()];
                        }
                    });
                });
            }
        });
        t.field('server', {
            type: 'Server',
            nullable: true,
            args: {
                id: schema_1.intArg(),
                date: schema_1.stringArg({ "default": new Date().toISOString(), nullable: false })
            },
            resolve: function (parent, _a, ctx) {
                var id = _a.id, date = _a.date;
                return __awaiter(_this, void 0, void 0, function () {
                    var _b, d, f, servers;
                    return __generator(this, function (_c) {
                        switch (_c.label) {
                            case 0:
                                _b = utils_1.getDates(date), d = _b[0], f = _b[1];
                                return [4 /*yield*/, ctx.prisma
                                        .$queryRaw(templateObject_3 || (templateObject_3 = __makeTemplateObject(["SELECT s.id, s.title, s.content, s.slots, s.cover, sum(case WHEN v.\"createdAt\" >= ", " AND v.\"createdAt\" < ", "\n          THEN 1 ELSE 0 END ) AS \"voteCount\" FROM \"Server\" AS s LEFT JOIN \"Vote\" AS v ON (s.id = \"serverId\") WHERE s.id = ", " GROUP BY s.id LIMIT 1;"], ["SELECT s.id, s.title, s.content, s.slots, s.cover, sum(case WHEN v.\"createdAt\" >= ", " AND v.\"createdAt\" < ", "\n          THEN 1 ELSE 0 END ) AS \"voteCount\" FROM \"Server\" AS s LEFT JOIN \"Vote\" AS v ON (s.id = \"serverId\") WHERE s.id = ", " GROUP BY s.id LIMIT 1;"])), d, f, id)];
                            case 1:
                                servers = _c.sent();
                                return [2 /*return*/, servers[0]];
                        }
                    });
                });
            }
        });
    }
});
var templateObject_1, templateObject_2, templateObject_3;
