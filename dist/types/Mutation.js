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
exports.Mutation = void 0;
var schema_1 = require("@nexus/schema");
var yup_1 = require("yup");
var jsonwebtoken_1 = require("jsonwebtoken");
var utils_1 = require("../utils");
var cookie = require('cookie');
var validationSchema = {
    title: yup_1.object().shape({
        title: yup_1.string()
            .min(10, 'Title must be at least 10 characters long.')
            .max(280, 'Title must be less than 280 characters long.')
    }),
    tags: yup_1.object().shape({
        tags: yup_1.array().min(1, 'You need to specify at least one tag to add.')
    }),
    removeTag: yup_1.object().shape({
        tags: yup_1.array().min(1, 'You need to specify at least one tag to remove.')
    }),
    cover: yup_1.object().shape({
        cover: yup_1.string()
            .url('Cover needs to be an url.')
            .matches(/[/.](gif|jpg|jpeg|tiff|png)$/, 'Cover needs to be an image.')
    }),
    content: yup_1.object().shape({
        content: yup_1.string()
            .min(280, 'Content must be at least 280 characters long.')
            .max(10000, 'Content must be less than 10000 characters long.')
    })
};
exports.Mutation = schema_1.mutationType({
    definition: function (t) {
        var _this = this;
        t.field('testResponse', {
            type: 'String',
            args: {},
            resolve: function (_parent, _a, _b) {
                var res = _b.res, req = _b.req;
                return __awaiter(_this, void 0, void 0, function () {
                    var securedToken, expiration;
                    return __generator(this, function (_c) {
                        console.log(cookie.parse(req.header('Cookie')));
                        securedToken = 'a string';
                        expiration = new Date();
                        expiration.setDate(expiration.getDate() + 7);
                        res.cookie('rememberme', '1', {
                            expires: new Date(Date.now() + 900000 * 4 * 24 * 7),
                            httpOnly: true
                        });
                        return [2 /*return*/, securedToken];
                    });
                });
            }
        });
        t.field('oAuthLogin', {
            type: 'AuthPayload',
            args: {
                code: schema_1.stringArg({ nullable: false })
            },
            resolve: function (_parent, _a, ctx) {
                var code = _a.code;
                return __awaiter(_this, void 0, void 0, function () {
                    var token, error_1, userProfile, error_2, user, securedToken;
                    return __generator(this, function (_b) {
                        switch (_b.label) {
                            case 0:
                                _b.trys.push([0, 2, , 3]);
                                return [4 /*yield*/, utils_1.getMciToken(code, ctx)];
                            case 1:
                                token = _b.sent();
                                return [3 /*break*/, 3];
                            case 2:
                                error_1 = _b.sent();
                                return [2 /*return*/, error_1];
                            case 3:
                                _b.trys.push([3, 5, , 6]);
                                return [4 /*yield*/, utils_1.getMciProfile(token.access_token)];
                            case 4:
                                userProfile = _b.sent();
                                return [3 /*break*/, 6];
                            case 5:
                                error_2 = _b.sent();
                                return [2 /*return*/, error_2];
                            case 6: return [4 /*yield*/, ctx.prisma.user.upsert({
                                    where: { id: userProfile.id },
                                    create: {
                                        id: userProfile.id,
                                        username: userProfile.name,
                                        photoUrl: userProfile.photoUrl,
                                        email: userProfile.email,
                                        role: 'user',
                                        posts: userProfile.posts
                                    },
                                    update: {
                                        username: userProfile.name,
                                        photoUrl: userProfile.photoUrl,
                                        email: userProfile.email,
                                        posts: userProfile.posts
                                    }
                                })];
                            case 7:
                                user = _b.sent();
                                securedToken = jsonwebtoken_1.sign({ userId: user.id, role: user.role }, utils_1.APP_SECRET, {
                                    expiresIn: '7d'
                                });
                                ctx.res.cookie('token', securedToken, {
                                    expires: new Date(Date.now() + 900000 * 4 * 24 * 7),
                                    httpOnly: true
                                });
                                return [2 /*return*/, {
                                        user: user
                                    }];
                        }
                    });
                });
            }
        });
        t.field('updateRole', {
            type: 'UserPayload',
            args: {
                id: schema_1.intArg({ nullable: false }),
                role: schema_1.stringArg({ nullable: false })
            },
            resolve: function (parent, _a, ctx) {
                var id = _a.id, role = _a.role;
                return __awaiter(_this, void 0, void 0, function () {
                    var user;
                    return __generator(this, function (_b) {
                        switch (_b.label) {
                            case 0: return [4 /*yield*/, ctx.prisma.user.update({
                                    where: { id: id },
                                    data: {
                                        role: role
                                    }
                                })];
                            case 1:
                                user = _b.sent();
                                return [2 /*return*/, {
                                        user: user
                                    }];
                        }
                    });
                });
            }
        });
        t.field('updateBan', {
            type: 'UserPayload',
            args: {
                id: schema_1.intArg({ nullable: false }),
                banned: schema_1.booleanArg({ nullable: false })
            },
            resolve: function (parent, _a, ctx) {
                var banned = _a.banned, id = _a.id;
                return __awaiter(_this, void 0, void 0, function () {
                    var user;
                    return __generator(this, function (_b) {
                        switch (_b.label) {
                            case 0: return [4 /*yield*/, ctx.prisma.user.update({
                                    where: { id: id },
                                    data: {
                                        banned: banned
                                    }
                                })];
                            case 1:
                                user = _b.sent();
                                return [2 /*return*/, {
                                        user: user
                                    }];
                        }
                    });
                });
            }
        });
        t.field('updateTitle', {
            type: 'ServerPayload',
            args: {
                id: schema_1.intArg({ nullable: false }),
                title: schema_1.stringArg({ nullable: false })
            },
            resolve: function (parent, _a, ctx) {
                var title = _a.title, id = _a.id;
                return __awaiter(_this, void 0, void 0, function () {
                    var e_1, server;
                    return __generator(this, function (_b) {
                        switch (_b.label) {
                            case 0:
                                _b.trys.push([0, 2, , 3]);
                                return [4 /*yield*/, validationSchema.title.validate({ title: title })];
                            case 1:
                                _b.sent();
                                return [3 /*break*/, 3];
                            case 2:
                                e_1 = _b.sent();
                                ctx.res.status(400);
                                return [2 /*return*/, new Error(e_1.errors[0])];
                            case 3: return [4 /*yield*/, ctx.prisma.server.update({
                                    where: { id: id },
                                    data: {
                                        title: title
                                    }
                                })];
                            case 4:
                                server = _b.sent();
                                return [2 /*return*/, server];
                        }
                    });
                });
            }
        });
        t.field('updateContent', {
            type: 'ServerPayload',
            args: {
                id: schema_1.intArg({ nullable: false }),
                content: schema_1.stringArg({ nullable: false })
            },
            resolve: function (parent, _a, ctx) {
                var content = _a.content, id = _a.id;
                return __awaiter(_this, void 0, void 0, function () {
                    var e_2, server;
                    return __generator(this, function (_b) {
                        switch (_b.label) {
                            case 0:
                                _b.trys.push([0, 2, , 3]);
                                return [4 /*yield*/, validationSchema.content.validate({ content: content })];
                            case 1:
                                _b.sent();
                                return [3 /*break*/, 3];
                            case 2:
                                e_2 = _b.sent();
                                ctx.res.status(400);
                                return [2 /*return*/, new Error(e_2.errors[0])];
                            case 3: return [4 /*yield*/, ctx.prisma.server.update({
                                    where: { id: id },
                                    data: {
                                        content: content
                                    }
                                })];
                            case 4:
                                server = _b.sent();
                                return [2 /*return*/, { server: server }];
                        }
                    });
                });
            }
        });
        t.field('addTag', {
            type: 'ServerPayload',
            args: {
                id: schema_1.intArg({ nullable: false }),
                tags: schema_1.stringArg({ list: true, nullable: false })
            },
            resolve: function (parent, _a, ctx) {
                var id = _a.id, tags = _a.tags;
                return __awaiter(_this, void 0, void 0, function () {
                    var e_3, tagObjects, server;
                    return __generator(this, function (_b) {
                        switch (_b.label) {
                            case 0:
                                _b.trys.push([0, 2, , 3]);
                                return [4 /*yield*/, validationSchema.tags.validate({ tags: tags })];
                            case 1:
                                _b.sent();
                                return [3 /*break*/, 3];
                            case 2:
                                e_3 = _b.sent();
                                ctx.res.status(400);
                                return [2 /*return*/, new Error(e_3.errors[0])];
                            case 3: return [4 /*yield*/, utils_1.getTagsQuery(ctx, tags)];
                            case 4:
                                tagObjects = _b.sent();
                                return [4 /*yield*/, ctx.prisma.server.update({
                                        where: { id: id },
                                        data: {
                                            tags: tagObjects
                                        }
                                    })];
                            case 5:
                                server = _b.sent();
                                return [2 /*return*/, { server: server }];
                        }
                    });
                });
            }
        });
        t.field('removeTag', {
            type: 'ServerPayload',
            args: {
                id: schema_1.intArg({ nullable: false }),
                tag: schema_1.stringArg({ nullable: false })
            },
            resolve: function (parent, _a, ctx) {
                var id = _a.id, tag = _a.tag;
                return __awaiter(_this, void 0, void 0, function () {
                    var server;
                    return __generator(this, function (_b) {
                        switch (_b.label) {
                            case 0: return [4 /*yield*/, ctx.prisma.server.update({
                                    where: { id: id },
                                    data: {
                                        tags: { disconnect: [{ tagName: tag }] }
                                    }
                                })];
                            case 1:
                                server = _b.sent();
                                return [2 /*return*/, { server: server }];
                        }
                    });
                });
            }
        });
        t.field('updateCover', {
            type: 'ServerPayload',
            args: {
                id: schema_1.intArg({ nullable: false }),
                cover: schema_1.stringArg({ nullable: false })
            },
            resolve: function (parent, _a, ctx) {
                var id = _a.id, cover = _a.cover;
                return __awaiter(_this, void 0, void 0, function () {
                    var e_4, server;
                    return __generator(this, function (_b) {
                        switch (_b.label) {
                            case 0:
                                _b.trys.push([0, 2, , 3]);
                                return [4 /*yield*/, validationSchema.cover.validate({ cover: cover })];
                            case 1:
                                _b.sent();
                                return [3 /*break*/, 3];
                            case 2:
                                e_4 = _b.sent();
                                ctx.res.status(400);
                                return [2 /*return*/, new Error(e_4.errors[0])];
                            case 3: return [4 /*yield*/, ctx.prisma.server.update({
                                    where: { id: id },
                                    data: {
                                        cover: cover
                                    }
                                })];
                            case 4:
                                server = _b.sent();
                                return [2 /*return*/, { server: server }];
                        }
                    });
                });
            }
        });
        t.field('updateIp', {
            type: 'ServerPayload',
            args: {
                id: schema_1.intArg({ nullable: false }),
                ip: schema_1.stringArg({ nullable: false })
            },
            resolve: function (parent, _a, ctx) {
                var id = _a.id, ip = _a.ip;
                return __awaiter(_this, void 0, void 0, function () {
                    var serverInfo, error_3, server;
                    return __generator(this, function (_b) {
                        switch (_b.label) {
                            case 0:
                                _b.trys.push([0, 2, , 3]);
                                return [4 /*yield*/, utils_1.getServerInfo(ip, ctx)];
                            case 1:
                                serverInfo = _b.sent();
                                return [3 /*break*/, 3];
                            case 2:
                                error_3 = _b.sent();
                                return [2 /*return*/, error_3];
                            case 3: return [4 /*yield*/, ctx.prisma.server.update({
                                    where: { id: id },
                                    data: {
                                        ip: ip
                                    }
                                })];
                            case 4:
                                server = _b.sent();
                                return [2 /*return*/, { server: server }];
                        }
                    });
                });
            }
        });
        t.field('updateRemoteInfo', {
            type: 'ServerPayload',
            args: {
                id: schema_1.intArg({ nullable: false }),
                ip: schema_1.stringArg({ nullable: false })
            },
            resolve: function (parent, _a, ctx) {
                var id = _a.id, ip = _a.ip;
                return __awaiter(_this, void 0, void 0, function () {
                    var serverInfo, error_4, versionQuery, server;
                    return __generator(this, function (_b) {
                        switch (_b.label) {
                            case 0:
                                _b.trys.push([0, 2, , 3]);
                                return [4 /*yield*/, utils_1.getServerInfo(ip, ctx)];
                            case 1:
                                serverInfo = _b.sent();
                                return [3 /*break*/, 3];
                            case 2:
                                error_4 = _b.sent();
                                return [2 /*return*/, error_4];
                            case 3: return [4 /*yield*/, utils_1.getVersionQuery(ctx, serverInfo.version)];
                            case 4:
                                versionQuery = _b.sent();
                                console.log('versionQuery', versionQuery);
                                return [4 /*yield*/, ctx.prisma.server.update({
                                        where: { id: id },
                                        data: {
                                            version: versionQuery,
                                            slots: serverInfo.players.max
                                        }
                                    })];
                            case 5:
                                server = _b.sent();
                                return [2 /*return*/, { server: server }];
                        }
                    });
                });
            }
        });
        t.field('createServer', {
            type: 'ServerPayload',
            args: {
                title: schema_1.stringArg({ nullable: false }),
                content: schema_1.stringArg(),
                cover: schema_1.stringArg(),
                tags: schema_1.stringArg({ list: true, nullable: false }),
                ip: schema_1.stringArg({ nullable: false })
            },
            resolve: function (parent, _a, ctx) {
                var title = _a.title, content = _a.content, cover = _a.cover, tags = _a.tags, ip = _a.ip;
                return __awaiter(_this, void 0, void 0, function () {
                    var userId, e_5, tagObjects, serverInfo, versionQuery, server;
                    return __generator(this, function (_b) {
                        switch (_b.label) {
                            case 0:
                                userId = utils_1.getUserId(ctx);
                                _b.label = 1;
                            case 1:
                                _b.trys.push([1, 6, , 7]);
                                return [4 /*yield*/, validationSchema.title.validate({ title: title })];
                            case 2:
                                _b.sent();
                                return [4 /*yield*/, validationSchema.content.validate({ content: content })];
                            case 3:
                                _b.sent();
                                return [4 /*yield*/, validationSchema.cover.validate({ cover: cover })];
                            case 4:
                                _b.sent();
                                return [4 /*yield*/, validationSchema.tags.validate({ tags: tags })];
                            case 5:
                                _b.sent();
                                return [3 /*break*/, 7];
                            case 6:
                                e_5 = _b.sent();
                                ctx.res.status(400);
                                return [2 /*return*/, new Error(e_5.errors[0])];
                            case 7: return [4 /*yield*/, utils_1.getTagsQuery(ctx, tags)];
                            case 8:
                                tagObjects = _b.sent();
                                console.log('tags', tagObjects);
                                if (!userId)
                                    throw new Error('Could not authenticate user.');
                                return [4 /*yield*/, utils_1.getServerInfo(ip, ctx)];
                            case 9:
                                serverInfo = _b.sent();
                                if (!serverInfo.online)
                                    throw new Error('Could not find server info.');
                                return [4 /*yield*/, utils_1.getVersionQuery(ctx, serverInfo.version)];
                            case 10:
                                versionQuery = _b.sent();
                                console.log('versionQuery', versionQuery);
                                return [4 /*yield*/, ctx.prisma.server.create({
                                        data: {
                                            title: title,
                                            content: content,
                                            cover: cover,
                                            ip: ip,
                                            version: versionQuery,
                                            slots: serverInfo.players.max,
                                            tags: tagObjects,
                                            published: true,
                                            author: { connect: { id: Number(userId) } }
                                        }
                                    })];
                            case 11:
                                server = _b.sent();
                                return [2 /*return*/, { server: server }];
                        }
                    });
                });
            }
        });
        t.field('deleteServer', {
            type: 'ServerPayload',
            args: { id: schema_1.intArg({ nullable: false }) },
            resolve: function (parent, _a, ctx) {
                var id = _a.id;
                return __awaiter(_this, void 0, void 0, function () {
                    var server;
                    return __generator(this, function (_b) {
                        server = ctx.prisma.server.update({
                            where: {
                                id: id
                            },
                            data: {
                                published: true
                            }
                        });
                        return [2 /*return*/, { server: server }];
                    });
                });
            }
        });
        t.field('publishServer', {
            type: 'ServerPayload',
            args: { id: schema_1.intArg({ nullable: false }) },
            resolve: function (parent, _a, ctx) {
                var id = _a.id;
                return __awaiter(_this, void 0, void 0, function () {
                    var server;
                    return __generator(this, function (_b) {
                        server = ctx.prisma.server.update({
                            where: {
                                id: id
                            },
                            data: {
                                published: true
                            }
                        });
                        return [2 /*return*/, { server: server }];
                    });
                });
            }
        });
        t.field('vote', {
            type: 'ServerPayload',
            nullable: true,
            args: { id: schema_1.intArg({ nullable: false }) },
            resolve: function (parent, _a, ctx) {
                var id = _a.id;
                return __awaiter(_this, void 0, void 0, function () {
                    var userId, vote;
                    return __generator(this, function (_b) {
                        userId = utils_1.getUserId(ctx);
                        vote = ctx.prisma
                            .$executeRaw(templateObject_1 || (templateObject_1 = __makeTemplateObject(["INSERT INTO \"Vote\" (\"authorId\", \"serverId\") VALUES (", ", ", ");"], ["INSERT INTO \"Vote\" (\"authorId\", \"serverId\") VALUES (", ", ", ");"])), userId, id);
                        return [2 /*return*/, ctx.prisma.server.findOne({
                                where: {
                                    id: Number(id)
                                }
                            })];
                    });
                });
            }
        });
        t.field('resetVotes', {
            type: 'ServerPayload',
            nullable: true,
            args: { id: schema_1.intArg({ nullable: false }) },
            resolve: function (parent, _a, ctx) {
                var id = _a.id;
                return __awaiter(_this, void 0, void 0, function () {
                    var vote;
                    return __generator(this, function (_b) {
                        switch (_b.label) {
                            case 0: return [4 /*yield*/, ctx.prisma.vote.deleteMany({
                                    where: { serverId: id }
                                })];
                            case 1:
                                vote = _b.sent();
                                return [2 /*return*/, ctx.prisma.server.findOne({
                                        where: {
                                            id: Number(id)
                                        }
                                    })];
                        }
                    });
                });
            }
        });
    }
});
var templateObject_1;
