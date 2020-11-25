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
var chai = require('chai');
var chaiHttp = require('chai-http');
var server = require('../server').server;
var gql = require('graphql-tag');
var app;
var expect = chai.expect;
chai.use(chaiHttp);
before(function () { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, server];
            case 1:
                app = _a.sent();
                return [2 /*return*/];
        }
    });
}); });
describe('Permissions', function () {
    it("user can't change roles", function () { return __awaiter(void 0, void 0, void 0, function () {
        var res;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, chai
                        .request(app)
                        .post('/')
                        .set('Cookie', 'token=' + process.env.USER_TOKEN)
                        .send({
                        query: "mutation { updateRole(id: 65157, role: \"mod\") { user { role } } }"
                    })];
                case 1:
                    res = _a.sent();
                    expect(res.body.errors).to.be.an('array');
                    expect(res.body.errors[0].message).to.be.a('string', 'Not Authorised!');
                    return [2 /*return*/];
            }
        });
    }); });
    it("user can't ban", function () { return __awaiter(void 0, void 0, void 0, function () {
        var res;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, chai
                        .request(app)
                        .post('/')
                        .set('Cookie', 'token=' + process.env.USER_TOKEN)
                        .send({
                        query: "mutation{\n          updateBan(id: 9999, banned: true) {\n            user{\n              banned,\n                username\n            }\n          }\n        }"
                    })];
                case 1:
                    res = _a.sent();
                    expect(res.body.errors).to.be.an('array');
                    expect(res.body.errors[0].message).to.be.a('string', 'Not Authorised!');
                    return [2 /*return*/];
            }
        });
    }); });
    it("user can't view list of users", function () { return __awaiter(void 0, void 0, void 0, function () {
        var res;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, chai
                        .request(app)
                        .post('/')
                        .set('Cookie', 'token=' + process.env.USER_TOKEN)
                        .send({ query: '{ users { username }}' })];
                case 1:
                    res = _a.sent();
                    expect(res.body.errors).to.be.an('array');
                    expect(res.body.errors[0].message).to.be.a('string', 'Not Authorised!');
                    return [2 /*return*/];
            }
        });
    }); });
    it("user can't edit servers it doesn't own", function () { return __awaiter(void 0, void 0, void 0, function () {
        var res;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, chai
                        .request(app)
                        .post('/')
                        .set('token', process.env.USER_TOKEN)
                        .send({
                        query: "mutation{\n          updateTitle(id: 1, title: \"New title\") {\n            server{\n              title\n            }\n          }\n        }"
                    })];
                case 1:
                    res = _a.sent();
                    expect(res.body.errors).to.be.an('array');
                    expect(res.body.errors[0].message).to.be.a('string', 'Not Authorised!');
                    return [2 /*return*/];
            }
        });
    }); });
    it("users can't reset votes", function () { return __awaiter(void 0, void 0, void 0, function () {
        var res;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, chai
                        .request(app)
                        .post('/')
                        .set('Cookie', 'token=' + process.env.USER_TOKEN)
                        .send({
                        query: "mutation { resetVotes(id: 1\") { title }"
                    })];
                case 1:
                    res = _a.sent();
                    expect(res).to.have.status(400);
                    return [2 /*return*/];
            }
        });
    }); });
    it('admin can set users to mods', function () { return __awaiter(void 0, void 0, void 0, function () {
        var res;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, chai
                        .request(app)
                        .post('/')
                        .set('Cookie', 'token=' + process.env.ADMIN_TOKEN)
                        .send({
                        query: "mutation { updateRole(id: 65157, role: \"mod\") { user { role } } }"
                    })];
                case 1:
                    res = _a.sent();
                    expect(res).to.have.status(200);
                    expect(res.body.data.updateRole.user).to.exist;
                    expect(res.body.data.updateRole.user.role).to.be.a('string', 'mod');
                    return [2 /*return*/];
            }
        });
    }); });
    it("mods can't change roles", function () { return __awaiter(void 0, void 0, void 0, function () {
        var res;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, chai
                        .request(app)
                        .post('/')
                        .set('Cookie', 'token=' + process.env.USER_TOKEN)
                        .send({
                        query: "mutation { updateRole(id: 9999, role: \"admin\") { user { role } } }"
                    })];
                case 1:
                    res = _a.sent();
                    expect(res.body.errors).to.be.an('array');
                    expect(res.body.errors[0].message).to.be.a('string', 'Not Authorised!');
                    return [2 /*return*/];
            }
        });
    }); });
    it('mods can ban users', function () { return __awaiter(void 0, void 0, void 0, function () {
        var res;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, chai
                        .request(app)
                        .post('/')
                        .set('Cookie', 'token=' + process.env.USER_TOKEN)
                        .send({
                        query: "mutation{\n          updateBan(id: 9999, banned: true) {\n            user{\n              banned\n            }\n          }\n        }"
                    })];
                case 1:
                    res = _a.sent();
                    expect(res).to.have.status(200);
                    expect(res.body.data.updateBan.user.banned).to.be.a('boolean', true);
                    return [2 /*return*/];
            }
        });
    }); });
    it('mods can unban users', function () { return __awaiter(void 0, void 0, void 0, function () {
        var res;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, chai
                        .request(app)
                        .post('/')
                        .set('Cookie', 'token=' + process.env.USER_TOKEN)
                        .send({
                        query: "mutation{\n          updateBan(id: 9999, banned: false) {\n            user{\n              banned\n            }\n          }\n        }"
                    })];
                case 1:
                    res = _a.sent();
                    expect(res).to.have.status(200);
                    expect(res.body.data.updateBan.user.banned).to.be.a('boolean', false);
                    return [2 /*return*/];
            }
        });
    }); });
    it("mods can't ban mods", function () { return __awaiter(void 0, void 0, void 0, function () {
        var res;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, chai
                        .request(app)
                        .post('/')
                        .set('Cookie', 'token=' + process.env.USER_TOKEN)
                        .send({
                        query: "mutation{\n          updateBan(id: 65157, banned: true) {\n            user{\n              banned\n            }\n          }\n        }"
                    })];
                case 1:
                    res = _a.sent();
                    expect(res.body.errors).to.be.an('array');
                    expect(res.body.errors[0].message).to.be.a('string', 'Not Authorised!');
                    return [2 /*return*/];
            }
        });
    }); });
    it("mods can't ban admins", function () { return __awaiter(void 0, void 0, void 0, function () {
        var res;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, chai
                        .request(app)
                        .post('/')
                        .set('Cookie', 'token=' + process.env.USER_TOKEN)
                        .send({
                        query: "mutation{\n          updateBan(id: 6667, banned: true) {\n            user{\n              banned\n            }\n          }\n        }"
                    })];
                case 1:
                    res = _a.sent();
                    expect(res.body.errors).to.be.an('array');
                    expect(res.body.errors[0].message).to.be.a('string', 'Not Authorised!');
                    return [2 /*return*/];
            }
        });
    }); });
    it("mods can't reset votes", function () { return __awaiter(void 0, void 0, void 0, function () {
        var res;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, chai
                        .request(app)
                        .post('/')
                        .set('Cookie', 'token=' + process.env.ADMIN_TOKEN)
                        .send({
                        query: "mutation { resetVotes(id: 1\") { title }"
                    })];
                case 1:
                    res = _a.sent();
                    expect(res).to.have.status(400);
                    return [2 /*return*/];
            }
        });
    }); });
    it("mods can edit servers they don't own", function () { return __awaiter(void 0, void 0, void 0, function () {
        var res;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, chai
                        .request(app)
                        .post('/')
                        .set('Cookie', 'token=' + process.env.USER_TOKEN)
                        .send({
                        query: "mutation{\n          updateTitle(id: 1, title: \"New title of a big ole server\") {\n            title\n          }\n        }"
                    })];
                case 1:
                    res = _a.sent();
                    expect(res).to.have.status(200);
                    expect(res.body.data.updateTitle).to.exist;
                    expect(res.body.data.updateTitle.title).to.be.a('string', 'New title of a big ole server');
                    return [2 /*return*/];
            }
        });
    }); });
    it('admin can set mods to users', function () { return __awaiter(void 0, void 0, void 0, function () {
        var res;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, chai
                        .request(app)
                        .post('/')
                        .set('Cookie', 'token=' + process.env.ADMIN_TOKEN)
                        .send({
                        query: "mutation { updateRole(id: 65157, role: \"user\") { user { role } } }"
                    })];
                case 1:
                    res = _a.sent();
                    expect(res).to.have.status(200);
                    expect(res.body.data.updateRole.user).to.exist;
                    expect(res.body.data.updateRole.user.role).to.be.a('string', 'mod');
                    return [2 /*return*/];
            }
        });
    }); });
});
