"use strict";
exports.__esModule = true;
exports.User = void 0;
var schema_1 = require("@nexus/schema");
exports.User = schema_1.objectType({
    name: 'User',
    definition: function (t) {
        t.model.id();
        t.model.username();
        t.model.email();
        t.model.role();
        t.model.banned();
        t.model.photoUrl();
        t.model.Votes();
        t.model.Servers();
    }
});
