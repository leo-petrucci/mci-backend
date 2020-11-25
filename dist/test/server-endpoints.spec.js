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
describe('Server Endpoints', function () {
    it("Server title can't be nulled", function () { return __awaiter(void 0, void 0, void 0, function () {
        var res;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, chai
                        .request(app)
                        .post('/')
                        .set('Cookie', 'token=' + process.env.ADMIN_TOKEN)
                        .send({
                        query: "mutation{ updateTitle(id: 1, title: null) { server { title } } }"
                    })];
                case 1:
                    res = _a.sent();
                    expect(res).to.have.status(400);
                    expect(res.body.errors).to.be.an('array');
                    expect(res.body.errors[0].message).to.be.a('string', 'Expected type String!, found null.');
                    return [2 /*return*/];
            }
        });
    }); });
    it("Server title can't be short", function () { return __awaiter(void 0, void 0, void 0, function () {
        var res;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, chai
                        .request(app)
                        .post('/')
                        .set('Cookie', 'token=' + process.env.ADMIN_TOKEN)
                        .send({
                        query: "mutation{ updateTitle(id: 1, title: \"test\") { server { title } } }"
                    })];
                case 1:
                    res = _a.sent();
                    expect(res).to.have.status(400);
                    expect(res.body.errors[0].message).to.be.a('string', 'Title must be at least 10 characters long.');
                    return [2 /*return*/];
            }
        });
    }); });
    it("Server title can't be too long", function () { return __awaiter(void 0, void 0, void 0, function () {
        var res;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, chai
                        .request(app)
                        .post('/')
                        .set('Cookie', 'token=' + process.env.ADMIN_TOKEN)
                        .send({
                        query: "mutation{ updateTitle(id: 1, title: \"" + new Array(281 + 1).join('a') + "\") { server { title } } }"
                    })];
                case 1:
                    res = _a.sent();
                    expect(res).to.have.status(400);
                    expect(res.body.errors[0].message).to.be.a('string', 'Title must be less than 280 characters long.');
                    return [2 /*return*/];
            }
        });
    }); });
    it("Adding tags can't be length 0", function () { return __awaiter(void 0, void 0, void 0, function () {
        var res;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, chai
                        .request(app)
                        .post('/')
                        .set('Cookie', 'token=' + process.env.ADMIN_TOKEN)
                        .send({
                        query: "mutation{ addTag(id: 1, tags: []) { server { title } } }"
                    })];
                case 1:
                    res = _a.sent();
                    expect(res).to.have.status(400);
                    expect(res.body.errors[0].message).to.be.a('string', 'You need to specify at least one tag to add.');
                    return [2 /*return*/];
            }
        });
    }); });
    it("Removing tags can't be null", function () { return __awaiter(void 0, void 0, void 0, function () {
        var res;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, chai
                        .request(app)
                        .post('/')
                        .set('Cookie', 'token=' + process.env.ADMIN_TOKEN)
                        .send({
                        query: "mutation{ addTag(id: 1, tags: null) { server { title } } }"
                    })];
                case 1:
                    res = _a.sent();
                    expect(res).to.have.status(400);
                    expect(res.body.errors[0].message).to.be.a('string', 'You need to specify one tag to remove.');
                    return [2 /*return*/];
            }
        });
    }); });
    it('Cover needs to be a url', function () { return __awaiter(void 0, void 0, void 0, function () {
        var res;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, chai
                        .request(app)
                        .post('/')
                        .set('Cookie', 'token=' + process.env.ADMIN_TOKEN)
                        .send({
                        query: "mutation{ addTag(id: 1, cover: \"test\") { server { title } } }"
                    })];
                case 1:
                    res = _a.sent();
                    expect(res).to.have.status(400);
                    expect(res.body.errors[0].message).to.be.a('string', 'Cover needs to be an url.');
                    return [2 /*return*/];
            }
        });
    }); });
    it('Cover needs to be a url', function () { return __awaiter(void 0, void 0, void 0, function () {
        var res;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, chai
                        .request(app)
                        .post('/')
                        .set('Cookie', 'token=' + process.env.ADMIN_TOKEN)
                        .send({
                        query: "mutation{ addTag(id: 1, cover: \"http://test\") { server { title } } }"
                    })];
                case 1:
                    res = _a.sent();
                    expect(res).to.have.status(400);
                    expect(res.body.errors[0].message).to.be.a('string', 'Cover needs to be an image.');
                    return [2 /*return*/];
            }
        });
    }); });
    it('Content needs to be at least 280 characters long', function () { return __awaiter(void 0, void 0, void 0, function () {
        var res;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, chai
                        .request(app)
                        .post('/')
                        .set('Cookie', 'token=' + process.env.ADMIN_TOKEN)
                        .send({
                        query: "mutation{ updateContent(id: 1, content: \"test\") { server { title } } }"
                    })];
                case 1:
                    res = _a.sent();
                    expect(res).to.have.status(400);
                    expect(res.body.errors[0].message).to.be.a('string', 'Content must be at least 280 characters long.');
                    return [2 /*return*/];
            }
        });
    }); });
    it('Content needs to be less than 10000 characters long', function () { return __awaiter(void 0, void 0, void 0, function () {
        var res;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, chai
                        .request(app)
                        .post('/')
                        .set('Cookie', 'token=' + process.env.ADMIN_TOKEN)
                        .send({
                        query: "mutation{ updateContent(id: 1, content: \"" + new Array(10001 + 1).join('a') + "\") { server { title } } }"
                    })];
                case 1:
                    res = _a.sent();
                    expect(res).to.have.status(400);
                    expect(res.body.errors[0].message).to.be.a('string', 'Content must be less than 10000 characters long.');
                    return [2 /*return*/];
            }
        });
    }); });
    it("Can't create server with short title", function () { return __awaiter(void 0, void 0, void 0, function () {
        var res;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, chai
                        .request(app)
                        .post('/')
                        .set('Cookie', 'token=' + process.env.ADMIN_TOKEN)
                        .send({
                        query: "mutation{ createServer(title: \"test\") { server { title } } }"
                    })];
                case 1:
                    res = _a.sent();
                    expect(res).to.have.status(400);
                    expect(res.body.errors[0].message).to.be.a('string', 'Title must be at least 10 characters long.');
                    return [2 /*return*/];
            }
        });
    }); });
    it("Can't create server with long title", function () { return __awaiter(void 0, void 0, void 0, function () {
        var res;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, chai
                        .request(app)
                        .post('/')
                        .set('Cookie', 'token=' + process.env.ADMIN_TOKEN)
                        .send({
                        query: "mutation{ createServer(title: \"" + new Array(281 + 1).join('a') + "\") { server { title } } }"
                    })];
                case 1:
                    res = _a.sent();
                    expect(res).to.have.status(400);
                    expect(res.body.errors[0].message).to.be.a('string', 'Title must be less than 280 characters long.');
                    return [2 /*return*/];
            }
        });
    }); });
    it("Can't create server with no tags", function () { return __awaiter(void 0, void 0, void 0, function () {
        var res;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, chai
                        .request(app)
                        .post('/')
                        .set('Cookie', 'token=' + process.env.ADMIN_TOKEN)
                        .send({
                        query: "mutation{ createServer(title: \"" + new Array(20 + 1).join('a') + "\", tags: []) { server { title } } }"
                    })];
                case 1:
                    res = _a.sent();
                    expect(res).to.have.status(400);
                    expect(res.body.errors[0].message).to.be.a('string', 'You need to specify at least one tag to add.');
                    return [2 /*return*/];
            }
        });
    }); });
    it("non logged in users can't vote", function () { return __awaiter(void 0, void 0, void 0, function () {
        var res;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, chai.request(app).post('/').send({
                        query: "mutation{ vote(id: 1) { title } }"
                    })];
                case 1:
                    res = _a.sent();
                    expect(res).to.have.status(401);
                    expect(res.body.errors[0].message).to.be.a('string', 'Not Authorised!');
                    return [2 /*return*/];
            }
        });
    }); });
    it('logged in users can vote', function () { return __awaiter(void 0, void 0, void 0, function () {
        var res;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, chai
                        .request(app)
                        .post('/')
                        .set('Cookie', 'token=' + process.env.USER_TOKEN)
                        .send({
                        query: "mutation{ vote(id: 1) { title } }"
                    })];
                case 1:
                    res = _a.sent();
                    expect(res).to.have.status(200);
                    return [2 /*return*/];
            }
        });
    }); });
    it('admins can reset votes', function () { return __awaiter(void 0, void 0, void 0, function () {
        var res;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, chai
                        .request(app)
                        .post('/')
                        .set('Cookie', 'token=' + process.env.ADMIN_TOKEN)
                        .send({
                        query: "mutation {\n          resetVotes(id: 1) {\n            title\n          }\n        }\n        "
                    })];
                case 1:
                    res = _a.sent();
                    expect(res).to.have.status(200);
                    return [2 /*return*/];
            }
        });
    }); });
});
