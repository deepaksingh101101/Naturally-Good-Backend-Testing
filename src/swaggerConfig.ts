import express from 'express';
import swaggerUi from 'swagger-ui-express';
import YAML from 'yamljs';
import path from 'path';

export const setupSwagger = (app: express.Application) => {
  // Load multiple Swagger documents
  const swaggerDocuments = {
    // tasks: YAML.load(path.join(__dirname, './swagger-docs/Tasks.yaml')),
    // auth: YAML.load(path.join(__dirname, './swagger-docs/Auth.yaml')),
    // admin: YAML.load(path.join(__dirname, './swagger-docs/Admin.yaml')),
    admin: YAML.load(path.join(__dirname, './swagger-docs/admin/SuperAdmin.yaml')),
    user: YAML.load(path.join(__dirname, './swagger-docs/user/User.yaml')),
    // category: YAML.load(path.join(__dirname, './swagger-docs/Category.yaml')),
    // product: YAML.load(path.join(__dirname, './swagger-docs/Product.yaml')),
    // plan: YAML.load(path.join(__dirname, './swagger-docs/Plan.yaml')),
  };

  // Set up Swagger UI for each document
  for (const [key, document] of Object.entries(swaggerDocuments)) {
    app.use(`/docs/${key}`, swaggerUi.serve, swaggerUi.setup(document));
    app.get(`/docs/${key}.json`, (req, res) => {
      res.setHeader('Content-Type', 'application/json');
      res.send(document);
    });
  }
};
