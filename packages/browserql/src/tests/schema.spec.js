"use strict";
var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var graphql_tag_1 = __importDefault(require("graphql-tag"));
var describeClient_1 = __importDefault(require("./describeClient"));
describe('Schema', function () {
    describeClient_1.default('should accept query-less schema', {
        schema: graphql_tag_1.default(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n      type Foo {\n        id: ID!\n      }\n      "], ["\n      type Foo {\n        id: ID!\n      }\n      "])))
    }, ['should be ok', function (client) {
            console.log(client.printSchema());
        }]);
});
var templateObject_1;
