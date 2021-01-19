"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.breakpoints = exports.firestore = exports.firebase = void 0;
var mock_cloud_firestore_1 = __importDefault(require("mock-cloud-firestore"));
var fixtureData = {
    __collection__: {
        users: {
            __doc__: {
                user_a: {
                    age: 15,
                    username: 'user_a',
                },
            },
        },
    },
};
exports.firebase = new mock_cloud_firestore_1.default(fixtureData);
exports.firestore = exports.firebase.firestore;
exports.breakpoints = { xs: 0, sm: 480, md: 1024 };
