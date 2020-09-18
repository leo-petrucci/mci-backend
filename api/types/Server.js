"use strict";
exports.__esModule = true;
exports.Server = void 0;
var schema_1 = require("@nexus/schema");
exports.Server = schema_1.objectType({
    name: 'Server',
    definition: function (t) {
        t.model.id();
        t.model.published();
        t.model.title();
        t.model.content();
        t.model.author();
        t.model.tags();
        t.model.version();
        t.model.slots();
        t.model.cover();
    }
});
