"use strict";
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
exports.permissions = void 0;
var graphql_shield_1 = require("graphql-shield");
var utils_1 = require("../utils");
var rules = {
    isAuthenticatedUser: graphql_shield_1.rule()(function (parent, args, context) { return __awaiter(void 0, void 0, void 0, function () {
        var userId, user;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    userId = utils_1.getUserId(context);
                    return [4 /*yield*/, context.prisma.user.findOne({
                            where: {
                                id: Number(userId)
                            }
                        })];
                case 1:
                    user = _a.sent();
                    return [2 /*return*/, Boolean(userId) && !user.banned];
            }
        });
    }); }),
    isPostOwner: graphql_shield_1.rule()(function (parent, _a, context) {
        var id = _a.id;
        return __awaiter(void 0, void 0, void 0, function () {
            var userId, author;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        userId = utils_1.getUserId(context);
                        return [4 /*yield*/, context.prisma.post
                                .findOne({
                                where: {
                                    id: Number(id)
                                }
                            })
                                .author()];
                    case 1:
                        author = _b.sent();
                        return [2 /*return*/, userId === author.id];
                }
            });
        });
    }),
    isServerOwner: graphql_shield_1.rule()(function (parent, _a, context) {
        var id = _a.id;
        return __awaiter(void 0, void 0, void 0, function () {
            var userId, author;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        userId = utils_1.getUserId(context);
                        return [4 /*yield*/, context.prisma.server
                                .findOne({
                                where: {
                                    id: Number(id)
                                }
                            })
                                .author()];
                    case 1:
                        author = _b.sent();
                        console.log('is server owner', userId === author.id);
                        return [2 /*return*/, userId === author.id];
                }
            });
        });
    }),
    fromMod: graphql_shield_1.rule()(function (parent, _a, context) {
        var id = _a.id;
        return __awaiter(void 0, void 0, void 0, function () {
            var userId, user;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        userId = utils_1.getUserId(context);
                        return [4 /*yield*/, context.prisma.user.findOne({
                                where: {
                                    id: Number(userId)
                                }
                            })];
                    case 1:
                        user = _b.sent();
                        console.log('is mod or admin', user.role === 'admin' || user.role === 'mod');
                        return [2 /*return*/, user.role === 'admin' || user.role === 'mod'];
                }
            });
        });
    }),
    fromAdmin: graphql_shield_1.rule()(function (parent, _a, context) {
        var id = _a.id;
        return __awaiter(void 0, void 0, void 0, function () {
            var userId, user;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        userId = utils_1.getUserId(context);
                        return [4 /*yield*/, context.prisma.user.findOne({
                                where: {
                                    id: Number(userId)
                                }
                            })
                            // console.log('is admin', user.role === 'admin')
                        ];
                    case 1:
                        user = _b.sent();
                        // console.log('is admin', user.role === 'admin')
                        return [2 /*return*/, user.role === 'admin'];
                }
            });
        });
    }),
    isMod: graphql_shield_1.rule()(function (parent, _a, context) {
        var id = _a.id;
        return __awaiter(void 0, void 0, void 0, function () {
            var user;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, context.prisma.user.findOne({
                            where: {
                                id: Number(id)
                            }
                        })];
                    case 1:
                        user = _b.sent();
                        console.log('is mod or admin', user.role === 'admin' || user.role === 'mod');
                        return [2 /*return*/, user.role === 'admin' || user.role === 'mod'];
                }
            });
        });
    }),
    isAdmin: graphql_shield_1.rule()(function (parent, _a, context) {
        var id = _a.id;
        return __awaiter(void 0, void 0, void 0, function () {
            var user;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, context.prisma.user.findOne({
                            where: {
                                id: Number(id)
                            }
                        })
                        // console.log('is admin', user.role === 'admin')
                    ];
                    case 1:
                        user = _b.sent();
                        // console.log('is admin', user.role === 'admin')
                        return [2 /*return*/, user.role === 'admin'];
                }
            });
        });
    })
};
// Being admin or mod takes precedence over being banned or not
exports.permissions = graphql_shield_1.shield({
    Query: {
        me: rules.isAuthenticatedUser,
        users: rules.fromMod
    },
    Mutation: {
        // User Permissions
        updateRole: rules.fromAdmin,
        updateBan: graphql_shield_1.and(rules.fromMod, graphql_shield_1.not(rules.isMod), graphql_shield_1.not(rules.isAdmin)),
        // Servers Permissions
        createServer: rules.isAuthenticatedUser,
        updateTitle: graphql_shield_1.or(rules.fromMod, graphql_shield_1.and(rules.isAuthenticatedUser, rules.isServerOwner)),
        addTag: graphql_shield_1.or(rules.fromMod, graphql_shield_1.and(rules.isAuthenticatedUser, rules.isServerOwner)),
        removeTag: graphql_shield_1.or(rules.fromMod, graphql_shield_1.and(rules.isAuthenticatedUser, rules.isServerOwner)),
        updateCover: graphql_shield_1.or(rules.fromMod, graphql_shield_1.and(rules.isAuthenticatedUser, rules.isServerOwner)),
        updateIp: graphql_shield_1.or(rules.fromMod, graphql_shield_1.and(rules.isAuthenticatedUser, rules.isServerOwner)),
        updateRemoteInfo: graphql_shield_1.or(rules.fromMod, graphql_shield_1.and(rules.isAuthenticatedUser, rules.isServerOwner)),
        deleteServer: graphql_shield_1.or(rules.fromMod, graphql_shield_1.and(rules.isAuthenticatedUser, rules.isServerOwner)),
        vote: rules.isAuthenticatedUser,
        resetVotes: rules.fromAdmin
    }
});
