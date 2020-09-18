"use strict";
exports.__esModule = true;
exports.ServerPayload = void 0;
var schema_1 = require("@nexus/schema");
exports.ServerPayload = schema_1.objectType({
    name: 'ServerPayload',
    definition: function (t) {
        t.field('server', { type: 'Server' });
    }
});
