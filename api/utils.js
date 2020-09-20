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
exports.getTagsQuery = exports.getVersionQuery = exports.getMciProfile = exports.getMciToken = exports.getServerInfo = exports.getUserId = exports.APP_SECRET = void 0;
var jsonwebtoken_1 = require("jsonwebtoken");
var axios_1 = require("axios");
var qs = require('querystring');
exports.APP_SECRET = process.env.APP_SECRET;
function getUserId(context) {
    var Authorization = context.request.get('Authorization');
    if (Authorization) {
        var token = Authorization.replace('Bearer ', '');
        try {
            var verifiedToken = jsonwebtoken_1.verify(token, exports.APP_SECRET);
            return verifiedToken && verifiedToken.userId;
        }
        catch (error) {
            console.log('auth error');
            throw new Error('Could not authenticate user.');
        }
    }
}
exports.getUserId = getUserId;
function getServerInfo(Ip) {
    return __awaiter(this, void 0, void 0, function () {
        var data;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, axios_1["default"].get("https://api.mcsrvstat.us/2/" + Ip)];
                case 1:
                    data = (_a.sent()).data;
                    if (!data.online)
                        throw new Error('Could not fetch server.');
                    return [2 /*return*/, data];
            }
        });
    });
}
exports.getServerInfo = getServerInfo;
function getMciToken(code) {
    return __awaiter(this, void 0, void 0, function () {
        var data;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, axios_1["default"]
                        .post("https://www.minecraftitalia.net/oauth/token/", qs.stringify({
                        client_id: process.env.USER_CLIENT_ID,
                        code: code,
                        redirect_uri: process.env.REDIRECT_URI,
                        client_secret: process.env.USER_CLIENT_SECRET,
                        scope: 'profile',
                        grant_type: 'authorization_code'
                    }), {
                        headers: {
                            'Content-Type': 'application/x-www-form-urlencoded'
                        }
                    })
                        .then(function (res) { return res.data; })["catch"](function (error) { return error.response.data; })];
                case 1:
                    data = _a.sent();
                    if (!data.access_token) {
                        throw new Error("There was a problem fetching your token. " + data.error + " - " + data.error_description);
                    }
                    return [2 /*return*/, data];
            }
        });
    });
}
exports.getMciToken = getMciToken;
function getMciProfile(access_token) {
    return __awaiter(this, void 0, void 0, function () {
        var data;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, axios_1["default"]
                        .get("https://www.minecraftitalia.net/api/core/me/", {
                        headers: {
                            Authorization: "Bearer " + access_token
                        }
                    })
                        .then(function (res) { return res.data; })["catch"](function (error) { return error.response.data; })];
                case 1:
                    data = _a.sent();
                    if (!data.id) {
                        throw new Error("There was a problem fetching your profile. " + data.errorCode + " - " + data.errorMessage);
                    }
                    return [2 /*return*/, data];
            }
        });
    });
}
exports.getMciProfile = getMciProfile;
function getVersionQuery(context, versionName) {
    return __awaiter(this, void 0, void 0, function () {
        var foundVersion;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    console.log('checking if ', versionName, 'exists');
                    return [4 /*yield*/, context.prisma.version.findOne({
                            where: {
                                versionName: String(versionName)
                            },
                            select: {
                                id: true
                            }
                        })];
                case 1:
                    foundVersion = _a.sent();
                    return [2 /*return*/, foundVersion
                            ? { connect: { id: foundVersion.id } }
                            : { create: { versionName: versionName } }];
            }
        });
    });
}
exports.getVersionQuery = getVersionQuery;
function getTagsQuery(context, tags) {
    return __awaiter(this, void 0, void 0, function () {
        var foundTags, data;
        var _this = this;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    foundTags = tags.map(function (tag) { return __awaiter(_this, void 0, void 0, function () {
                        var foundTag;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    console.log('Checking tag', tag);
                                    return [4 /*yield*/, context.prisma.tag.findOne({
                                            where: {
                                                tagName: String(tag)
                                            },
                                            select: {
                                                id: true
                                            }
                                        })];
                                case 1:
                                    foundTag = _a.sent();
                                    return [2 /*return*/, { tag: tag, foundTag: foundTag }];
                            }
                        });
                    }); });
                    return [4 /*yield*/, Promise.all(foundTags).then(function (values) {
                            var create = [];
                            var connect = [];
                            values.map(function (value) {
                                // console.log('checking value', value)
                                if (value.foundTag) {
                                    console.log('found existing tag', value.foundTag);
                                    connect.push({ id: value.foundTag.id });
                                }
                                else {
                                    console.log('Did not find tag, creating', value.tag);
                                    create.push({ tagName: value.tag });
                                }
                                return { create: create, connect: connect };
                            });
                            return { create: create, connect: connect };
                        })];
                case 1:
                    data = _a.sent();
                    return [2 /*return*/, data];
            }
        });
    });
}
exports.getTagsQuery = getTagsQuery;
