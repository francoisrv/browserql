"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var graphql_tag_1 = __importDefault(require("graphql-tag"));
var describeClient_1 = __importDefault(require("./describeClient"));
var SIMPLE_SCHEMA = "\ntype Query {\n  hello: String\n}\n";
describe('Client', function () {
    describeClient_1.default('should print schema', {
        schema: graphql_tag_1.default(SIMPLE_SCHEMA)
    }, ['should be ok', function (client) {
            expect(client.printSchema().trim()).toEqual(SIMPLE_SCHEMA.trim());
        }]);
});
