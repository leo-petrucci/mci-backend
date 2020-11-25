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
        t.model.createdAt();
        t.model.author();
        t.model.server();
    }
});
exports.ServerPayload = schema_1.objectType({
    name: 'ServerPayload',
    definition: function (t) {
        t.field('id', { type: 'Int' });
        t.field('published', { type: 'Boolean' });
        t.field('title', { type: 'String' });
        t.field('content', { type: 'String' });
        t.field('author', { type: 'Int' });
        t.field('tags', { type: 'Tag' });
        t.field('version', { type: 'Version' });
        t.field('slots', { type: 'Int' });
        t.field('cover', { type: 'String' });
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
        t.model.votes();
        t.field('voteCount', { type: 'Int' });
    }
});
exports.AuthPayload = schema_1.objectType({
    name: 'AuthPayload',
    definition: function (t) {
        t.field('user', { type: 'User' });
    }
});
