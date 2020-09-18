"use strict";
exports.__esModule = true;
exports.Vote = void 0;
var schema_1 = require("@nexus/schema");
exports.Vote = schema_1.objectType({
    name: 'Vote',
    definition: function (t) {
        t.model.id();
        t.model.author();
        t.model.server();
    }
});
