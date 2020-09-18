"use strict";
exports.__esModule = true;
exports.Version = void 0;
var schema_1 = require("@nexus/schema");
exports.Version = schema_1.objectType({
    name: 'Version',
    definition: function (t) {
        t.model.id();
        t.model.versionName();
        t.model.Servers();
    }
});
