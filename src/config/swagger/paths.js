// paths.js
module.exports = {
  "/api/auth/register": {
    post: {
      summary: "Đăng ký tài khoản",
      description: "Đăng ký tài khoản của người dùng",
      tags: ["Auth"],
      operationId: "register",
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
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
          },
        },
      },
      responses: {
        201: {
          description: "Đăng ký tài khoản thành công",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  success: {
                    type: "boolean",
                    example: "true",
                  },
                  message: {
                    type: "string",
                    example: "Registered account successfully",
                  },
                },
              },
            },
          },
        },
        401: {
          description: "Thiếu các trường bắt buộc",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/MissingRequireFields",
              },
            },
          },
        },
        400: {
          description: "Mật khẩu không đúng định dạng",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  success: {
                    type: "boolean",
                    example: "false,",
                  },
                  message: {
                    type: "string",
                    example: "Password does not meet the requirements.",
                  },
                },
              },
            },
          },
        },
        409: {
          description: "Email đăng ký đã tồn tại",
          content: {
            "application/json": {
              schema: {
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
            },
          },
        },
        500: {
          description: "Lỗi server",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/InternalServerErrorResponse",
              },
            },
          },
        },
      },
    },
  },
  "/api/auth/login": {
    post: {
      summary: "Đăng nhập",
      description: "Đăng nhập để có quyền",
      tags: ["Auth"],
      operationId: "login",
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              type: "object",
              properties: {
                email: {
                  type: "string",
                  format: "email",
                  example: "admin@gmail.com",
                },
                password: {
                  type: "string",
                  example: "Admin@12345678",
                },
              },
              required: ["email", "password"],
            },
          },
        },
      },
      responses: {
        200: {
          description: "Đăng nhập thành công",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  message: {
                    type: "string",
                    example: "Login Successfully",
                  },
                  accessToken: {
                    type: "string",
                    example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9",
                  },
                },
              },
            },
          },
        },
        400: {
          description: "Email hoặc mật khẩu không hợp lệ",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  success: {
                    type: "boolean",
                    example: "false",
                  },
                  message: {
                    type: "string",
                    example: "Invalid email or password",
                  },
                },
              },
            },
          },
        },
        401: {
          description: "Thiếu các trường bắt buộc",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/MissingRequireFields",
              },
            },
          },
        },
        500: {
          description: "Lỗi server",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/InternalServerErrorResponse",
              },
            },
          },
        },
      },
    },
  },
  "/api/auth/refresh": {
    post: {
      summary: "Refresh",
      description:
        "Refresh khi access token hết hạn để lấy access token và refresh token mới",
      tags: ["Auth"],
      security: [
        {
          CookieAuth: [],
        },
      ],
      responses: {
        200: {
          description: "Refresh token thành công",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  newAccessToken: {
                    type: "string",
                    example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9",
                  },
                },
              },
            },
          },
        },
        401: {
          description: "Không có refresh token",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  success: {
                    type: "boolean",
                    example: "false",
                  },
                  message: {
                    type: "string",
                    example: "You are not authenticated",
                  },
                },
              },
            },
          },
        },
        401: {
          description: "Refresh token không tồn tại trong database",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  success: {
                    type: "boolean",
                    example: "false",
                  },
                  message: {
                    type: "string",
                    example: "Refresh token is not valid",
                  },
                },
              },
            },
          },
        },
        500: {
          description: "Lỗi server",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/InternalServerErrorResponse",
              },
            },
          },
        },
      },
    },
  },
  "/api/auth/logout": {
    post: {
      summary: "Đăng xuất",
      description: "Đăng xuất tài khoản khỏi server",
      tags: ["Auth"],
      responses: {
        200: {
          description: "Đăng xuất thành công",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  success: {
                    type: "boolean",
                    example: "true",
                  },
                  message: {
                    type: "string",
                    example: "Logout Successfully",
                  },
                },
              },
            },
          },
        },
        401: {
          description: "Không có refresh token",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  success: {
                    type: "boolean",
                    example: "false",
                  },
                  message: {
                    type: "string",
                    example: "No refresh token found",
                  },
                },
              },
            },
          },
        },
        500: {
          description: "Lỗi server",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/InternalServerErrorResponse",
              },
            },
          },
        },
      },
      security: [
        {
          BearerAuth: [],
        },
      ],
    },
  },

  "/api/users": {
    get: {
      summary: "Hiển thị tất cả thông tin tài khoản",
      description: "Hiển thị tât cả thông tin tài khoản",
      tags: ["User"],
      operationId: "getAllUsers",
      security: [
        {
          BearerAuth: [],
        },
      ],
      responses: {
        200: {
          description: "Hiển thị tất cả thông tin tài khoản thành công",
          content: {
            "application/json": {
              schema: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    userId: {
                      type: "string",
                      format: "uuid",
                      example: "702dfc32-c51f-4458-b26d-0bd7d34f6cb7",
                    },
                    firstName: {
                      type: "string",
                      example: "admin",
                    },
                    lastName: {
                      type: "string",
                      example: "admin",
                    },
                    email: {
                      type: "string",
                      example: "admin@gmail.com",
                    },
                    roleName: {
                      type: "string",
                      example: "Admin",
                    },
                    createdAt: {
                      type: "string",
                      example: "2024-10-02T12:39:02.001Z",
                    },
                    updatedAt: {
                      type: "string",
                      format: "data-time",
                      example: "2024-10-02T12:39:02.001Z",
                    },
                  },
                },
              },
            },
          },
        },
        404: {
          description: "Người dùng không tồn tại",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  success: {
                    type: "boolean",
                    example: "false",
                  },
                  message: {
                    type: "string",
                    example: "User not found",
                  },
                },
              },
            },
          },
        },
        500: {
          description: "Lỗi server",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/InternalServerErrorResponse",
              },
            },
          },
        },
      },
    },
  },
  "/api/users/{id}": {
    get: {
      summary: "Tìm kiếm tài khoản",
      description: "Tìm kiếm tài khoản bằng id",
      tags: ["User"],
      operationId: "getUserById",
      security: [
        {
          BearerAuth: [],
        },
      ],
      parameters: [
        {
          name: "id",
          in: "path",
          require: "true",
          schema: {
            type: "string",
            format: "uuid",
            decription: "Nhập ID tài khoản muốn tìm kiếm",
          },
        },
      ],
      responses: {
        200: {
          description: "Hiển thị thông tin tài khoản thành công",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  userId: {
                    type: "string",
                    format: "uuid",
                    example: "702dfc32-c51f-4458-b26d-0bd7d34f6cb7",
                  },
                  firstName: {
                    type: "string",
                    example: "admin",
                  },
                  lastName: {
                    type: "string",
                    example: "admin",
                  },
                  email: {
                    type: "string",
                    example: "admin@gmail.com",
                  },
                  roleName: {
                    type: "string",
                    example: "Admin",
                  },
                  createdAt: {
                    type: "string",
                    format: "data-time",
                    example: "2024-10-02T12:39:02.001Z",
                  },
                  updatedAt: {
                    type: "string",
                    example: "2024-10-02T12:39:02.001Z",
                  },
                },
              },
            },
          },
        },
        400: {
          description: "ID người dùng không đúng định dạng",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  success: {
                    type: "boolean",
                    example: "false",
                  },
                  message: {
                    type: "string",
                    example: "Invalid user ID format.",
                  },
                },
              },
            },
          },
        },
        404: {
          description: "ID người dùng không tồn tại",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  success: {
                    type: "boolean",
                    example: "false",
                  },
                  message: {
                    type: "string",
                    example: "User ID does not exist.",
                  },
                },
              },
            },
          },
        },
        500: {
          description: "Lỗi server",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/InternalServerErrorResponse",
              },
            },
          },
        },
      },
    },
  },
  "/api/users/myinfo": {
    get: {
      summary: "Hiển thị thông tin tài khoản",
      description: "Hiển thị thông tin tài khoản",
      tags: ["User"],
      operationId: "getMyInfo",
      security: [
        {
          BearerAuth: [],
        },
      ],
      responses: {
        200: {
          description: "Hiển thị thông tin tài khoản thành công",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  userId: {
                    type: "UUID",
                    example: "702dfc32-c51f-4458-b26d-0bd7d34f6cb7",
                  },
                  firstName: {
                    type: "string",
                    example: "admin",
                  },
                  lastName: {
                    type: "string",
                    example: "admin",
                  },
                  email: {
                    type: "string",
                    example: "admin@gmail.com",
                  },
                  roleName: {
                    type: "string",
                    example: "Admin",
                  },
                  createdAt: {
                    type: "string",
                    format: "data-time",
                    example: "2024-10-02T12:39:02.001Z",
                  },
                  updatedAt: {
                    type: "string",
                    example: "2024-10-02T12:39:02.001Z",
                  },
                },
              },
            },
          },
        },
        404: {
          description: "Người dùng không tồn tại",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  success: {
                    type: "boolean",
                    example: "false",
                  },
                  message: {
                    type: "string",
                    example: "User not found",
                  },
                },
              },
            },
          },
        },
        500: {
          description: "Lỗi server",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/InternalServerErrorResponse",
              },
            },
          },
        },
      },
    },
  },
  "/api/users/create": {
    post: {
      summary: "Tạo tài khoản người dùng",
      description: "Tạo tài khoản của người dùng bằng quyền admin",
      tags: ["User"],
      operationId: "add",
      security: [
        {
          BearerAuth: [],
        },
      ],
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              $ref: "#/components/schemas/FieldUpdateUserAdmin",
            },
          },
        },
      },
      responses: {
        201: {
          description: "Tạo tài khoản thành công",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  success: {
                    type: "boolean",
                    example: "true",
                  },
                  message: {
                    type: "string",
                    example: "Created user successfully",
                  },
                  userId: {
                    type: "string",
                    format: "uuid",
                    example: "702dfc32-c51f-4458-b26d-0bd7d34f6cb7",
                  },
                  firstName: {
                    type: "string",
                    example: "admin",
                  },
                  lastName: {
                    type: "string",
                    example: "admin",
                  },
                  email: {
                    type: "string",
                    example: "admin@gmail.com",
                  },
                  roleName: {
                    type: "string",
                    example: "Admin",
                  },
                  createdAt: {
                    type: "string",
                    format: "data-time",
                    example: "2024-10-02T12:39:02.001Z",
                  },
                  updatedAt: {
                    type: "string",
                    example: "2024-10-02T12:39:02.001Z",
                  },
                },
              },
            },
          },
        },
        401: {
          description: "Thiếu các trường bắt buộc",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/MissingRequireFields",
              },
            },
          },
        },
        409: {
          description: "Email đăng ký đã tồn tại",
          content: {
            "application/json": {
              schema: {
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
            },
          },
        },
        500: {
          description: "Lỗi server",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/InternalServerErrorResponse",
              },
            },
          },
        },
      },
    },
  },
  "/api/users/delete/{id}": {
    get: {
      summary: "Xóa tài khoản",
      description: "Xóa tài khoản bằng id",
      tags: ["User"],
      operationId: "deleteUser",
      security: [
        {
          BearerAuth: [],
        },
      ],
      parameters: [
        {
          name: "id",
          in: "path",
          require: "true",
          schema: {
            type: "string",
            format: "uuid",
            decription: "Nhập ID tài khoản muốn xóa",
          },
        },
      ],
      responses: {
        200: {
          description: "Xóa tài khoản thành công",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  success: {
                    type: "boolean",
                    example: "true",
                  },
                  message: {
                    type: "string",
                    example: "User deleted successfully",
                  },
                },
              },
            },
          },
        },
        400: {
          description: "Thiếu trường id",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  success: {
                    type: "boolean",
                    example: "false",
                  },
                  message: {
                    type: "string",
                    example: "Missing required fields: id",
                  },
                },
              },
            },
          },
        },
        400: {
          description: "ID người dùng không đúng định dạng",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  success: {
                    type: "boolean",
                    example: "false",
                  },
                  message: {
                    type: "string",
                    example: "Invalid user ID format.",
                  },
                },
              },
            },
          },
        },
        404: {
          description: "ID người dùng không tồn tại",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  success: {
                    type: "boolean",
                    example: "false",
                  },
                  message: {
                    type: "string",
                    example: "User ID does not exist.",
                  },
                },
              },
            },
          },
        },
        500: {
          description: "Lỗi server",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/InternalServerErrorResponse",
              },
            },
          },
        },
      },
    },
  },
  "/api/users/delete/myuser": {
    get: {
      summary: "Xóa tài khoản của tôi",
      description: "Xóa tài khoản của tôi",
      tags: ["User"],
      operationId: "deleteMyUser",
      security: [
        {
          BearerAuth: [],
        },
      ],
      responses: {
        200: {
          description: "Xóa tài khoản thành công",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  success: {
                    type: "boolean",
                    example: "true",
                  },
                  message: {
                    type: "string",
                    example: "Your account has been deleted successfully",
                  },
                },
              },
            },
          },
        },
        404: {
          description: "Người dùng không tồn tại",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  success: {
                    type: "boolean",
                    example: "false",
                  },
                  message: {
                    type: "string",
                    example: "User not found",
                  },
                },
              },
            },
          },
        },
        500: {
          description: "Lỗi server",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/InternalServerErrorResponse",
              },
            },
          },
        },
      },
    },
  },
  "/api/users/update/{id}": {
    put: {
      summary: "Cập nhật tài khoản",
      description: "Cập nhật tài khoản bằng id",
      tags: ["User"],
      operationId: "updataUserByAdmin",
      security: [
        {
          BearerAuth: [],
        },
      ],
      parameters: [
        {
          name: "id",
          in: "path",
          require: "true",
          schema: {
            type: "string",
            format: "uuid",
            decription: "Nhập ID tài khoản muốn cập nhật",
          },
        },
      ],
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              $ref: "#/components/schemas/FieldUpdateUserAdmin",
            },
          },
        },
      },
      responses: {
        200: {
          description: "Hiển thị thông tin tài khoản đã cập nhật thành công",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  success: {
                    type: "boolean",
                    example: "true",
                  },
                  message: {
                    type: "string",
                    example: "User updated successfully",
                  },
                  userId: {
                    type: "string",
                    format: "uuid",
                    example: "702dfc32-c51f-4458-b26d-0bd7d34f6cb7",
                  },
                  firstName: {
                    type: "string",
                    example: "admin",
                  },
                  lastName: {
                    type: "string",
                    example: "admin",
                  },
                  email: {
                    type: "string",
                    example: "admin@gmail.com",
                  },
                  roleName: {
                    type: "string",
                    example: "Admin",
                  },
                  createdAt: {
                    type: "string",
                    example: "2024-10-02T12:39:02.001Z",
                  },
                  updatedAt: {
                    type: "string",
                    format: "data-time",
                    example: "2024-10-02T12:39:02.001Z",
                  },
                },
              },
            },
          },
        },
        400: {
          description: "Thiếu trường ID",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  success: {
                    type: "boolean",
                    example: "false",
                  },
                  message: {
                    type: "string",
                    example: "Missing required fields: id",
                  },
                },
              },
            },
          },
        },
        400: {
          description: "ID người dùng không đúng định dạng",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  success: {
                    type: "boolean",
                    example: "false",
                  },
                  message: {
                    type: "string",
                    example: "Invalid user ID format.",
                  },
                },
              },
            },
          },
        },
        401: {
          description: "Thiếu các trường bắt buộc",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/MissingRequireFields",
              },
            },
          },
        },
        404: {
          description: "ID người dùng không tồn tại",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  success: {
                    type: "boolean",
                    example: "false",
                  },
                  message: {
                    type: "string",
                    example: "User does not exist.",
                  },
                },
              },
            },
          },
        },
        400: {
          description: "Mật khẩu không đúng định dạng",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  success: {
                    type: "boolean",
                    example: "false",
                  },
                  message: {
                    type: "string",
                    example: "Password does not meet the requirements.",
                  },
                },
              },
            },
          },
        },
        409: {
          description: "Email đã tồn tại",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/MailExists",
              },
            },
          },
        },
        500: {
          description: "Lỗi server",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/InternalServerErrorResponse",
              },
            },
          },
        },
      },
    },
  },
  "/api/users/update/myinfo": {
    put: {
      summary: "Cập nhật tài khoản của tôi",
      description: "Cập nhật tài khoản của tôi",
      tags: ["User"],
      operationId: "updataMyInfo",
      security: [
        {
          BearerAuth: [],
        },
      ],
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
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
            },
          },
        },
      },
      responses: {
        200: {
          description: "Hiển thị thông tin tài khoản đã cập nhật thành công",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  success: {
                    type: "boolean",
                    example: "true",
                  },
                  message: {
                    type: "string",
                    example: "Your information has been updated successfully",
                  },
                  userId: {
                    type: "string",
                    format: "uuid",
                    example: "702dfc32-c51f-4458-b26d-0bd7d34f6cb7",
                  },
                  email: {
                    type: "string",
                    example: "admin@gmail.com",
                  },
                  firstName: {
                    type: "string",
                    example: "admin",
                  },
                  lastName: {
                    type: "string",
                    example: "admin",
                  },
                  createdAt: {
                    type: "string",
                    example: "2024-10-02T12:39:02.001Z",
                  },
                  updatedAt: {
                    type: "string",
                    format: "data-time",
                    example: "2024-10-02T12:39:02.001Z",
                  },
                },
              },
            },
          },
        },
        400: {
          description: "Thiếu trường ID",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  success: {
                    type: "boolean",
                    example: "false",
                  },
                  message: {
                    type: "string",
                    example: "Missing required fields: id",
                  },
                },
              },
            },
          },
        },
        400: {
          description: "ID người dùng không đúng định dạng",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  success: {
                    type: "boolean",
                    example: "false",
                  },
                  message: {
                    type: "string",
                    example: "Invalid user ID format.",
                  },
                },
              },
            },
          },
        },
        401: {
          description: "Thiếu các trường bắt buộc",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/MissingRequireFields",
              },
            },
          },
        },
        404: {
          description: "ID người dùng không tồn tại",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  success: {
                    type: "boolean",
                    example: "false",
                  },
                  message: {
                    type: "string",
                    example: "User does not exist.",
                  },
                },
              },
            },
          },
        },
        400: {
          description: "Mật khẩu không đúng định dạng",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  success: {
                    type: "boolean",
                    example: "false",
                  },
                  message: {
                    type: "string",
                    example: "Password does not meet the requirements.",
                  },
                },
              },
            },
          },
        },
        409: {
          description: "Email đã tồn tại",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/MailExists",
              },
            },
          },
        },
        500: {
          description: "Lỗi server",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/InternalServerErrorResponse",
              },
            },
          },
        },
      },
    },
  },

  "/api/address": {
    get: {
      summary: "Hiển thị tất cả địa chỉ",
      description: "Hiển thị tất cả địa chỉ của tài khoản",
      tags: ["Address"],
      operationId: "address",
      security: [
        {
          BearerAuth: [],
        },
      ],
      response: {
        200: {
          description: "Hiển thị tất cả thông tin tài khoản thành công",
          content: {
            "application/json": {
              schema: {
                type: "array",
                items: {
                  type: "object",
                  properties: {},
                },
              },
            },
          },
        },
      },
    },
  },
};
