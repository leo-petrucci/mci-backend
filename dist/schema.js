"use strict";
exports.__esModule = true;
exports.schema = void 0;
var schema_1 = require("@nexus/schema");
var schema_2 = require("nexus-plugin-prisma/schema");
var types = require("./types");
exports.schema = schema_1.makeSchema({
    types: types,
    plugins: [schema_2.nexusSchemaPrisma()],
    outputs: {
        schema: __dirname + '/../schema.graphql',
        typegen: __dirname + '/generated/nexus.ts'
    },
    typegenAutoConfig: {
        sources: [
            {
                source: '@prisma/client',
                alias: 'client'
            },
            {
                source: require.resolve('./context'),
                alias: 'Context'
            },
        ],
        contextType: 'Context.Context'
    }
});
