"use strict";
exports.__esModule = true;
exports.AuthPayload = exports.Server = exports.ServerPayload = exports.Vote = exports.Version = exports.UserPayload = exports.Tag = exports.User = void 0;
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
exports.Tag = schema_1.objectType({
    name: 'Tag',
    definition: function (t) {
        t.model.id();
        t.model.tagName();
        t.model.Servers();
    }
});
exports.UserPayload = schema_1.objectType({
    name: 'UserPayload',
    definition: function (t) {
        t.field('user', { type: 'User' });
    }
});
exports.Version = schema_1.objectType({
    name: 'Version',
    definition: function (t) {
        t.model.id();
        t.model.versionName();
        t.model.Servers();
    }
});
exports.Vote = schema_1.objectType({
    name: 'Vote',
    definition: function (t) {
        t.model.id();
        t.model.author();
        t.model.server();
    }
});
exports.ServerPayload = schema_1.objectType({
    name: 'ServerPayload',
    definition: function (t) {
        t.field('server', { type: 'Server' });
    }
});
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
exports.AuthPayload = schema_1.objectType({
    name: 'AuthPayload',
    definition: function (t) {
        t.string('token');
        t.field('user', { type: 'User' });
    }
});
