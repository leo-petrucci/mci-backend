"use strict";
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
exports.__esModule = true;
exports.createContext = void 0;
var client_1 = require("@prisma/client");
var prisma = new client_1.PrismaClient();
function createContext(_a) {
    var request = _a.request, response = _a.response, rest = __rest(_a, ["request", "response"]);
    return {
        req: request,
        res: response,
        prisma: prisma
    };
}
exports.createContext = createContext;
