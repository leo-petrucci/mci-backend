"use strict";
exports.__esModule = true;
exports.Tag = void 0;
var schema_1 = require("@nexus/schema");
exports.Tag = schema_1.objectType({
    name: 'Tag',
    definition: function (t) {
        t.model.id();
        t.model.tagName();
        t.model.Servers();
    }
});
