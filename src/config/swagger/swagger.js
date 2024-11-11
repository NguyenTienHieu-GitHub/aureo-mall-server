const schemas = require("./schemas");
const paths = require("./paths");

const swaggerDocument = {
  openapi: "3.0.0",
  info: {
    title: "API Documentation",
    version: "1.0.7",
    description: "API documentation for the Node.js application",
  },
  servers: [
    {
      url: "http://localhost:3080",
      description: "Development server",
    },
  ],
  components: schemas.components,
  paths: paths,
};

module.exports = swaggerDocument;
