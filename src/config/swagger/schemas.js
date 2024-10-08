module.exports = {
  components: {
    schemas: {
      successResponseTrue: {
        type: "boolean",
        example: true,
      },
      successResponseFalse: {
        type: "boolean",
        example: false,
      },
      dataResponseNull: {
        oneOf: [{ type: "null" }, { type: "object" }],
        example: null,
      },
      dataResponseUserArray: {
        oneOf: [{ type: "null" }, { type: "object" }],
        type: "array",
        items: {
          type: "object",
          properties: {
            userId: {
              type: "string",
              format: "uuid",
              example: "",
            },
            firstName: {
              type: "string",
              example: "Admin",
            },
            lastName: {
              type: "string",
              example: "Admin",
            },
            email: {
              type: "string",
              example: "admin@gmail.com",
            },
            roleName: {
              type: "array",
              example: ["Admin", "Customer"],
            },
            createdAt: {
              type: "string",
              format: "date-time",
              example: "2024-10-03T11:41:02.441Z",
            },
            updatedAt: {
              type: "string",
              format: "date-time",
              example: "2024-10-03T11:41:02.441Z",
            },
          },
        },
      },
      dataResponseAddressArray: {
        oneOf: [{ type: "null" }, { type: "object" }],
        type: "array",
        items: {
          type: "object",
          properties: {
            addressId: {
              type: "string",
              example: "1",
            },
            userId: {
              type: "string",
              format: "uuid",
              example: "",
            },
            firstName: {
              type: "string",
              example: "Admin",
            },
            lastName: {
              type: "string",
              example: "Admin",
            },
            phoneNumber: {
              type: "string",
              example: "0975515940",
            },
            province: {
              type: "string",
              example: "Hồ Chí Minh",
            },
            district: {
              type: "string",
              example: "Gò Vấp",
            },
            ward: {
              type: "string",
              example: "Phường 12",
            },
            address: {
              type: "string",
              example: "230/20/1 Phan Huy Ích",
            },
          },
        },
      },
      dataResponseObject: {
        oneOf: [{ type: "null" }, { type: "object" }],
        type: "object",
        properties: {
          userId: {
            type: "string",
            format: "uuid",
            example: "fe7089f4-f070-4b49-8602-0cd27d8fc975",
          },
          firstName: {
            type: "string",
            example: "Admin",
          },
          lastName: {
            type: "string",
            example: "Admin",
          },
          email: {
            type: "string",
            example: "admin@gmail.com",
          },
          roleName: {
            type: "array",
            example: ["Admin", "Customer"],
          },
          createdAt: {
            type: "string",
            format: "date-time",
            example: "2024-10-03T11:41:02.441Z",
          },
          updatedAt: {
            type: "string",
            format: "date-time",
            example: "2024-10-03T11:41:02.441Z",
          },
        },
      },
      dataResponseAddressObject: {
        oneOf: [{ type: "null" }, { type: "object" }],
        type: "object",
        properties: {
          addressId: {
            type: "string",
            example: "1",
          },
          userId: {
            type: "string",
            format: "uuid",
            example: "",
          },
          firstName: {
            type: "string",
            example: "Admin",
          },
          lastName: {
            type: "string",
            example: "Admin",
          },
          phoneNumber: {
            type: "string",
            example: "0975515940",
          },
          province: {
            type: "string",
            example: "Hồ Chí Minh",
          },
          district: {
            type: "string",
            example: "Gò Vấp",
          },
          ward: {
            type: "string",
            example: "Phường 12",
          },
          address: {
            type: "string",
            example: "230/20/1 Phan Huy Ích",
          },
        },
      },
      errorResponseServer: {
        type: "string",
        example: "Error details",
      },
      errorResponseNull: {
        oneOf: [{ type: "null" }, { type: "string" }],
        example: null,
      },
      messageResponseError: {
        type: "string",
        example: "Internal Server Error",
      },
      responseRegisterSuccess: {
        type: "object",
        properties: {
          success: {
            $ref: "#/components/schemas/successResponseTrue",
          },
          message: {
            type: "string",
            example: "Registered account successfully",
          },
          data: {
            $ref: "#/components/schemas/dataResponseNull",
          },
          error: {
            $ref: "#/components/schemas/dataResponseNull",
          },
        },
      },

      requestLogin: {
        type: "object",
        properties: {
          email: {
            type: "string",
            example: "admin@gmail.com",
          },
          password: {
            type: "string",
            example: "Admin@12345678",
          },
        },
        required: ["email", "password"],
      },

      responseLoginSuccess: {
        type: "object",
        properties: {
          success: {
            $ref: "#/components/schemas/successResponseTrue",
          },
          message: {
            type: "string",
            example: "Login Successfully",
          },
          data: {
            type: "object",
            properties: {
              accessKey: {
                type: "string",
                example:
                  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjcwMmRmYzMyLWM1MWYtNDQ1OC1iMjZkLTBiZDdkMzRmNmNiNyIsImVtYWlsIjoiYWRtaW5AZ21haWwuY29tIiwiaWF0IjoxNzI4Mzc3MjEzLCJleHAiOjE3MjgzNzc4MTN9.VPFcK0AsFkqorkIwF_3knnqIcIq3EWL5bBLKpDdX9Dw",
              },
            },
          },
          error: {
            $ref: "#/components/schemas/errorResponseNull",
          },
        },
      },
      responseRefreshSuccess: {
        type: "object",
        properties: {
          success: {
            $ref: "#/components/schemas/successResponseTrue",
          },
          message: {
            type: "string",
            example: "Refresh token successfully",
          },
          data: {
            type: "object",
            properties: {
              newAccessKey: {
                type: "string",
                example:
                  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjcwMmRmYzMyLWM1MWYtNDQ1OC1iMjZkLTBiZDdkMzRmNmNiNyIsImVtYWlsIjoiYWRtaW5AZ21haWwuY29tIiwiaWF0IjoxNzI4Mzc5NjQyLCJleHAiOjE3MjgzODAyNDJ9.MgoA5BFemdUSnOd3vNF7SnkPpCSkftdmJOeGi2ieVIQ",
              },
            },
          },
          error: {
            $ref: "#/components/schemas/errorResponseNull",
          },
        },
      },
      responseLogoutSuccess: {
        type: "object",
        properties: {
          success: {
            $ref: "#/components/schemas/successResponseTrue",
          },
          message: {
            type: "string",
            example: "Logout Successfully",
          },
          data: {
            $ref: "#/components/schemas/dataResponseNull",
          },
          error: {
            $ref: "#/components/schemas/errorResponseNull",
          },
        },
      },
      responseGetMyInfo: {
        type: "object",
        properties: {
          success: {
            $ref: "#/components/schemas/successResponseTrue",
          },
          message: {
            type: "string",
            example: "User information retrieved successfully",
          },
          data: {
            $ref: "#/components/schemas/dataResponseObject",
          },
          error: {
            $ref: "#/components/schemas/errorResponseNull",
          },
        },
      },
      responseGetAllUserSuccess: {
        type: "object",
        properties: {
          success: {
            $ref: "#/components/schemas/successResponseTrue",
          },
          message: {
            type: "string",
            example: "Show all users successfully",
          },
          data: {
            $ref: "#/components/schemas/dataResponseUserArray",
          },
          error: {
            $ref: "#/components/schemas/errorResponseNull",
          },
        },
      },
      responseGetUserByIdSuccess: {
        type: "object",
        properties: {
          success: {
            $ref: "#/components/schemas/successResponseTrue",
          },
          message: {
            type: "string",
            example: "Show all users successfully",
          },
          data: {
            $ref: "#/components/schemas/dataResponseObject",
          },
          error: {
            $ref: "#/components/schemas/errorResponseNull",
          },
        },
      },
      responseCreateSuccess: {
        type: "object",
        properties: {
          success: {
            $ref: "#/components/schemas/successResponseTrue",
          },
          message: {
            type: "string",
            example: "Created user successfully",
          },
          data: {
            $ref: "#/components/schemas/dataResponseObject",
          },
          error: {
            $ref: "#/components/schemas/errorResponseNull",
          },
        },
      },
      responseDeleteUserSuccess: {
        type: "object",
        properties: {
          success: {
            $ref: "#/components/schemas/successResponseTrue",
          },
          message: {
            type: "string",
            example: "User deleted successfully",
          },
          data: {
            $ref: "#/components/schemas/dataResponseNull",
          },
          error: {
            $ref: "#/components/schemas/errorResponseNull",
          },
        },
      },
      responseDeleteMyUserSuccess: {
        type: "object",
        properties: {
          success: {
            $ref: "#/components/schemas/successResponseTrue",
          },
          message: {
            type: "string",
            example: "Your account has been deleted successfully",
          },
          data: {
            $ref: "#/components/schemas/dataResponseNull",
          },
          error: {
            $ref: "#/components/schemas/errorResponseNull",
          },
        },
      },
      responseUpdateUserByIdSuccess: {
        type: "object",
        properties: {
          success: {
            $ref: "#/components/schemas/successResponseTrue",
          },
          message: {
            type: "string",
            example: "User updated successfully",
          },
          data: {
            $ref: "#/components/schemas/dataResponseObject",
          },
          error: {
            $ref: "#/components/schemas/errorResponseNull",
          },
        },
      },
      responseUpdateMyInfoSuccess: {
        type: "object",
        properties: {
          success: {
            $ref: "#/components/schemas/successResponseTrue",
          },
          message: {
            type: "string",
            example: "Your information has been updated successfully",
          },
          data: {
            $ref: "#/components/schemas/dataResponseObject",
          },
          error: {
            $ref: "#/components/schemas/errorResponseNull",
          },
        },
      },

      responseGetAllAddress: {
        type: "object",
        properties: {
          success: {
            $ref: "#/components/schemas/successResponseTrue",
          },
          message: {
            type: "string",
            example: "Show all addresses successfully",
          },
          data: {
            $ref: "#/components/schemas/dataResponseAddressArray",
          },
          error: {
            $ref: "#/components/schemas/errorResponseNull",
          },
        },
      },
      responseGetAddressById: {
        type: "object",
        properties: {
          success: {
            $ref: "#/components/schemas/successResponseTrue",
          },
          message: {
            type: "string",
            example: "Show addresses successfully",
          },
          data: {
            $ref: "#/components/schemas/dataResponseAddressObject",
          },
          error: {
            $ref: "#/components/schemas/errorResponseNull",
          },
        },
      },
      responseCreateAddressSuccess: {
        type: "object",
        properties: {
          success: {
            $ref: "#/components/schemas/successResponseTrue",
          },
          message: {
            type: "string",
            example: "Created address successfully",
          },
          data: {
            $ref: "#/components/schemas/dataResponseObject",
          },
          error: {
            $ref: "#/components/schemas/errorResponseNull",
          },
        },
      },
      responseUpdateAddressSuccess: {
        type: "object",
        properties: {
          success: {
            $ref: "#/components/schemas/successResponseTrue",
          },
          message: {
            type: "string",
            example: "Address updated successfully",
          },
          data: {
            $ref: "#/components/schemas/dataResponseAddressObject",
          },
          error: {
            $ref: "#/components/schemas/errorResponseNull",
          },
        },
      },
      responseDeleteAddressSuccess: {
        type: "object",
        properties: {
          success: {
            $ref: "#/components/schemas/successResponseTrue",
          },
          message: {
            type: "string",
            example: "Address deleted successfully",
          },
          data: {
            $ref: "#/components/schemas/dataResponseNull",
          },
          error: {
            $ref: "#/components/schemas/errorResponseNull",
          },
        },
      },
      errorCreateAddress: {
        type: "object",
        properties: {
          success: {
            $ref: "#/components/schemas/successResponseFalse",
          },
          message: {
            type: "string",
            example: "Address creation failed",
          },
          data: {
            $ref: "#/components/schemas/dataResponseObject",
          },
          error: {
            type: "string",
            example: "Address creation failed",
          },
        },
      },
      responseRegister: {
        type: "object",
        properties: {
          success: {
            $ref: "#/components/schemas/successResponse",
          },
          message: {
            $ref: "#/components/schemas/messageResponse",
          },
          data: {
            $ref: "#/components/schemas/dataResponse",
          },
          error: {
            $ref: "#/components/schemas/errorResponse",
          },
        },
      },

      paramsIdFind: {
        type: "string",
        format: "uuid",
        description: "Nhập Id muốn tìm kiếm",
      },
      paramsIdDelete: {
        type: "string",
        format: "uuid",
        description: "Nhập Id muốn xóa",
      },
      userNotFound: {
        type: "object",
        properties: {
          success: {
            $ref: "#/components/schemas/successResponseFalse",
          },
          message: {
            type: "string",
            example: "User not found",
          },
          data: {
            $ref: "#/components/schemas/dataResponseNull",
          },
          error: {
            type: "string",
            example: "User not found in the database",
          },
        },
      },
      addressNotFound: {
        type: "object",
        properties: {
          success: {
            $ref: "#/components/schemas/successResponseFalse",
          },
          message: {
            type: "string",
            example: "Address not found",
          },
          data: {
            $ref: "#/components/schemas/dataResponseNull",
          },
          error: {
            type: "string",
            example: "Address not found in the database",
          },
        },
      },
      refreshKeyNotInCookie: {
        type: "object",
        properties: {
          success: {
            $ref: "#/components/schemas/successResponseFalse",
          },
          message: {
            type: "string",
            example: "You are not authenticated",
          },
          data: {
            $ref: "#/components/schemas/dataResponseNull",
          },
          error: {
            type: "string",
            example: "RefreshKey is not in cookie",
          },
        },
      },
      refreshKeyNotInDB: {
        type: "object",
        properties: {
          success: {
            $ref: "#/components/schemas/successResponseFalse",
          },
          message: {
            type: "string",
            example: "Refresh token is not valid",
          },
          data: {
            $ref: "#/components/schemas/dataResponseNull",
          },
          error: {
            type: "string",
            example: "RefreshKey not in the database",
          },
        },
      },
      emailOrPasswordFalse: {
        type: "object",
        properties: {
          success: {
            $ref: "#/components/schemas/successResponseFalse",
          },
          message: {
            type: "string",
            example: "Invalid email or password.",
          },
          data: {
            $ref: "#/components/schemas/dataResponseNull",
          },
          error: {
            type: "string",
            example: "Authentication failed: Invalid email or password.",
          },
        },
      },
      missingRequireFields: {
        type: "object",
        properties: {
          success: {
            $ref: "#/components/schemas/successResponseFalse",
          },
          message: {
            type: "string",
            example: "Missing required fields",
          },
          data: {
            $ref: "#/components/schemas/dataResponseNull",
          },
          error: {
            type: "string",
            example: "Missing required fields: 'details field'",
          },
        },
      },
      userIdIsRequired: {
        type: "object",
        properties: {
          success: {
            $ref: "#/components/schemas/successResponseFalse",
          },
          message: {
            type: "string",
            example: "User not authenticated",
          },
          data: {
            $ref: "#/components/schemas/dataResponseNull",
          },
          error: {
            type: "string",
            example: "User ID is required.",
          },
        },
      },
      formatIdUser: {
        type: "object",
        properties: {
          success: {
            $ref: "#/components/schemas/successResponseFalse",
          },
          message: {
            type: "string",
            example: "Invalid user ID format",
          },
          data: {
            $ref: "#/components/schemas/dataResponseNull",
          },
          error: {
            type: "string",
            example: "Invalid user ID format: uuid",
          },
        },
      },
      mailExists: {
        type: "object",
        properties: {
          success: {
            $ref: "#/components/schemas/successResponseFalse",
          },
          message: {
            type: "string",
            example: "Email already exists.",
          },
          data: {
            $ref: "#/components/schemas/dataResponseNull",
          },
          error: {
            type: "string",
            example: "This email is already associated with another account.",
          },
        },
      },
      internalServerErrorResponse: {
        type: "object",
        properties: {
          success: {
            $ref: "#/components/schemas/successResponseFalse",
          },
          message: {
            $ref: "#/components/schemas/messageResponseError",
          },
          data: {
            $ref: "#/components/schemas/dataResponseNull",
          },
          error: {
            $ref: "#/components/schemas/errorResponseServer",
          },
        },
      },
      passwordRegexError: {
        type: "object",
        properties: {
          success: {
            $ref: "#/components/schemas/successResponseFalse",
          },
          message: {
            type: "string",
            example: "Password does not meet the requirements.",
          },
          data: {
            $ref: "#/components/schemas/dataResponseNull",
          },
          error: {
            type: "string",
            example:
              "Password must be between 12 to 23 characters long and include at least one uppercase letter, one lowercase letter, one digit, and one special character.",
          },
        },
      },

      fieldUpdateAndCreateUserAdmin: {
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
      fieldUpdateMyInfo: {
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
        },
        required: ["email", "firstName", "lastName", "password"],
      },
      fieldUpdateAndCreateAddress: {
        type: "object",
        properties: {
          firstName: {
            type: "string",
            example: "Admin",
          },
          lastName: {
            type: "string",
            example: "Admin",
          },
          phoneNumber: {
            type: "string",
            example: "0975515940",
          },
          province: {
            type: "string",
            example: "Hồ Chí Minh",
          },
          district: {
            type: "string",
            example: "Gò Vấp",
          },
          ward: {
            type: "string",
            example: "Phường 12",
          },
          address: {
            type: "string",
            example: "230/20/1 Phan Huy Ích",
          },
        },
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
