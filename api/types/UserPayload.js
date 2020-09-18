"use strict";
exports.__esModule = true;
exports.UserPayload = void 0;
var schema_1 = require("@nexus/schema");
exports.UserPayload = schema_1.objectType({
    name: 'UserPayload',
    definition: function (t) {
        t.field('user', { type: 'User' });
    }
});
