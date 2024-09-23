"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createTaskSchema = void 0;
const zod_1 = require("zod");
exports.createTaskSchema = zod_1.z.object({
    title: zod_1.z.string().nonempty({
        message: "title is required",
    }),
    description: zod_1.z.string().nonempty({
        message: "description is required",
    }),
});
