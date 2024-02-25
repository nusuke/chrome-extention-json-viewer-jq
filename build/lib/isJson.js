"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isJSON = void 0;
const isJSON = (document) => {
    return document.contentType === "appliaction/json";
};
exports.isJSON = isJSON;
