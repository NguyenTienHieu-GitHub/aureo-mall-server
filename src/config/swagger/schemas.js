module.exports = {
  components: {
    schemas: {
      MailExists: {
        type: "object",
        properties: {
          success: {
            type: "boolean",
            example: "false",
          },
          message: {
            type: "string",
            example: "Email already exists.",
          },
        },
      },
      MissingRequireFields: {
        type: "object",
        properties: {
          success: {
            type: "boolean",
            example: "false",
          },
          message: {
            type: "string",
            example: "Missing required fields",
          },
        },
      },
      InternalServerErrorResponse: {
        type: "object",
        properties: {
          success: {
            type: "boolean",
            example: "false",
          },
          message: {
            type: "string",
            example: "Internal Server Error",
          },
        },
      },
      FieldUpdateUserAdmin: {
        type: "object",
        properties: {
          firstName: {
            type: "string",
            example: "User",
          },
          lastName: {
            type: "string",
            example: "One",
          },
          email: {
            type: "string",
            example: "user1@gamil.com",
          },
          password: {
            type: "string",
            example: "User1@12345678",
          },
          roleId: {
            type: "integer",
            example: "2",
          },
        },
        required: ["email", "firstName", "lastName", "password", "roleId"],
      },
    },
    securitySchemes: {
      BearerAuth: {
        type: "http",
        scheme: "Bearer",
        bearerFormat: "JWT",
      },
      CookieAuth: {
        type: "apiKey",
        in: "cookie",
        name: "refreshToken",
      },
    },
  },
};
