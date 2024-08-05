import express from 'express';
import swaggerUi from 'swagger-ui-express';
import YAML from 'yamljs';
import path from 'path';

export const setupSwagger = (app: express.Application) => {
  // Load multiple Swagger documents
  const swaggerDocuments = {
    admin: YAML.load(path.join(__dirname, './swagger-docs/admin/SuperAdmin.yaml')),
    // Uncomment and add other documents as needed
    // tasks: YAML.load(path.join(__dirname, './swagger-docs/Tasks.yaml')),
    // auth: YAML.load(path.join(__dirname, './swagger-docs/Auth.yaml')),
    // user: YAML.load(path.join(__dirname, './swagger-docs/user/User.yaml')),
    // category: YAML.load(path.join(__dirname, './swagger-docs/Category.yaml')),
    // product: YAML.load(path.join(__dirname, './swagger-docs/Product.yaml')),
    // plan: YAML.load(path.join(__dirname, './swagger-docs/Plan.yaml')),
  };

  // Set up Swagger UI for each document
  for (const [key, document] of Object.entries(swaggerDocuments)) {
    // Use Swagger UI to serve the documentation
    app.use(`/docs/${key}`, swaggerUi.serve, swaggerUi.setup(document));
    // Endpoint to get the raw Swagger JSON document
    app.get(`/docs/${key}.json`, (req, res) => {
      res.setHeader('Content-Type', 'application/json');
      res.send(document);
    });
  }
};
