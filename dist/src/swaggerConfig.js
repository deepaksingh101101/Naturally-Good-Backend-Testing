"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.setupSwagger = void 0;
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const yamljs_1 = __importDefault(require("yamljs"));
const path_1 = __importDefault(require("path"));
const setupSwagger = (app) => {
    // Load multiple Swagger documents
    const swaggerDocuments = {
        superAdmin: yamljs_1.default.load(path_1.default.join(__dirname, './swagger-docs/superAdmin/SuperAdmin.yaml')),
        admin: yamljs_1.default.load(path_1.default.join(__dirname, './swagger-docs/admin/Admin.yaml')),
    };
    // Set up Swagger UI for each document
    for (const [key, document] of Object.entries(swaggerDocuments)) {
        // Use Swagger UI to serve the documentation
        app.use(`/docs/${key}`, swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(document));
        // Endpoint to get the raw Swagger JSON document
        app.get(`/docs/${key}.json`, (req, res) => {
            res.setHeader('Content-Type', 'application/json');
            res.send(document);
        });
    }
};
exports.setupSwagger = setupSwagger;
