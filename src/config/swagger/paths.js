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
              $ref: "#/components/schemas/RegisterUserRequest",
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
                $ref: "#/components/schemas/RegisterUserResponse",
              },
            },
          },
        },
        400: {
          description: "Thiếu các trường bắt buộc",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/MissingFieldsValidate",
              },
            },
          },
        },
        422: {
          description: "Mật khẩu không đúng định dạng",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/PasswordValidate",
              },
            },
          },
        },
        409: {
          description: "Email đăng ký đã tồn tại",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/MailExistsValidate",
              },
            },
          },
        },
        500: {
          description: "Lỗi server",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/ErrorServerResponse",
              },
            },
          },
        },
      },
    },
  },
  "/api/auth/forget-password": {
    post: {
      summary: "Quên mật khẩu",
      description: "Yêu cầu lấy lại mật khẩu",
      tags: ["Auth"],
      operationId: "forget-password",
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              $ref: "#/components/schemas/ForgetPasswordRequest",
            },
          },
        },
      },
      responses: {
        200: {
          description: "Yêu cầu quên mật khẩu đã được gửi thành công",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/ForgetPasswordResponse",
              },
            },
          },
        },
        400: {
          description: "Lỗi yêu cầu không hợp lệ",
          content: {
            "application/json": {
              oneOf: [
                {
                  description: "Thiếu các trường bắt buộc",
                  schema: {
                    $ref: "#/components/schemas/MissingFieldsValidate",
                  },
                },
                {
                  description: "Trường không đúng định dạng",
                  schema: {
                    $ref: "#/components/schemas/IncorrectFormatValidate",
                  },
                },
              ],
              examples: {
                MissingFieldsValidate: {
                  description: "Thiếu các trường bắt buộc",
                  value: {
                    status: 400,
                    error: {
                      errorCode: "MISSING_FIELD",
                      errorMessage:
                        "The field 'FIELD_NAME' is required and cannot be empty",
                    },
                  },
                },
                IncorrectFormatValidate: {
                  description: "Trường không đúng định dạng",
                  value: {
                    status: 400,
                    error: {
                      errorCode: "INCORRECT_FORMAT",
                      errorMessage: "Invalid format for field 'FIELD_NAME'",
                    },
                  },
                },
              },
            },
          },
        },
        404: {
          description: "Email không tồn tại",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/MailNotFoundValidate",
              },
            },
          },
        },
        500: {
          description: "Lỗi server",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/ErrorServerResponse",
              },
            },
          },
        },
      },
    },
  },
  "/api/auth/reset-password/{token}": {
    post: {
      summary: "Đặt lại mật khẩu",
      description: "Đặt lại mật khẩu thông qua token",
      tags: ["Auth"],
      operationId: "reset-password",
      parameters: [
        {
          name: "token",
          in: "path",
          require: "true",
          schema: {
            $ref: "#/components/schemas/TokenParams",
          },
        },
      ],
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              $ref: "#/components/schemas/ResetPasswordRequest",
            },
          },
        },
      },
      responses: {
        200: {
          description: "Bạn đã đổi mật khẩu thành công",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/ResetPasswordResponse",
              },
            },
          },
        },
        400: {
          description: "Thiếu trường bắt buộc",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/MissingFieldsValidate",
              },
            },
          },
        },
        401: {
          description: "Lỗi yêu cầu không hợp lệ",
          content: {
            "application/json": {
              oneOf: [
                {
                  description: "Token đang nằm trong Black List",
                  schema: {
                    $ref: "#/components/schemas/TokenBlackListVerify",
                  },
                },
                {
                  description: "Token đã hết hạn sử dụng",
                  schema: {
                    $ref: "#/components/schemas/TokenExpiredVerify",
                  },
                },
              ],
              examples: {
                TokenBlackListVerify: {
                  description: "Token đang nằm trong BLack List",
                  value: {
                    status: 401,
                    error: {
                      errorCode: "TOKEN_IN_BLACKLIST",
                      errorMessage: "Token in the backlist",
                    },
                  },
                },
                TokenExpiredVerify: {
                  description: "Token đã hết hạn sử dụng",
                  value: {
                    status: 401,
                    error: {
                      errorCode: "TOKEN_EXPIRED",
                      errorMessage: "Token has expired",
                    },
                  },
                },
              },
            },
          },
        },
        422: {
          description: "Mật khẩu không đúng định dạng",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/PasswordValidate",
              },
            },
          },
        },
        500: {
          description: "Lỗi server",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/ErrorServerResponse",
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
              $ref: "#/components/schemas/LoginRequest",
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
                $ref: "#/components/schemas/LoginResponse",
              },
            },
          },
        },
        400: {
          description: "Thiếu các trường bắt buộc",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/MissingFieldsValidate",
              },
            },
          },
        },
        401: {
          description: "Email hoặc mật khẩu không hợp lệ",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/LoginCheck",
              },
            },
          },
        },
        500: {
          description: "Lỗi server",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/ErrorServerResponse",
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
      responses: {
        200: {
          description: "Refresh token thành công",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/RefreshResponse",
              },
            },
          },
        },
        401: {
          description: "Lỗi yêu cầu không hợp lệ",
          content: {
            "application/json": {
              oneOf: [
                {
                  description: "Token không tồn tại trong Cookie",
                  schema: {
                    $ref: "#/components/schemas/TokenNotFoundCookieVerify",
                  },
                },
                {
                  description: "Token không tồn tại trong database",
                  schema: {
                    $ref: "#/components/schemas/TokenNotFoundInDBVerify",
                  },
                },
                {
                  description: "Token không hợp lệ",
                  schema: {
                    $ref: "#/components/schemas/TokenInvalidVerify",
                  },
                },
              ],
              examples: {
                TokenNotFoundCookieVerify: {
                  description: "Token không tồn tại trong Cookie",
                  value: {
                    status: 401,
                    error: {
                      errorCode: "TOKEN_NOT_FOUND",
                      errorMessage: "Token not found in the cookie",
                    },
                  },
                },
                TokenNotFoundInDBVerify: {
                  description: "Token không tồn tại trong database",
                  value: {
                    status: 401,
                    error: {
                      errorCode: "TOKEN_NOT_FOUND",
                      errorMessage: "Token not found in the database",
                    },
                  },
                },
                TokenInvalidVerify: {
                  description: "Token không hợp lệ",
                  value: {
                    status: 401,
                    error: {
                      errorCode: "TOKEN_INVALID",
                      errorMessage: "You are not authenticated",
                    },
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
                $ref: "#/components/schemas/ErrorServerResponse",
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
                $ref: "#/components/schemas/LogoutResponse",
              },
            },
          },
        },
        401: {
          description: "Token không có trong cookie",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/TokenNotFoundCookieVerify",
              },
            },
          },
        },
        500: {
          description: "Lỗi server",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/ErrorServerResponse",
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

  "/api/role": {
    get: {
      summary: "Hiển thị tất cả vai trò",
      description: "Hiển thị tât cả vai trò",
      tags: ["Role"],
      operationId: "getAllRoles",
      security: [
        {
          BearerAuth: [],
        },
      ],
      responses: {
        200: {
          description: "Hiển thị tất cả các vai trò",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/GetAllRolesResponse",
              },
            },
          },
        },
        401: {
          description: "Lỗi yêu cầu không hợp lệ",
          content: {
            "application/json": {
              oneOf: [
                {
                  description: "Token đang nằm trong Black List",
                  schema: {
                    $ref: "#/components/schemas/TokenBlackListVerify",
                  },
                },
                {
                  description: "Token hết hạn",
                  schema: {
                    $ref: "#/components/schemas/TokenExpiredVerify",
                  },
                },
                {
                  description: "Token không hợp lệ",
                  schema: {
                    $ref: "#/components/schemas/TokenInvalidVerify",
                  },
                },
              ],
              examples: {
                TokenBlackListVerify: {
                  description: "Token đang nằm trong Black List",
                  value: {
                    status: 401,
                    error: {
                      errorCode: "TOKEN_IN_BLACKLIST",
                      errorMessage: "Token in the backlist",
                    },
                  },
                },
                TokenExpiredVerify: {
                  description: "Token hết hạn",
                  value: {
                    status: 401,
                    error: {
                      errorCode: "TOKEN_EXPIRED",
                      errorMessage: "Token has expired",
                    },
                  },
                },
                TokenInvalidVerify: {
                  description: "Token không hợp lệ",
                  value: {
                    status: 401,
                    error: {
                      errorCode: "TOKEN_INVALID",
                      errorMessage: "You are not authenticated",
                    },
                  },
                },
              },
            },
          },
        },
        404: {
          description: "Không có vai trò trong database",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/RoleNotFound",
              },
            },
          },
        },
        500: {
          description: "Lỗi server",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/ErrorServerResponse",
              },
            },
          },
        },
      },
    },
  },
  "/api/role/{id}": {
    get: {
      summary: "Tìm kiếm vai trò bằng ID",
      description: "Tìm kiếm vai trò bằng ID",
      tags: ["Role"],
      operationId: "getRoleById",
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
            $ref: "#/components/schemas/IdParams",
          },
        },
      ],
      responses: {
        200: {
          description: "Hiển thị vai trò đã tìm kiếm",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/GetRoleByIdResponse",
              },
            },
          },
        },
        401: {
          description: "Lỗi yêu cầu không hợp lệ",
          content: {
            "application/json": {
              oneOf: [
                {
                  description: "Token đang nằm trong Black List",
                  schema: {
                    $ref: "#/components/schemas/TokenBlackListVerify",
                  },
                },
                {
                  description: "Token hết hạn",
                  schema: {
                    $ref: "#/components/schemas/TokenExpiredVerify",
                  },
                },
                {
                  description: "Token không hợp lệ",
                  schema: {
                    $ref: "#/components/schemas/TokenInvalidVerify",
                  },
                },
              ],
              examples: {
                TokenBlackListVerify: {
                  description: "Token đang nằm trong Black List",
                  value: {
                    status: 401,
                    error: {
                      errorCode: "TOKEN_IN_BLACKLIST",
                      errorMessage: "Token in the backlist",
                    },
                  },
                },
                TokenExpiredVerify: {
                  description: "Token hết hạn",
                  value: {
                    status: 401,
                    error: {
                      errorCode: "TOKEN_EXPIRED",
                      errorMessage: "Token has expired",
                    },
                  },
                },
                TokenInvalidVerify: {
                  description: "Token không hợp lệ",
                  value: {
                    status: 401,
                    error: {
                      errorCode: "TOKEN_INVALID",
                      errorMessage: "You are not authenticated",
                    },
                  },
                },
              },
            },
          },
        },
        404: {
          description: "Không có vai trò trong database",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/RoleNotFound",
              },
            },
          },
        },
        500: {
          description: "Lỗi server",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/ErrorServerResponse",
              },
            },
          },
        },
      },
    },
  },
  "/api/role/create": {
    post: {
      summary: "Tạo vai trò",
      description: "Tạo vai trò",
      tags: ["Role"],
      operationId: "createRole",
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
              $ref: "#/components/schemas/CreateOrUpdateRoleRequest",
            },
          },
        },
      },
      responses: {
        201: {
          description: "Tạo vai trò mới thành công",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/CreateOrUpdateRoleResponse",
              },
            },
          },
        },
        400: {
          description: "Thiếu các trường bắt buộc",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/MissingFieldsValidate",
              },
            },
          },
        },
        401: {
          description: "Lỗi yêu cầu không hợp lệ",
          content: {
            "application/json": {
              oneOf: [
                {
                  description: "Token đang nằm trong Black List",
                  schema: {
                    $ref: "#/components/schemas/TokenBlackListVerify",
                  },
                },
                {
                  description: "Token hết hạn",
                  schema: {
                    $ref: "#/components/schemas/TokenExpiredVerify",
                  },
                },
                {
                  description: "Token không hợp lệ",
                  schema: {
                    $ref: "#/components/schemas/TokenInvalidVerify",
                  },
                },
              ],
              examples: {
                TokenBlackListVerify: {
                  description: "Token đang nằm trong Black List",
                  value: {
                    status: 401,
                    error: {
                      errorCode: "TOKEN_IN_BLACKLIST",
                      errorMessage: "Token in the backlist",
                    },
                  },
                },
                TokenExpiredVerify: {
                  description: "Token hết hạn",
                  value: {
                    status: 401,
                    error: {
                      errorCode: "TOKEN_EXPIRED",
                      errorMessage: "Token has expired",
                    },
                  },
                },
                TokenInvalidVerify: {
                  description: "Token không hợp lệ",
                  value: {
                    status: 401,
                    error: {
                      errorCode: "TOKEN_INVALID",
                      errorMessage: "You are not authenticated",
                    },
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
                $ref: "#/components/schemas/ErrorServerResponse",
              },
            },
          },
        },
      },
    },
  },
  "/api/role/update/{id}": {
    put: {
      summary: "Cập nhật vai trò",
      description: "Cập nhật vai trò thông qua ID",
      tags: ["Role"],
      operationId: "updataRole",
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
            $ref: "#/components/schemas/IdParams",
          },
        },
      ],
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              $ref: "#/components/schemas/CreateOrUpdateRoleRequest",
            },
          },
        },
      },
      responses: {
        200: {
          description: "Hiển thị thông tin vai trò đã cập nhật thành công",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/CreateOrUpdateRoleResponse",
              },
            },
          },
        },
        400: {
          description: "Thiếu các trường bắt buộc",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/MissingFieldsValidate",
              },
            },
          },
        },
        401: {
          description: "Lỗi yêu cầu không hợp lệ",
          content: {
            "application/json": {
              oneOf: [
                {
                  description: "Token đang nằm trong Black List",
                  schema: {
                    $ref: "#/components/schemas/TokenBlackListVerify",
                  },
                },
                {
                  description: "Token hết hạn",
                  schema: {
                    $ref: "#/components/schemas/TokenExpiredVerify",
                  },
                },
                {
                  description: "Token không hợp lệ",
                  schema: {
                    $ref: "#/components/schemas/TokenInvalidVerify",
                  },
                },
              ],
              examples: {
                TokenBlackListVerify: {
                  description: "Token đang nằm trong Black List",
                  value: {
                    status: 401,
                    error: {
                      errorCode: "TOKEN_IN_BLACKLIST",
                      errorMessage: "Token in the backlist",
                    },
                  },
                },
                TokenExpiredVerify: {
                  description: "Token hết hạn",
                  value: {
                    status: 401,
                    error: {
                      errorCode: "TOKEN_EXPIRED",
                      errorMessage: "Token has expired",
                    },
                  },
                },
                TokenInvalidVerify: {
                  description: "Token không hợp lệ",
                  value: {
                    status: 401,
                    error: {
                      errorCode: "TOKEN_INVALID",
                      errorMessage: "You are not authenticated",
                    },
                  },
                },
              },
            },
          },
        },
        404: {
          description: "Vai trò không tồn tại",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/RoleNotFound",
              },
            },
          },
        },
        500: {
          description: "Lỗi server",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/ErrorServerResponse",
              },
            },
          },
        },
      },
    },
  },
  "/api/role/delete/{id}": {
    delete: {
      summary: "Xóa vai trò bằng ID",
      description: "Xóa vai trò bằng ID",
      tags: ["Role"],
      operationId: "deleteRoleById",
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
            $ref: "#/components/schemas/IdParams",
          },
        },
      ],
      responses: {
        200: {
          description: "Thông báo đã xóa vai trò thành công",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/DeleteRoleResponse",
              },
            },
          },
        },
        401: {
          description: "Lỗi yêu cầu không hợp lệ",
          content: {
            "application/json": {
              oneOf: [
                {
                  description: "Token đang nằm trong Black List",
                  schema: {
                    $ref: "#/components/schemas/TokenBlackListVerify",
                  },
                },
                {
                  description: "Token hết hạn",
                  schema: {
                    $ref: "#/components/schemas/TokenExpiredVerify",
                  },
                },
                {
                  description: "Token không hợp lệ",
                  schema: {
                    $ref: "#/components/schemas/TokenInvalidVerify",
                  },
                },
              ],
              examples: {
                TokenBlackListVerify: {
                  description: "Token đang nằm trong Black List",
                  value: {
                    status: 401,
                    error: {
                      errorCode: "TOKEN_IN_BLACKLIST",
                      errorMessage: "Token in the backlist",
                    },
                  },
                },
                TokenExpiredVerify: {
                  description: "Token hết hạn",
                  value: {
                    status: 401,
                    error: {
                      errorCode: "TOKEN_EXPIRED",
                      errorMessage: "Token has expired",
                    },
                  },
                },
                TokenInvalidVerify: {
                  description: "Token không hợp lệ",
                  value: {
                    status: 401,
                    error: {
                      errorCode: "TOKEN_INVALID",
                      errorMessage: "You are not authenticated",
                    },
                  },
                },
              },
            },
          },
        },
        404: {
          description: "Không có vai trò trong database",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/RoleNotFound",
              },
            },
          },
        },
        500: {
          description: "Lỗi server",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/ErrorServerResponse",
              },
            },
          },
        },
      },
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
                $ref: "#/components/schemas/GetAllUserResponse",
              },
            },
          },
        },
        401: {
          description: "Lỗi yêu cầu không hợp lệ",
          content: {
            "application/json": {
              oneOf: [
                {
                  description: "Token đang nằm trong Black List",
                  schema: {
                    $ref: "#/components/schemas/TokenBlackListVerify",
                  },
                },
                {
                  description: "Token hết hạn",
                  schema: {
                    $ref: "#/components/schemas/TokenExpiredVerify",
                  },
                },
                {
                  description: "Token không hợp lệ",
                  schema: {
                    $ref: "#/components/schemas/TokenInvalidVerify",
                  },
                },
              ],
              examples: {
                TokenBlackListVerify: {
                  description: "Token đang nằm trong Black List",
                  value: {
                    status: 401,
                    error: {
                      errorCode: "TOKEN_IN_BLACKLIST",
                      errorMessage: "Token in the backlist",
                    },
                  },
                },
                TokenExpiredVerify: {
                  description: "Token hết hạn",
                  value: {
                    status: 401,
                    error: {
                      errorCode: "TOKEN_EXPIRED",
                      errorMessage: "Token has expired",
                    },
                  },
                },
                TokenInvalidVerify: {
                  description: "Token không hợp lệ",
                  value: {
                    status: 401,
                    error: {
                      errorCode: "TOKEN_INVALID",
                      errorMessage: "You are not authenticated",
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
                $ref: "#/components/schemas/UserNotFound",
              },
            },
          },
        },
        500: {
          description: "Lỗi server",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/ErrorServerResponse",
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
            $ref: "#/components/schemas/uuidParams",
          },
        },
      ],
      responses: {
        200: {
          description: "Hiển thị thông tin tài khoản thành công",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/GetUserByIdResponse",
              },
            },
          },
        },
        400: {
          description: "Params ID người dùng không đúng định dạng",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/ParamsValidate",
              },
            },
          },
        },
        401: {
          description: "Lỗi yêu cầu không hợp lệ",
          content: {
            "application/json": {
              oneOf: [
                {
                  description: "Token đang nằm trong Black List",
                  schema: {
                    $ref: "#/components/schemas/TokenBlackListVerify",
                  },
                },
                {
                  description: "Token hết hạn",
                  schema: {
                    $ref: "#/components/schemas/TokenExpiredVerify",
                  },
                },
                {
                  description: "Token không hợp lệ",
                  schema: {
                    $ref: "#/components/schemas/TokenInvalidVerify",
                  },
                },
              ],
              examples: {
                TokenBlackListVerify: {
                  description: "Token đang nằm trong Black List",
                  value: {
                    status: 401,
                    error: {
                      errorCode: "TOKEN_IN_BLACKLIST",
                      errorMessage: "Token in the backlist",
                    },
                  },
                },
                TokenExpiredVerify: {
                  description: "Token hết hạn",
                  value: {
                    status: 401,
                    error: {
                      errorCode: "TOKEN_EXPIRED",
                      errorMessage: "Token has expired",
                    },
                  },
                },
                TokenInvalidVerify: {
                  description: "Token không hợp lệ",
                  value: {
                    status: 401,
                    error: {
                      errorCode: "TOKEN_INVALID",
                      errorMessage: "You are not authenticated",
                    },
                  },
                },
              },
            },
          },
        },
        404: {
          description: "Không tìm thấy người dùng",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/UserNotFound",
              },
            },
          },
        },
        500: {
          description: "Lỗi server",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/ErrorServerResponse",
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
                $ref: "#/components/schemas/GetMyUserResponse",
              },
            },
          },
        },
        401: {
          description: "Lỗi yêu cầu không hợp lệ",
          content: {
            "application/json": {
              oneOf: [
                {
                  description: "Token đang nằm trong Black List",
                  schema: {
                    $ref: "#/components/schemas/TokenBlackListVerify",
                  },
                },
                {
                  description: "Token hết hạn",
                  schema: {
                    $ref: "#/components/schemas/TokenExpiredVerify",
                  },
                },
                {
                  description: "Token không hợp lệ",
                  schema: {
                    $ref: "#/components/schemas/TokenInvalidVerify",
                  },
                },
              ],
              examples: {
                TokenBlackListVerify: {
                  description: "Token đang nằm trong Black List",
                  value: {
                    status: 401,
                    error: {
                      errorCode: "TOKEN_IN_BLACKLIST",
                      errorMessage: "Token in the backlist",
                    },
                  },
                },
                TokenExpiredVerify: {
                  description: "Token hết hạn",
                  value: {
                    status: 401,
                    error: {
                      errorCode: "TOKEN_EXPIRED",
                      errorMessage: "Token has expired",
                    },
                  },
                },
                TokenInvalidVerify: {
                  description: "Token không hợp lệ",
                  value: {
                    status: 401,
                    error: {
                      errorCode: "TOKEN_INVALID",
                      errorMessage: "You are not authenticated",
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
                $ref: "#/components/schemas/UserNotFound",
              },
            },
          },
        },
        500: {
          description: "Lỗi server",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/ErrorServerResponse",
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
      operationId: "addUser",
      security: [
        {
          BearerAuth: [],
        },
      ],
      requestBody: {
        required: true,
        content: {
          "multipart/form-data": {
            schema: {
              $ref: "#/components/schemas/CreateOrUpdateUserByAdminRequest",
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
                $ref: "#/components/schemas/CreateOrUpdateUserByAdminResponse",
              },
            },
          },
        },
        401: {
          description: "Thiếu các trường bắt buộc",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/MissingFieldsValidate",
              },
            },
          },
        },
        409: {
          description: "Email đăng ký đã tồn tại",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/MailExistsValidate",
              },
            },
          },
        },
        500: {
          description: "Lỗi server",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/ErrorServerResponse",
              },
            },
          },
        },
      },
    },
  },
  "/api/users/delete/{id}": {
    delete: {
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
            $ref: "#/components/schemas/uuidParams",
          },
        },
      ],
      responses: {
        200: {
          description: "Xóa tài khoản thành công",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/DeleteUserResponse",
              },
            },
          },
        },
        400: {
          description: "Params ID người dùng không đúng định dạng",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schema/ParamsValidate",
              },
            },
          },
        },
        401: {
          description: "Lỗi yêu cầu không hợp lệ",
          content: {
            "application/json": {
              oneOf: [
                {
                  description: "Token đang nằm trong Black List",
                  schema: {
                    $ref: "#/components/schemas/TokenBlackListVerify",
                  },
                },
                {
                  description: "Token hết hạn",
                  schema: {
                    $ref: "#/components/schemas/TokenExpiredVerify",
                  },
                },
                {
                  description: "Token không hợp lệ",
                  schema: {
                    $ref: "#/components/schemas/TokenInvalidVerify",
                  },
                },
              ],
              examples: {
                TokenBlackListVerify: {
                  description: "Token đang nằm trong Black List",
                  value: {
                    status: 401,
                    error: {
                      errorCode: "TOKEN_IN_BLACKLIST",
                      errorMessage: "Token in the backlist",
                    },
                  },
                },
                TokenExpiredVerify: {
                  description: "Token hết hạn",
                  value: {
                    status: 401,
                    error: {
                      errorCode: "TOKEN_EXPIRED",
                      errorMessage: "Token has expired",
                    },
                  },
                },
                TokenInvalidVerify: {
                  description: "Token không hợp lệ",
                  value: {
                    status: 401,
                    error: {
                      errorCode: "TOKEN_INVALID",
                      errorMessage: "You are not authenticated",
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
                $ref: "#/components/schema/UserNotFound",
              },
            },
          },
        },
        500: {
          description: "Lỗi server",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/ErrorServerResponse",
              },
            },
          },
        },
      },
    },
  },
  "/api/users/delete/myuser": {
    delete: {
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
                $ref: "#/components/schemas/DeleteMyUserResponse",
              },
            },
          },
        },
        401: {
          description: "Lỗi yêu cầu không hợp lệ",
          content: {
            "application/json": {
              oneOf: [
                {
                  description: "Token đang nằm trong Black List",
                  schema: {
                    $ref: "#/components/schemas/TokenBlackListVerify",
                  },
                },
                {
                  description: "Token hết hạn",
                  schema: {
                    $ref: "#/components/schemas/TokenExpiredVerify",
                  },
                },
                {
                  description: "Token không hợp lệ",
                  schema: {
                    $ref: "#/components/schemas/TokenInvalidVerify",
                  },
                },
              ],
              examples: {
                TokenBlackListVerify: {
                  description: "Token đang nằm trong Black List",
                  value: {
                    status: 401,
                    error: {
                      errorCode: "TOKEN_IN_BLACKLIST",
                      errorMessage: "Token in the backlist",
                    },
                  },
                },
                TokenExpiredVerify: {
                  description: "Token hết hạn",
                  value: {
                    status: 401,
                    error: {
                      errorCode: "TOKEN_EXPIRED",
                      errorMessage: "Token has expired",
                    },
                  },
                },
                TokenInvalidVerify: {
                  description: "Token không hợp lệ",
                  value: {
                    status: 401,
                    error: {
                      errorCode: "TOKEN_INVALID",
                      errorMessage: "You are not authenticated",
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
                $ref: "#/components/schemas/UserNotFound",
              },
            },
          },
        },
        500: {
          description: "Lỗi server",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/ErrorServerResponse",
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
            $ref: "#/components/schemas/uuidParams",
          },
        },
      ],
      requestBody: {
        required: true,
        content: {
          "multipart/form-data": {
            schema: {
              $ref: "#/components/schemas/CreateOrUpdateUserByAdminRequest",
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
                $ref: "#/components/schemas/CreateOrUpdateUserByAdminResponse",
              },
            },
          },
        },
        400: {
          description: "Lỗi yêu cầu không hợp lệ",
          content: {
            "application/json": {
              oneOf: [
                {
                  description: "Params ID người dùng không đúng định dạng",
                  schema: {
                    $ref: "#/components/schemas/ParamsValidate",
                  },
                },
                {
                  description: "Thiếu các trường bắt buộc",
                  schema: {
                    $ref: "#/components/schemas/MissingFieldsValidate",
                  },
                },
              ],
              examples: {
                ParamsValidate: {
                  description: "Params ID người dùng không đúng định dạng",
                  value: {
                    status: 400,
                    error: {
                      errorCode: "PARAMS_INCORRECT_FORMAT",
                      errorMessage: "Invalid params format: 'DATA_TYPE'",
                    },
                  },
                },
                MissingFieldsValidate: {
                  description: "Thiếu các trường bắt buộc",
                  value: {
                    status: 400,
                    error: {
                      errorCode: "MISSING_FIELD",
                      errorMessage:
                        "The field 'FIELD_NAME' is required and cannot be empty",
                    },
                  },
                },
              },
            },
          },
        },
        401: {
          description: "Lỗi yêu cầu không hợp lệ",
          content: {
            "application/json": {
              oneOf: [
                {
                  description: "Token đang nằm trong Black List",
                  schema: {
                    $ref: "#/components/schemas/TokenBlackListVerify",
                  },
                },
                {
                  description: "Token hết hạn",
                  schema: {
                    $ref: "#/components/schemas/TokenExpiredVerify",
                  },
                },
                {
                  description: "Token không hợp lệ",
                  schema: {
                    $ref: "#/components/schemas/TokenInvalidVerify",
                  },
                },
              ],
              examples: {
                TokenBlackListVerify: {
                  description: "Token đang nằm trong Black List",
                  value: {
                    status: 401,
                    error: {
                      errorCode: "TOKEN_IN_BLACKLIST",
                      errorMessage: "Token in the backlist",
                    },
                  },
                },
                TokenExpiredVerify: {
                  description: "Token hết hạn",
                  value: {
                    status: 401,
                    error: {
                      errorCode: "TOKEN_EXPIRED",
                      errorMessage: "Token has expired",
                    },
                  },
                },
                TokenInvalidVerify: {
                  description: "Token không hợp lệ",
                  value: {
                    status: 401,
                    error: {
                      errorCode: "TOKEN_INVALID",
                      errorMessage: "You are not authenticated",
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
                $ref: "#/components/schemas/UserNotFound",
              },
            },
          },
        },
        409: {
          description: "Email đã tồn tại",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/MailExistsValidate",
              },
            },
          },
        },
        422: {
          description: "Mật khẩu không đúng định dạng",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/PasswordValidate",
              },
            },
          },
        },
        500: {
          description: "Lỗi server",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/ErrorServerResponse",
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
        content: {
          "multipart/form-data": {
            schema: {
              $ref: "#/components/schemas/UpdateMyInfoRequest",
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
                $ref: "#/components/schemas/UpdateMyInfoResponse",
              },
            },
          },
        },
        400: {
          description: "Thiêu trường bắt buộc",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/MissingFieldsValidate",
              },
            },
          },
        },
        401: {
          description: "Lỗi yêu cầu không hợp lệ",
          content: {
            "application/json": {
              oneOf: [
                {
                  description: "Token đang nằm trong Black List",
                  schema: {
                    $ref: "#/components/schemas/TokenBlackListVerify",
                  },
                },
                {
                  description: "Token hết hạn",
                  schema: {
                    $ref: "#/components/schemas/TokenExpiredVerify",
                  },
                },
                {
                  description: "Token không hợp lệ",
                  schema: {
                    $ref: "#/components/schemas/TokenInvalidVerify",
                  },
                },
              ],
              examples: {
                TokenBlackListVerify: {
                  description: "Token đang nằm trong Black List",
                  value: {
                    status: 401,
                    error: {
                      errorCode: "TOKEN_IN_BLACKLIST",
                      errorMessage: "Token in the backlist",
                    },
                  },
                },
                TokenExpiredVerify: {
                  description: "Token hết hạn",
                  value: {
                    status: 401,
                    error: {
                      errorCode: "TOKEN_EXPIRED",
                      errorMessage: "Token has expired",
                    },
                  },
                },
                TokenInvalidVerify: {
                  description: "Token không hợp lệ",
                  value: {
                    status: 401,
                    error: {
                      errorCode: "TOKEN_INVALID",
                      errorMessage: "You are not authenticated",
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
                $ref: "#/components/schemas/UserNotFound",
              },
            },
          },
        },
        409: {
          description: "Email đã tồn tại",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/MailExistsValidate",
              },
            },
          },
        },
        500: {
          description: "Lỗi server",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/ErrorServerResponse",
              },
            },
          },
        },
      },
    },
  },

  "/api/permission": {
    get: {
      summary: "Hiển thị tất cả quyền",
      description: "Hiển thị tât cả quyền",
      tags: ["Permission"],
      operationId: "getAllPermission",
      security: [
        {
          BearerAuth: [],
        },
      ],
      responses: {
        200: {
          description: "Hiển thị tất cả quyền có trong database",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/GetAllPermissionsResponse",
              },
            },
          },
        },
        401: {
          description: "Lỗi yêu cầu không hợp lệ",
          content: {
            "application/json": {
              oneOf: [
                {
                  description: "Token đang nằm trong Black List",
                  schema: {
                    $ref: "#/components/schemas/TokenBlackListVerify",
                  },
                },
                {
                  description: "Token hết hạn",
                  schema: {
                    $ref: "#/components/schemas/TokenExpiredVerify",
                  },
                },
                {
                  description: "Token không hợp lệ",
                  schema: {
                    $ref: "#/components/schemas/TokenInvalidVerify",
                  },
                },
              ],
              examples: {
                TokenBlackListVerify: {
                  description: "Token đang nằm trong Black List",
                  value: {
                    status: 401,
                    error: {
                      errorCode: "TOKEN_IN_BLACKLIST",
                      errorMessage: "Token in the backlist",
                    },
                  },
                },
                TokenExpiredVerify: {
                  description: "Token hết hạn",
                  value: {
                    status: 401,
                    error: {
                      errorCode: "TOKEN_EXPIRED",
                      errorMessage: "Token has expired",
                    },
                  },
                },
                TokenInvalidVerify: {
                  description: "Token không hợp lệ",
                  value: {
                    status: 401,
                    error: {
                      errorCode: "TOKEN_INVALID",
                      errorMessage: "You are not authenticated",
                    },
                  },
                },
              },
            },
          },
        },
        404: {
          description: "Không có quyền trong database",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/PermissionNotFound",
              },
            },
          },
        },
        500: {
          description: "Lỗi server",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/ErrorServerResponse",
              },
            },
          },
        },
      },
    },
  },
  "/api/permission/{id}": {
    get: {
      summary: "Tìm kiếm quyền bằng ID",
      description: "Tìm kiếm quyền bằng ID",
      tags: ["Permission"],
      operationId: "getAdPermissionById",
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
            $ref: "#/components/schemas/IdParams",
          },
        },
      ],
      responses: {
        200: {
          description: "Hiển thị quyền đã tìm kiếm",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/GetPermissionsByIdResponse",
              },
            },
          },
        },
        401: {
          description: "Lỗi yêu cầu không hợp lệ",
          content: {
            "application/json": {
              oneOf: [
                {
                  description: "Token đang nằm trong Black List",
                  schema: {
                    $ref: "#/components/schemas/TokenBlackListVerify",
                  },
                },
                {
                  description: "Token hết hạn",
                  schema: {
                    $ref: "#/components/schemas/TokenExpiredVerify",
                  },
                },
                {
                  description: "Token không hợp lệ",
                  schema: {
                    $ref: "#/components/schemas/TokenInvalidVerify",
                  },
                },
              ],
              examples: {
                TokenBlackListVerify: {
                  description: "Token đang nằm trong Black List",
                  value: {
                    status: 401,
                    error: {
                      errorCode: "TOKEN_IN_BLACKLIST",
                      errorMessage: "Token in the backlist",
                    },
                  },
                },
                TokenExpiredVerify: {
                  description: "Token hết hạn",
                  value: {
                    status: 401,
                    error: {
                      errorCode: "TOKEN_EXPIRED",
                      errorMessage: "Token has expired",
                    },
                  },
                },
                TokenInvalidVerify: {
                  description: "Token không hợp lệ",
                  value: {
                    status: 401,
                    error: {
                      errorCode: "TOKEN_INVALID",
                      errorMessage: "You are not authenticated",
                    },
                  },
                },
              },
            },
          },
        },
        404: {
          description: "Không có quyền trong database",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/PermissionNotFound",
              },
            },
          },
        },
        500: {
          description: "Lỗi server",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/ErrorServerResponse",
              },
            },
          },
        },
      },
    },
  },
  "/api/permission/create": {
    post: {
      summary: "Tạo quyền người dùng",
      description: "Tạo quyền người dùng",
      tags: ["Permission"],
      operationId: "createPermission",
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
              $ref: "#/components/schemas/CreateOrUpdatePermissionRequest",
            },
          },
        },
      },
      responses: {
        201: {
          description: "Tạo quyền mới thành công",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/CreateOrUpdatePermissionResponse",
              },
            },
          },
        },
        400: {
          description: "Quyền đã tồn tại",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/PermissionExists",
              },
            },
          },
        },
        401: {
          description: "Lỗi yêu cầu không hợp lệ",
          content: {
            "application/json": {
              oneOf: [
                {
                  description: "Token đang nằm trong Black List",
                  schema: {
                    $ref: "#/components/schemas/TokenBlackListVerify",
                  },
                },
                {
                  description: "Token hết hạn",
                  schema: {
                    $ref: "#/components/schemas/TokenExpiredVerify",
                  },
                },
                {
                  description: "Token không hợp lệ",
                  schema: {
                    $ref: "#/components/schemas/TokenInvalidVerify",
                  },
                },
              ],
              examples: {
                TokenBlackListVerify: {
                  description: "Token đang nằm trong Black List",
                  value: {
                    status: 401,
                    error: {
                      errorCode: "TOKEN_IN_BLACKLIST",
                      errorMessage: "Token in the backlist",
                    },
                  },
                },
                TokenExpiredVerify: {
                  description: "Token hết hạn",
                  value: {
                    status: 401,
                    error: {
                      errorCode: "TOKEN_EXPIRED",
                      errorMessage: "Token has expired",
                    },
                  },
                },
                TokenInvalidVerify: {
                  description: "Token không hợp lệ",
                  value: {
                    status: 401,
                    error: {
                      errorCode: "TOKEN_INVALID",
                      errorMessage: "You are not authenticated",
                    },
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
                $ref: "#/components/schemas/ErrorServerResponse",
              },
            },
          },
        },
      },
    },
  },
  "/api/permission/update/{id}": {
    put: {
      summary: "Cập nhật quyền",
      description: "Cập nhật quyền",
      tags: ["Permission"],
      operationId: "updataPermission",
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
            $ref: "#/components/schemas/IdParams",
          },
        },
      ],
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              $ref: "#/components/schemas/CreateOrUpdatePermissionRequest",
            },
          },
        },
      },
      responses: {
        200: {
          description: "Hiển thị thông tin quyền đã cập nhật thành công",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/CreateOrUpdatePermissionResponse",
              },
            },
          },
        },
        400: {
          description: "Thiếu các trường bắt buộc",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/MissingFieldsValidate",
              },
            },
          },
        },
        401: {
          description: "Lỗi yêu cầu không hợp lệ",
          content: {
            "application/json": {
              oneOf: [
                {
                  description: "Token đang nằm trong Black List",
                  schema: {
                    $ref: "#/components/schemas/TokenBlackListVerify",
                  },
                },
                {
                  description: "Token hết hạn",
                  schema: {
                    $ref: "#/components/schemas/TokenExpiredVerify",
                  },
                },
                {
                  description: "Token không hợp lệ",
                  schema: {
                    $ref: "#/components/schemas/TokenInvalidVerify",
                  },
                },
              ],
              examples: {
                TokenBlackListVerify: {
                  description: "Token đang nằm trong Black List",
                  value: {
                    status: 401,
                    error: {
                      errorCode: "TOKEN_IN_BLACKLIST",
                      errorMessage: "Token in the backlist",
                    },
                  },
                },
                TokenExpiredVerify: {
                  description: "Token hết hạn",
                  value: {
                    status: 401,
                    error: {
                      errorCode: "TOKEN_EXPIRED",
                      errorMessage: "Token has expired",
                    },
                  },
                },
                TokenInvalidVerify: {
                  description: "Token không hợp lệ",
                  value: {
                    status: 401,
                    error: {
                      errorCode: "TOKEN_INVALID",
                      errorMessage: "You are not authenticated",
                    },
                  },
                },
              },
            },
          },
        },
        404: {
          description: "Lỗi yêu cầu không hợp lệ",
          content: {
            "application/json": {
              oneOf: [
                {
                  description: "Không tìm thấy quyền trong database",
                  schema: {
                    $ref: "#/components/schemas/PermissionNotFound",
                  },
                },
                {
                  description: "Vai trò chưa được tạo",
                  schema: {
                    $ref: "#/components/schemas/RoleNotCreated",
                  },
                },
              ],
              examples: {
                PermissionNotFound: {
                  description: "Không tìm thấy quyền trong database",
                  value: {
                    status: 404,
                    error: {
                      errorCode: "PERMISSION_NOT_FOUND",
                      errorMessage: "Permissions not found in the database",
                    },
                  },
                },
                RoleNotCreated: {
                  description: "Vài trò chưa được tạo",
                  value: {
                    status: 400,
                    error: {
                      errorCode: "ROLE_NOT_CREATED",
                      errorMessage: "Please create a role first",
                    },
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
                $ref: "#/components/schemas/ErrorServerResponse",
              },
            },
          },
        },
      },
    },
  },
  "/api/permission/delete/{id}": {
    delete: {
      summary: "Xóa quyền bằng ID",
      description: "Xóa quyền bằng ID",
      tags: ["Permission"],
      operationId: "deletePermission",
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
            $ref: "#/components/schemas/IdParams",
          },
        },
      ],
      responses: {
        200: {
          description: "Thông báo đã xóa vai trò thành công",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/DeletePermissionResponse",
              },
            },
          },
        },
        401: {
          description: "Lỗi yêu cầu không hợp lệ",
          content: {
            "application/json": {
              oneOf: [
                {
                  description: "Token đang nằm trong Black List",
                  schema: {
                    $ref: "#/components/schemas/TokenBlackListVerify",
                  },
                },
                {
                  description: "Token hết hạn",
                  schema: {
                    $ref: "#/components/schemas/TokenExpiredVerify",
                  },
                },
                {
                  description: "Token không hợp lệ",
                  schema: {
                    $ref: "#/components/schemas/TokenInvalidVerify",
                  },
                },
              ],
              examples: {
                TokenBlackListVerify: {
                  description: "Token đang nằm trong Black List",
                  value: {
                    status: 401,
                    error: {
                      errorCode: "TOKEN_IN_BLACKLIST",
                      errorMessage: "Token in the backlist",
                    },
                  },
                },
                TokenExpiredVerify: {
                  description: "Token hết hạn",
                  value: {
                    status: 401,
                    error: {
                      errorCode: "TOKEN_EXPIRED",
                      errorMessage: "Token has expired",
                    },
                  },
                },
                TokenInvalidVerify: {
                  description: "Token không hợp lệ",
                  value: {
                    status: 401,
                    error: {
                      errorCode: "TOKEN_INVALID",
                      errorMessage: "You are not authenticated",
                    },
                  },
                },
              },
            },
          },
        },
        404: {
          description: "Không có quyền trong database",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/PermissionNotFound",
              },
            },
          },
        },
        500: {
          description: "Lỗi server",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/ErrorServerResponse",
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
      description: "Hiển thị tât cả địa chỉ",
      tags: ["UserAddress"],
      operationId: "getAllUserAddress",
      security: [
        {
          BearerAuth: [],
        },
      ],
      responses: {
        200: {
          description: "Hiển thị tất cả địa chỉ có trong database",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/GetAllUserAddressResponse",
              },
            },
          },
        },
        401: {
          description: "Lỗi yêu cầu không hợp lệ",
          content: {
            "application/json": {
              oneOf: [
                {
                  description: "Token đang nằm trong Black List",
                  schema: {
                    $ref: "#/components/schemas/TokenBlackListVerify",
                  },
                },
                {
                  description: "Token hết hạn",
                  schema: {
                    $ref: "#/components/schemas/TokenExpiredVerify",
                  },
                },
                {
                  description: "Token không hợp lệ",
                  schema: {
                    $ref: "#/components/schemas/TokenInvalidVerify",
                  },
                },
              ],
              examples: {
                TokenBlackListVerify: {
                  description: "Token đang nằm trong Black List",
                  value: {
                    status: 401,
                    error: {
                      errorCode: "TOKEN_IN_BLACKLIST",
                      errorMessage: "Token in the backlist",
                    },
                  },
                },
                TokenExpiredVerify: {
                  description: "Token hết hạn",
                  value: {
                    status: 401,
                    error: {
                      errorCode: "TOKEN_EXPIRED",
                      errorMessage: "Token has expired",
                    },
                  },
                },
                TokenInvalidVerify: {
                  description: "Token không hợp lệ",
                  value: {
                    status: 401,
                    error: {
                      errorCode: "TOKEN_INVALID",
                      errorMessage: "You are not authenticated",
                    },
                  },
                },
              },
            },
          },
        },
        404: {
          description: "Không có địa chỉ",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/UserAddressNotFound",
              },
            },
          },
        },
        500: {
          description: "Lỗi server",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/ErrorServerResponse",
              },
            },
          },
        },
      },
    },
  },
  "/api/address/{id}": {
    get: {
      summary: "Tìm kiếm địa chỉ",
      description: "Tìm kiếm địa chỉ bằng id",
      tags: ["UserAddress"],
      operationId: "getUserAddressById",
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
            $ref: "#/components/schemas/uuidParams",
          },
        },
      ],
      responses: {
        200: {
          description: "Hiển thị thông tin địa chỉ thành công",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/GetUserAddressByIdResponse",
              },
            },
          },
        },
        400: {
          description: "Params ID không đúng định dạng",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/ParamsValidate",
              },
            },
          },
        },
        401: {
          description: "Lỗi yêu cầu không hợp lệ",
          content: {
            "application/json": {
              oneOf: [
                {
                  description: "Token đang nằm trong Black List",
                  schema: {
                    $ref: "#/components/schemas/TokenBlackListVerify",
                  },
                },
                {
                  description: "Token hết hạn",
                  schema: {
                    $ref: "#/components/schemas/TokenExpiredVerify",
                  },
                },
                {
                  description: "Token không hợp lệ",
                  schema: {
                    $ref: "#/components/schemas/TokenInvalidVerify",
                  },
                },
              ],
              examples: {
                TokenBlackListVerify: {
                  description: "Token đang nằm trong Black List",
                  value: {
                    status: 401,
                    error: {
                      errorCode: "TOKEN_IN_BLACKLIST",
                      errorMessage: "Token in the backlist",
                    },
                  },
                },
                TokenExpiredVerify: {
                  description: "Token hết hạn",
                  value: {
                    status: 401,
                    error: {
                      errorCode: "TOKEN_EXPIRED",
                      errorMessage: "Token has expired",
                    },
                  },
                },
                TokenInvalidVerify: {
                  description: "Token không hợp lệ",
                  value: {
                    status: 401,
                    error: {
                      errorCode: "TOKEN_INVALID",
                      errorMessage: "You are not authenticated",
                    },
                  },
                },
              },
            },
          },
        },
        404: {
          description: "Địa chỉ không tồn tại",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/UserAddressNotFound",
              },
            },
          },
        },
        500: {
          description: "Lỗi server",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/ErrorServerResponse",
              },
            },
          },
        },
      },
    },
  },
  "/api/address/create": {
    post: {
      summary: "Tạo địa chỉ người dùng",
      description: "Tạo địa của người dùng",
      tags: ["UserAddress"],
      operationId: "addUserAddress",
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
              $ref: "#/components/schemas/CreateOrUpdateUserAddressRequest",
            },
          },
        },
      },
      responses: {
        201: {
          description: "Tạo đại chỉ thành công",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/CreateOrUpdateUserAddressResponse",
              },
            },
          },
        },
        400: {
          description: "Thiếu các trường bắt buộc",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/MissingFieldsValidate",
              },
            },
          },
        },
        401: {
          description: "Lỗi yêu cầu không hợp lệ",
          content: {
            "application/json": {
              oneOf: [
                {
                  description: "Token đang nằm trong Black List",
                  schema: {
                    $ref: "#/components/schemas/TokenBlackListVerify",
                  },
                },
                {
                  description: "Token hết hạn",
                  schema: {
                    $ref: "#/components/schemas/TokenExpiredVerify",
                  },
                },
                {
                  description: "Token không hợp lệ",
                  schema: {
                    $ref: "#/components/schemas/TokenInvalidVerify",
                  },
                },
              ],
              examples: {
                TokenBlackListVerify: {
                  description: "Token đang nằm trong Black List",
                  value: {
                    status: 401,
                    error: {
                      errorCode: "TOKEN_IN_BLACKLIST",
                      errorMessage: "Token in the backlist",
                    },
                  },
                },
                TokenExpiredVerify: {
                  description: "Token hết hạn",
                  value: {
                    status: 401,
                    error: {
                      errorCode: "TOKEN_EXPIRED",
                      errorMessage: "Token has expired",
                    },
                  },
                },
                TokenInvalidVerify: {
                  description: "Token không hợp lệ",
                  value: {
                    status: 401,
                    error: {
                      errorCode: "TOKEN_INVALID",
                      errorMessage: "You are not authenticated",
                    },
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
                $ref: "#/components/schemas/ErrorServerResponse",
              },
            },
          },
        },
      },
    },
  },
  "/api/address/update/{id}": {
    put: {
      summary: "Cập nhật địa chỉ",
      description: "Cập nhật địa chỉ bằng id",
      tags: ["UserAddress"],
      operationId: "updataUserAddress",
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
            $ref: "#/components/schemas/uuidParams",
          },
        },
      ],
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              $ref: "#/components/schemas/CreateOrUpdateUserAddressRequest",
            },
          },
        },
      },
      responses: {
        200: {
          description: "Hiển thị thông tin địa chỉ đã cập nhật thành công",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/CreateOrUpdateUserAddressResponse",
              },
            },
          },
        },
        400: {
          description: "Lỗi yêu cầu không hợp lệ",
          content: {
            "application/json": {
              oneOf: [
                {
                  description: "Params ID người dùng không đúng định dạng",
                  schema: {
                    $ref: "#/components/schemas/ParamsValidate",
                  },
                },
                {
                  description: "Thiếu các trường bắt buộc",
                  schema: {
                    $ref: "#/components/schemas/MissingFieldsValidate",
                  },
                },
              ],
              examples: {
                ParamsValidate: {
                  description: "Params ID người dùng không đúng định dạng",
                  value: {
                    status: 400,
                    error: {
                      errorCode: "PARAMS_INCORRECT_FORMAT",
                      errorMessage: "Invalid params format: 'DATA_TYPE'",
                    },
                  },
                },
                MissingFieldsValidate: {
                  description: "Thiếu các trường bắt buộc",
                  value: {
                    status: 400,
                    error: {
                      errorCode: "MISSING_FIELD",
                      errorMessage:
                        "The field 'FIELD_NAME' is required and cannot be empty",
                    },
                  },
                },
              },
            },
          },
        },
        401: {
          description: "Lỗi yêu cầu không hợp lệ",
          content: {
            "application/json": {
              oneOf: [
                {
                  description: "Token đang nằm trong Black List",
                  schema: {
                    $ref: "#/components/schemas/TokenBlackListVerify",
                  },
                },
                {
                  description: "Token hết hạn",
                  schema: {
                    $ref: "#/components/schemas/TokenExpiredVerify",
                  },
                },
                {
                  description: "Token không hợp lệ",
                  schema: {
                    $ref: "#/components/schemas/TokenInvalidVerify",
                  },
                },
              ],
              examples: {
                TokenBlackListVerify: {
                  description: "Token đang nằm trong Black List",
                  value: {
                    status: 401,
                    error: {
                      errorCode: "TOKEN_IN_BLACKLIST",
                      errorMessage: "Token in the backlist",
                    },
                  },
                },
                TokenExpiredVerify: {
                  description: "Token hết hạn",
                  value: {
                    status: 401,
                    error: {
                      errorCode: "TOKEN_EXPIRED",
                      errorMessage: "Token has expired",
                    },
                  },
                },
                TokenInvalidVerify: {
                  description: "Token không hợp lệ",
                  value: {
                    status: 401,
                    error: {
                      errorCode: "TOKEN_INVALID",
                      errorMessage: "You are not authenticated",
                    },
                  },
                },
              },
            },
          },
        },
        404: {
          description: "Địa chỉ không tồn tại",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/UserAddressNotFound",
              },
            },
          },
        },
        500: {
          description: "Lỗi server",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/ErrorServerResponse",
              },
            },
          },
        },
      },
    },
  },
  "/api/address/delete/{id}": {
    delete: {
      summary: "Xóa địa chỉ",
      description: "Xóa tài địa chỉ bằng id",
      tags: ["UserAddress"],
      operationId: "deleteUserAddress",
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
            $ref: "#/components/schemas/uuidParams",
          },
        },
      ],
      responses: {
        200: {
          description: "Xóa địa chỉ thành công",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/DeleteUserAddressResponse",
              },
            },
          },
        },
        400: {
          description: "Params Id không đúng định dạng",
          content: {
            "application/json": {
              schema: {
                $ref: "#components/schemas/ParamsValidate",
              },
            },
          },
        },
        401: {
          description: "Lỗi yêu cầu không hợp lệ",
          content: {
            "application/json": {
              oneOf: [
                {
                  description: "Token đang nằm trong Black List",
                  schema: {
                    $ref: "#/components/schemas/TokenBlackListVerify",
                  },
                },
                {
                  description: "Token hết hạn",
                  schema: {
                    $ref: "#/components/schemas/TokenExpiredVerify",
                  },
                },
                {
                  description: "Token không hợp lệ",
                  schema: {
                    $ref: "#/components/schemas/TokenInvalidVerify",
                  },
                },
              ],
              examples: {
                TokenBlackListVerify: {
                  description: "Token đang nằm trong Black List",
                  value: {
                    status: 401,
                    error: {
                      errorCode: "TOKEN_IN_BLACKLIST",
                      errorMessage: "Token in the backlist",
                    },
                  },
                },
                TokenExpiredVerify: {
                  description: "Token hết hạn",
                  value: {
                    status: 401,
                    error: {
                      errorCode: "TOKEN_EXPIRED",
                      errorMessage: "Token has expired",
                    },
                  },
                },
                TokenInvalidVerify: {
                  description: "Token không hợp lệ",
                  value: {
                    status: 401,
                    error: {
                      errorCode: "TOKEN_INVALID",
                      errorMessage: "You are not authenticated",
                    },
                  },
                },
              },
            },
          },
        },
        404: {
          description: "Địa chỉ không tồn tại",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schema/UserAddressNotFound",
              },
            },
          },
        },
        500: {
          description: "Lỗi server",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/ErrorServerResponse",
              },
            },
          },
        },
      },
    },
  },
  "/api/address/my-address": {
    get: {
      summary: "Hiển thị tất cả địa chỉ của người dùng",
      description: "Hiển thị tât cả địa chỉ của người dùng",
      tags: ["UserAddress"],
      operationId: "getMyUserAddress",
      security: [
        {
          BearerAuth: [],
        },
      ],
      responses: {
        200: {
          description: "Hiển thị tất cả địa chỉ của tôi",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/GetMyUserAddressResponse",
              },
            },
          },
        },
        401: {
          description: "Lỗi yêu cầu không hợp lệ",
          content: {
            "application/json": {
              oneOf: [
                {
                  description: "Token đang nằm trong Black List",
                  schema: {
                    $ref: "#/components/schemas/TokenBlackListVerify",
                  },
                },
                {
                  description: "Token hết hạn",
                  schema: {
                    $ref: "#/components/schemas/TokenExpiredVerify",
                  },
                },
                {
                  description: "Token không hợp lệ",
                  schema: {
                    $ref: "#/components/schemas/TokenInvalidVerify",
                  },
                },
              ],
              examples: {
                TokenBlackListVerify: {
                  description: "Token đang nằm trong Black List",
                  value: {
                    status: 401,
                    error: {
                      errorCode: "TOKEN_IN_BLACKLIST",
                      errorMessage: "Token in the backlist",
                    },
                  },
                },
                TokenExpiredVerify: {
                  description: "Token hết hạn",
                  value: {
                    status: 401,
                    error: {
                      errorCode: "TOKEN_EXPIRED",
                      errorMessage: "Token has expired",
                    },
                  },
                },
                TokenInvalidVerify: {
                  description: "Token không hợp lệ",
                  value: {
                    status: 401,
                    error: {
                      errorCode: "TOKEN_INVALID",
                      errorMessage: "You are not authenticated",
                    },
                  },
                },
              },
            },
          },
        },
        404: {
          description: "Không có địa chỉ",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/UserAddressNotFound",
              },
            },
          },
        },
        500: {
          description: "Lỗi server",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/ErrorServerResponse",
              },
            },
          },
        },
      },
    },
  },

  "/api/address/provinces": {
    get: {
      summary: "Hiển thị tất cả tỉnh/thành phố",
      description: "Hiển thị tât cả tỉnh/thành phố",
      tags: ["Province"],
      operationId: "getProvince",
      security: [
        {
          BearerAuth: [],
        },
      ],
      responses: {
        200: {
          description: "Hiển thị tất cả tỉnh/thành phố",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/GetAllProvincesResponse",
              },
            },
          },
        },
        500: {
          description: "Lỗi server",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/ErrorServerResponse",
              },
            },
          },
        },
      },
    },
  },
  "/api/address/districts/{provinceId}": {
    get: {
      summary: "Tìm kiếm quận/huyện theo tỉnh/thành phố",
      description: "Tìm kiếm quận/huyện theo tỉnh/thành phố",
      tags: ["Province"],
      operationId: "getDistrictsByProvinceCode",
      security: [
        {
          BearerAuth: [],
        },
      ],
      parameters: [
        {
          name: "provinceId",
          in: "path",
          require: "true",
          schema: {
            type: "integer",
            description: "Nhập Id muốn tìm kiếm",
          },
        },
      ],
      responses: {
        200: {
          description: "Hiển thị Quận/Huyện theo ProvinceCode",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/GetDistrictByProvinceCode",
              },
            },
          },
        },
        500: {
          description: "Lỗi server",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/ErrorServerResponse",
              },
            },
          },
        },
      },
    },
  },
  "/api/address/wards/{districtId}": {
    get: {
      summary: "Tìm kiếm xã/phương theo quận/huyện",
      description: "Tìm kiếm xã/phương theo quận/huyện",
      tags: ["Province"],
      operationId: "getWardByDistrictCode",
      security: [
        {
          BearerAuth: [],
        },
      ],
      parameters: [
        {
          name: "districtId",
          in: "path",
          require: "true",
          schema: {
            type: "integer",
            description: "Nhập Id muốn tìm kiếm",
          },
        },
      ],
      responses: {
        200: {
          description: "Hiển thị Xã/Phường theo DistrictCode",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/GetWardByDistrictCode",
              },
            },
          },
        },
        500: {
          description: "Lỗi server",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/ErrorServerResponse",
              },
            },
          },
        },
      },
    },
  },

  "/api/categories/private": {
    get: {
      summary: "Hiển thị tất cả danh mục của admin",
      description: "Hiển thị tât cả danh mục của admin",
      tags: ["Category"],
      operationId: "getAllCategoryAdmin",
      security: [
        {
          BearerAuth: [],
        },
      ],
      responses: {
        200: {
          description: "Hiển thị tất cả danh mục có trong database",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/GetAllCategoriesAdminResponse",
              },
            },
          },
        },
        401: {
          description: "Lỗi yêu cầu không hợp lệ",
          content: {
            "application/json": {
              oneOf: [
                {
                  description: "Token đang nằm trong Black List",
                  schema: {
                    $ref: "#/components/schemas/TokenBlackListVerify",
                  },
                },
                {
                  description: "Token hết hạn",
                  schema: {
                    $ref: "#/components/schemas/TokenExpiredVerify",
                  },
                },
                {
                  description: "Token không hợp lệ",
                  schema: {
                    $ref: "#/components/schemas/TokenInvalidVerify",
                  },
                },
              ],
              examples: {
                TokenBlackListVerify: {
                  description: "Token đang nằm trong Black List",
                  value: {
                    status: 401,
                    error: {
                      errorCode: "TOKEN_IN_BLACKLIST",
                      errorMessage: "Token in the backlist",
                    },
                  },
                },
                TokenExpiredVerify: {
                  description: "Token hết hạn",
                  value: {
                    status: 401,
                    error: {
                      errorCode: "TOKEN_EXPIRED",
                      errorMessage: "Token has expired",
                    },
                  },
                },
                TokenInvalidVerify: {
                  description: "Token không hợp lệ",
                  value: {
                    status: 401,
                    error: {
                      errorCode: "TOKEN_INVALID",
                      errorMessage: "You are not authenticated",
                    },
                  },
                },
              },
            },
          },
        },
        404: {
          description: "Category không tồn tại trong database",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/CategoryNotFound",
              },
            },
          },
        },
        500: {
          description: "Lỗi server",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/ErrorServerResponse",
              },
            },
          },
        },
      },
    },
  },
  "/api/categories": {
    get: {
      summary: "Hiển thị tất cả danh mục",
      description: "Hiển thị tât cả danh mục",
      tags: ["Category"],
      operationId: "getAllCategory",
      responses: {
        200: {
          description: "Hiển thị tất cả danh mục có trong database",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/GetAllCategoriesResponse",
              },
            },
          },
        },
        401: {
          description: "Lỗi yêu cầu không hợp lệ",
          content: {
            "application/json": {
              oneOf: [
                {
                  description: "Token đang nằm trong Black List",
                  schema: {
                    $ref: "#/components/schemas/TokenBlackListVerify",
                  },
                },
                {
                  description: "Token hết hạn",
                  schema: {
                    $ref: "#/components/schemas/TokenExpiredVerify",
                  },
                },
                {
                  description: "Token không hợp lệ",
                  schema: {
                    $ref: "#/components/schemas/TokenInvalidVerify",
                  },
                },
              ],
              examples: {
                TokenBlackListVerify: {
                  description: "Token đang nằm trong Black List",
                  value: {
                    status: 401,
                    error: {
                      errorCode: "TOKEN_IN_BLACKLIST",
                      errorMessage: "Token in the backlist",
                    },
                  },
                },
                TokenExpiredVerify: {
                  description: "Token hết hạn",
                  value: {
                    status: 401,
                    error: {
                      errorCode: "TOKEN_EXPIRED",
                      errorMessage: "Token has expired",
                    },
                  },
                },
                TokenInvalidVerify: {
                  description: "Token không hợp lệ",
                  value: {
                    status: 401,
                    error: {
                      errorCode: "TOKEN_INVALID",
                      errorMessage: "You are not authenticated",
                    },
                  },
                },
              },
            },
          },
        },
        404: {
          description: "Category không tồn tại trong database",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/CategoryNotFound",
              },
            },
          },
        },
        500: {
          description: "Lỗi server",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/ErrorServerResponse",
              },
            },
          },
        },
      },
    },
  },
  "/api/categories/create": {
    post: {
      summary: "Tạo danh mục",
      description: "Tạo danh mục",
      tags: ["Category"],
      operationId: "createCategory",
      security: [
        {
          BearerAuth: [],
        },
      ],
      requestBody: {
        required: true,
        content: {
          "multipart/form-data": {
            schema: {
              $ref: "#/components/schemas/CreateOrUpdateCategoryRequest",
            },
          },
        },
      },
      responses: {
        201: {
          description: "Tạo danh mục thành công",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/CreateOrUpdateCategoryResponse",
              },
            },
          },
        },
        400: {
          description: "Thiếu trường bắt buộc",
          content: {
            "application/json": {
              schema: {
                $ref: "#components/schemas/MissingFieldsValidate",
              },
            },
          },
        },
        401: {
          description: "Lỗi yêu cầu không hợp lệ",
          content: {
            "application/json": {
              oneOf: [
                {
                  description: "Token đang nằm trong Black List",
                  schema: {
                    $ref: "#/components/schemas/TokenBlackListVerify",
                  },
                },
                {
                  description: "Token hết hạn",
                  schema: {
                    $ref: "#/components/schemas/TokenExpiredVerify",
                  },
                },
                {
                  description: "Token không hợp lệ",
                  schema: {
                    $ref: "#/components/schemas/TokenInvalidVerify",
                  },
                },
              ],
              examples: {
                TokenBlackListVerify: {
                  description: "Token đang nằm trong Black List",
                  value: {
                    status: 401,
                    error: {
                      errorCode: "TOKEN_IN_BLACKLIST",
                      errorMessage: "Token in the backlist",
                    },
                  },
                },
                TokenExpiredVerify: {
                  description: "Token hết hạn",
                  value: {
                    status: 401,
                    error: {
                      errorCode: "TOKEN_EXPIRED",
                      errorMessage: "Token has expired",
                    },
                  },
                },
                TokenInvalidVerify: {
                  description: "Token không hợp lệ",
                  value: {
                    status: 401,
                    error: {
                      errorCode: "TOKEN_INVALID",
                      errorMessage: "You are not authenticated",
                    },
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
                $ref: "#/components/schemas/ErrorServerResponse",
              },
            },
          },
        },
      },
    },
  },
  "/api/categories/update/{categoryId}": {
    put: {
      summary: "Cập nhật danh mục",
      description: "Cập nhật danh mục bằng id",
      tags: ["Category"],
      operationId: "updataCategory",
      security: [
        {
          BearerAuth: [],
        },
      ],
      parameters: [
        {
          name: "categoryId",
          in: "path",
          require: "true",
          schema: {
            $ref: "#/components/schemas/IdParams",
          },
        },
      ],
      requestBody: {
        required: true,
        content: {
          "multipart/form-data": {
            schema: {
              $ref: "#/components/schemas/CreateOrUpdateCategoryRequest",
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
                $ref: "#/components/schemas/CreateOrUpdateCategoryResponse",
              },
            },
          },
        },
        400: {
          description: "Thiếu trường bắt buộc",
          content: {
            "application/json": {
              schema: {
                $ref: "#components/schemas/MissingFieldsValidate",
              },
            },
          },
        },
        401: {
          description: "Lỗi yêu cầu không hợp lệ",
          content: {
            "application/json": {
              oneOf: [
                {
                  description: "Token đang nằm trong Black List",
                  schema: {
                    $ref: "#/components/schemas/TokenBlackListVerify",
                  },
                },
                {
                  description: "Token hết hạn",
                  schema: {
                    $ref: "#/components/schemas/TokenExpiredVerify",
                  },
                },
                {
                  description: "Token không hợp lệ",
                  schema: {
                    $ref: "#/components/schemas/TokenInvalidVerify",
                  },
                },
              ],
              examples: {
                TokenBlackListVerify: {
                  description: "Token đang nằm trong Black List",
                  value: {
                    status: 401,
                    error: {
                      errorCode: "TOKEN_IN_BLACKLIST",
                      errorMessage: "Token in the backlist",
                    },
                  },
                },
                TokenExpiredVerify: {
                  description: "Token hết hạn",
                  value: {
                    status: 401,
                    error: {
                      errorCode: "TOKEN_EXPIRED",
                      errorMessage: "Token has expired",
                    },
                  },
                },
                TokenInvalidVerify: {
                  description: "Token không hợp lệ",
                  value: {
                    status: 401,
                    error: {
                      errorCode: "TOKEN_INVALID",
                      errorMessage: "You are not authenticated",
                    },
                  },
                },
              },
            },
          },
        },
        404: {
          description: "Danh mục không tồn tại",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/CategoryNotFound",
              },
            },
          },
        },
        500: {
          description: "Lỗi server",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/ErrorServerResponse",
              },
            },
          },
        },
      },
    },
  },
  "/api/categories/delete/{categoryId}": {
    delete: {
      summary: "Xóa danh mục",
      description: "Xóa danh mục bằng id",
      tags: ["Category"],
      operationId: "deleteCategory",
      security: [
        {
          BearerAuth: [],
        },
      ],
      parameters: [
        {
          name: "categoryId",
          in: "path",
          require: "true",
          schema: {
            $ref: "#/components/schemas/IdParams",
          },
        },
      ],
      responses: {
        200: {
          description: "Xóa địa chỉ thành công",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/DeleteCategoryResponse",
              },
            },
          },
        },
        401: {
          description: "Lỗi yêu cầu không hợp lệ",
          content: {
            "application/json": {
              oneOf: [
                {
                  description: "Token đang nằm trong Black List",
                  schema: {
                    $ref: "#/components/schemas/TokenBlackListVerify",
                  },
                },
                {
                  description: "Token hết hạn",
                  schema: {
                    $ref: "#/components/schemas/TokenExpiredVerify",
                  },
                },
                {
                  description: "Token không hợp lệ",
                  schema: {
                    $ref: "#/components/schemas/TokenInvalidVerify",
                  },
                },
              ],
              examples: {
                TokenBlackListVerify: {
                  description: "Token đang nằm trong Black List",
                  value: {
                    status: 401,
                    error: {
                      errorCode: "TOKEN_IN_BLACKLIST",
                      errorMessage: "Token in the backlist",
                    },
                  },
                },
                TokenExpiredVerify: {
                  description: "Token hết hạn",
                  value: {
                    status: 401,
                    error: {
                      errorCode: "TOKEN_EXPIRED",
                      errorMessage: "Token has expired",
                    },
                  },
                },
                TokenInvalidVerify: {
                  description: "Token không hợp lệ",
                  value: {
                    status: 401,
                    error: {
                      errorCode: "TOKEN_INVALID",
                      errorMessage: "You are not authenticated",
                    },
                  },
                },
              },
            },
          },
        },
        404: {
          description: "Địa chỉ không tồn tại",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/UserAddressNotFound",
              },
            },
          },
        },
        500: {
          description: "Lỗi server",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/ErrorServerResponse",
              },
            },
          },
        },
      },
    },
  },

  "/api/shop/create": {
    post: {
      summary: "Tạo shop",
      description: "Tạo shop",
      tags: ["Shop"],
      operationId: "createShop",
      security: [
        {
          BearerAuth: [],
        },
      ],
      requestBody: {
        required: true,
        content: {
          "multipart/form-data": {
            schema: {
              $ref: "#/components/schemas/CreateShopRequest",
            },
          },
        },
      },
      responses: {
        201: {
          description: "Tạo danh mục thành công",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/CreateOrUpdateCategoryResponse",
              },
            },
          },
        },
        400: {
          description: "Thiếu trường bắt buộc",
          content: {
            "application/json": {
              schema: {
                $ref: "#components/schemas/MissingFieldsValidate",
              },
            },
          },
        },
        401: {
          description: "Lỗi yêu cầu không hợp lệ",
          content: {
            "application/json": {
              oneOf: [
                {
                  description: "Token đang nằm trong Black List",
                  schema: {
                    $ref: "#/components/schemas/TokenBlackListVerify",
                  },
                },
                {
                  description: "Token hết hạn",
                  schema: {
                    $ref: "#/components/schemas/TokenExpiredVerify",
                  },
                },
                {
                  description: "Token không hợp lệ",
                  schema: {
                    $ref: "#/components/schemas/TokenInvalidVerify",
                  },
                },
              ],
              examples: {
                TokenBlackListVerify: {
                  description: "Token đang nằm trong Black List",
                  value: {
                    status: 401,
                    error: {
                      errorCode: "TOKEN_IN_BLACKLIST",
                      errorMessage: "Token in the backlist",
                    },
                  },
                },
                TokenExpiredVerify: {
                  description: "Token hết hạn",
                  value: {
                    status: 401,
                    error: {
                      errorCode: "TOKEN_EXPIRED",
                      errorMessage: "Token has expired",
                    },
                  },
                },
                TokenInvalidVerify: {
                  description: "Token không hợp lệ",
                  value: {
                    status: 401,
                    error: {
                      errorCode: "TOKEN_INVALID",
                      errorMessage: "You are not authenticated",
                    },
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
                $ref: "#/components/schemas/ErrorServerResponse",
              },
            },
          },
        },
      },
    },
  },

  "/api/product": {
    get: {
      summary: "Hiển thị tất cả sản phẩm",
      description: "Hiển thị tât cả sản phẩm",
      tags: ["Product"],
      operationId: "getAllProduct",
      responses: {
        200: {
          description: "Hiển thị tất cả sản phẩm có trong database",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/GetAllProducts",
              },
            },
          },
        },
        401: {
          description: "Lỗi yêu cầu không hợp lệ",
          content: {
            "application/json": {
              oneOf: [
                {
                  description: "Token đang nằm trong Black List",
                  schema: {
                    $ref: "#/components/schemas/TokenBlackListVerify",
                  },
                },
                {
                  description: "Token hết hạn",
                  schema: {
                    $ref: "#/components/schemas/TokenExpiredVerify",
                  },
                },
                {
                  description: "Token không hợp lệ",
                  schema: {
                    $ref: "#/components/schemas/TokenInvalidVerify",
                  },
                },
              ],
              examples: {
                TokenBlackListVerify: {
                  description: "Token đang nằm trong Black List",
                  value: {
                    status: 401,
                    error: {
                      errorCode: "TOKEN_IN_BLACKLIST",
                      errorMessage: "Token in the backlist",
                    },
                  },
                },
                TokenExpiredVerify: {
                  description: "Token hết hạn",
                  value: {
                    status: 401,
                    error: {
                      errorCode: "TOKEN_EXPIRED",
                      errorMessage: "Token has expired",
                    },
                  },
                },
                TokenInvalidVerify: {
                  description: "Token không hợp lệ",
                  value: {
                    status: 401,
                    error: {
                      errorCode: "TOKEN_INVALID",
                      errorMessage: "You are not authenticated",
                    },
                  },
                },
              },
            },
          },
        },
        404: {
          description: "Category không tồn tại trong database",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/CategoryNotFound",
              },
            },
          },
        },
        500: {
          description: "Lỗi server",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/ErrorServerResponse",
              },
            },
          },
        },
      },
    },
  },
  "/api/product/private": {
    get: {
      summary: "Hiển thị tất cả sản phẩm",
      description: "Hiển thị tât cả sản phẩm",
      tags: ["Product"],
      operationId: "getAllProduct",
      security: [
        {
          BearerAuth: [],
        },
      ],
      responses: {
        200: {
          description: "Hiển thị tất cả sản phẩm có trong database",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/GetAllProducts",
              },
            },
          },
        },
        401: {
          description: "Lỗi yêu cầu không hợp lệ",
          content: {
            "application/json": {
              oneOf: [
                {
                  description: "Token đang nằm trong Black List",
                  schema: {
                    $ref: "#/components/schemas/TokenBlackListVerify",
                  },
                },
                {
                  description: "Token hết hạn",
                  schema: {
                    $ref: "#/components/schemas/TokenExpiredVerify",
                  },
                },
                {
                  description: "Token không hợp lệ",
                  schema: {
                    $ref: "#/components/schemas/TokenInvalidVerify",
                  },
                },
              ],
              examples: {
                TokenBlackListVerify: {
                  description: "Token đang nằm trong Black List",
                  value: {
                    status: 401,
                    error: {
                      errorCode: "TOKEN_IN_BLACKLIST",
                      errorMessage: "Token in the backlist",
                    },
                  },
                },
                TokenExpiredVerify: {
                  description: "Token hết hạn",
                  value: {
                    status: 401,
                    error: {
                      errorCode: "TOKEN_EXPIRED",
                      errorMessage: "Token has expired",
                    },
                  },
                },
                TokenInvalidVerify: {
                  description: "Token không hợp lệ",
                  value: {
                    status: 401,
                    error: {
                      errorCode: "TOKEN_INVALID",
                      errorMessage: "You are not authenticated",
                    },
                  },
                },
              },
            },
          },
        },
        404: {
          description: "Category không tồn tại trong database",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/CategoryNotFound",
              },
            },
          },
        },
        500: {
          description: "Lỗi server",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/ErrorServerResponse",
              },
            },
          },
        },
      },
    },
  },
  "/api/product/{slug}": {
    get: {
      summary: "Tìm sản phẩm bằng slug",
      description: "Tìm sản phẩm bằng slug",
      tags: ["Product"],
      operationId: "getProductBySlug",
      security: [
        {
          BearerAuth: [],
        },
      ],
      parameters: [
        {
          name: "slug",
          in: "path",
          require: "true",
          schema: {
            $ref: "#/components/schemas/slugParams",
          },
        },
      ],
      responses: {
        200: {
          description: "Hiển thị thông tin tài khoản đã cập nhật thành công",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/GetProductBySlugResponse",
              },
            },
          },
        },
        404: {
          description: "Không tìm thấy sản phẩm",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/ProductNotFound",
              },
            },
          },
        },
        401: {
          description: "Lỗi yêu cầu không hợp lệ",
          content: {
            "application/json": {
              oneOf: [
                {
                  description: "Token đang nằm trong Black List",
                  schema: {
                    $ref: "#/components/schemas/TokenBlackListVerify",
                  },
                },
                {
                  description: "Token hết hạn",
                  schema: {
                    $ref: "#/components/schemas/TokenExpiredVerify",
                  },
                },
                {
                  description: "Token không hợp lệ",
                  schema: {
                    $ref: "#/components/schemas/TokenInvalidVerify",
                  },
                },
              ],
              examples: {
                TokenBlackListVerify: {
                  description: "Token đang nằm trong Black List",
                  value: {
                    status: 401,
                    error: {
                      errorCode: "TOKEN_IN_BLACKLIST",
                      errorMessage: "Token in the backlist",
                    },
                  },
                },
                TokenExpiredVerify: {
                  description: "Token hết hạn",
                  value: {
                    status: 401,
                    error: {
                      errorCode: "TOKEN_EXPIRED",
                      errorMessage: "Token has expired",
                    },
                  },
                },
                TokenInvalidVerify: {
                  description: "Token không hợp lệ",
                  value: {
                    status: 401,
                    error: {
                      errorCode: "TOKEN_INVALID",
                      errorMessage: "You are not authenticated",
                    },
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
                $ref: "#/components/schemas/ErrorServerResponse",
              },
            },
          },
        },
      },
    },
  },
  "/api/product/id/{productId}": {
    get: {
      summary: "Tìm sản phẩm bằng productId",
      description: "Tìm sản phẩm bằng productId",
      tags: ["Product"],
      operationId: "getProductById",
      security: [
        {
          BearerAuth: [],
        },
      ],
      parameters: [
        {
          name: "productId",
          in: "path",
          require: "true",
          schema: {
            $ref: "#/components/schemas/IdParams",
          },
        },
      ],
      responses: {
        200: {
          description: "Hiển thị thông tin sản phẩm đã tìm kiếm",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/GetProductBySlugResponse",
              },
            },
          },
        },
        404: {
          description: "Không tìm thấy sản phẩm",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/ProductNotFound",
              },
            },
          },
        },
        401: {
          description: "Lỗi yêu cầu không hợp lệ",
          content: {
            "application/json": {
              oneOf: [
                {
                  description: "Token đang nằm trong Black List",
                  schema: {
                    $ref: "#/components/schemas/TokenBlackListVerify",
                  },
                },
                {
                  description: "Token hết hạn",
                  schema: {
                    $ref: "#/components/schemas/TokenExpiredVerify",
                  },
                },
                {
                  description: "Token không hợp lệ",
                  schema: {
                    $ref: "#/components/schemas/TokenInvalidVerify",
                  },
                },
              ],
              examples: {
                TokenBlackListVerify: {
                  description: "Token đang nằm trong Black List",
                  value: {
                    status: 401,
                    error: {
                      errorCode: "TOKEN_IN_BLACKLIST",
                      errorMessage: "Token in the backlist",
                    },
                  },
                },
                TokenExpiredVerify: {
                  description: "Token hết hạn",
                  value: {
                    status: 401,
                    error: {
                      errorCode: "TOKEN_EXPIRED",
                      errorMessage: "Token has expired",
                    },
                  },
                },
                TokenInvalidVerify: {
                  description: "Token không hợp lệ",
                  value: {
                    status: 401,
                    error: {
                      errorCode: "TOKEN_INVALID",
                      errorMessage: "You are not authenticated",
                    },
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
                $ref: "#/components/schemas/ErrorServerResponse",
              },
            },
          },
        },
      },
    },
  },
  "/api/product/search-products": {
    post: {
      summary: "Tìm tất cả sản phẩm bằng tên",
      description: "Tìm tất cả sản phẩm bằng tên",
      tags: ["Product"],
      operationId: "getByNameProduct",
      security: [
        {
          BearerAuth: [],
        },
      ],
      requestBody: {
        required: true,
        content: {
          "multipart/form-data": {
            schema: {
              $ref: "#/components/schemas/SearchProductRequest",
            },
          },
        },
      },
      responses: {
        200: {
          description: "Hiển thị tất cả sản phẩm có tên",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/GetAllProducts",
              },
            },
          },
        },
        404: {
          description: "Không tìm thấy sản phẩm",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/ProductNotFound",
              },
            },
          },
        },
        401: {
          description: "Lỗi yêu cầu không hợp lệ",
          content: {
            "application/json": {
              oneOf: [
                {
                  description: "Token đang nằm trong Black List",
                  schema: {
                    $ref: "#/components/schemas/TokenBlackListVerify",
                  },
                },
                {
                  description: "Token hết hạn",
                  schema: {
                    $ref: "#/components/schemas/TokenExpiredVerify",
                  },
                },
                {
                  description: "Token không hợp lệ",
                  schema: {
                    $ref: "#/components/schemas/TokenInvalidVerify",
                  },
                },
              ],
              examples: {
                TokenBlackListVerify: {
                  description: "Token đang nằm trong Black List",
                  value: {
                    status: 401,
                    error: {
                      errorCode: "TOKEN_IN_BLACKLIST",
                      errorMessage: "Token in the backlist",
                    },
                  },
                },
                TokenExpiredVerify: {
                  description: "Token hết hạn",
                  value: {
                    status: 401,
                    error: {
                      errorCode: "TOKEN_EXPIRED",
                      errorMessage: "Token has expired",
                    },
                  },
                },
                TokenInvalidVerify: {
                  description: "Token không hợp lệ",
                  value: {
                    status: 401,
                    error: {
                      errorCode: "TOKEN_INVALID",
                      errorMessage: "You are not authenticated",
                    },
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
                $ref: "#/components/schemas/ErrorServerResponse",
              },
            },
          },
        },
      },
    },
  },
  "/api/product/create": {
    post: {
      summary: "Tạo sản phẩm",
      description: "Tạo sản phẩm",
      tags: ["Product"],
      operationId: "createProduct",
      security: [
        {
          BearerAuth: [],
        },
      ],
      requestBody: {
        required: true,
        content: {
          "multipart/form-data": {
            schema: {
              $ref: "#/components/schemas/CreateOrUpdateProductRequest",
            },
          },
        },
      },
      responses: {
        201: {
          description: "Tạo danh mục thành công",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/CreateOrUpdateProductResponse",
              },
            },
          },
        },
        400: {
          description: "Lỗi yêu cầu không hợp lệ",
          content: {
            "application/json": {
              oneOf: [
                {
                  description:
                    "Tạo giảm giá sản phẩm nhưng thiếu kiểu giảm và ngày bắt đầu và ngày kết thúc",
                  schema: {
                    $ref: "#/components/schemas/MissingFieldDiscountValidate",
                  },
                },
                {
                  description: "Ngày giảm giá không hợp lệ",
                  schema: {
                    $ref: "#/components/schemas/DiscountInvalidDate",
                  },
                },
                {
                  description: "Thiếu các trường bắt buộc",
                  schema: {
                    $ref: "#/components/schemas/MissingFieldsValidate",
                  },
                },
              ],
              examples: {
                MissingFieldDiscountValidate: {
                  description:
                    "Tạo giảm giá sản phẩm nhưng thiếu kiểu giảm và ngày bắt đầu và ngày kết thúc",
                  value: {
                    status: 400,
                    error: {
                      errorCode: "CREATE_DISCOUNT_MISSING_REQUIRED_FIELDS",
                      errorMessage:
                        "You need to create a discount type, a discount start date and a discount end date",
                    },
                  },
                },
                DiscountInvalidDate: {
                  description: "Ngày giảm giá không hợp lệ",
                  value: {
                    status: 400,
                    error: {
                      errorCode: "DISCOUNT_INVALID_DATE_RANGE",
                      errorMessage:
                        "You need to create a discount end date that is less than the discount start date",
                    },
                  },
                },
                MissingFieldsValidate: {
                  description: "Thiếu các trường bắt buộc",
                  value: {
                    status: 400,
                    error: {
                      errorCode: "MISSING_FIELD",
                      errorMessage:
                        "The field 'FIELD_NAME' is required and cannot be empty",
                    },
                  },
                },
              },
            },
          },
        },
        401: {
          description: "Lỗi yêu cầu không hợp lệ",
          content: {
            "application/json": {
              oneOf: [
                {
                  description: "Token đang nằm trong Black List",
                  schema: {
                    $ref: "#/components/schemas/TokenBlackListVerify",
                  },
                },
                {
                  description: "Token hết hạn",
                  schema: {
                    $ref: "#/components/schemas/TokenExpiredVerify",
                  },
                },
                {
                  description: "Token không hợp lệ",
                  schema: {
                    $ref: "#/components/schemas/TokenInvalidVerify",
                  },
                },
              ],
              examples: {
                TokenBlackListVerify: {
                  description: "Token đang nằm trong Black List",
                  value: {
                    status: 401,
                    error: {
                      errorCode: "TOKEN_IN_BLACKLIST",
                      errorMessage: "Token in the backlist",
                    },
                  },
                },
                TokenExpiredVerify: {
                  description: "Token hết hạn",
                  value: {
                    status: 401,
                    error: {
                      errorCode: "TOKEN_EXPIRED",
                      errorMessage: "Token has expired",
                    },
                  },
                },
                TokenInvalidVerify: {
                  description: "Token không hợp lệ",
                  value: {
                    status: 401,
                    error: {
                      errorCode: "TOKEN_INVALID",
                      errorMessage: "You are not authenticated",
                    },
                  },
                },
              },
            },
          },
        },
        404: {
          description: "Không tìm thấy Shop",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/ShopNotFound",
              },
            },
          },
        },
        500: {
          description: "Lỗi server",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/ErrorServerResponse",
              },
            },
          },
        },
      },
    },
  },
  "/api/product/update/{slug}": {
    put: {
      summary: "Cập nhật sản phẩm",
      description: "Cập nhật sản phẩm bằng slug",
      tags: ["Product"],
      operationId: "updataProduct",
      security: [
        {
          BearerAuth: [],
        },
      ],
      parameters: [
        {
          name: "slug",
          in: "path",
          require: "true",
          schema: {
            $ref: "#/components/schemas/slugParams",
          },
        },
      ],
      requestBody: {
        required: true,
        content: {
          "multipart/form-data": {
            schema: {
              $ref: "#/components/schemas/CreateOrUpdateProductRequest",
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
                $ref: "#/components/schemas/UpdateProductBySlugResponse",
              },
            },
          },
        },
        400: {
          description: "Thiếu trường bắt buộc",
          content: {
            "application/json": {
              schema: {
                $ref: "#components/schemas/MissingFieldsValidate",
              },
            },
          },
        },
        401: {
          description: "Lỗi yêu cầu không hợp lệ",
          content: {
            "application/json": {
              oneOf: [
                {
                  description: "Token đang nằm trong Black List",
                  schema: {
                    $ref: "#/components/schemas/TokenBlackListVerify",
                  },
                },
                {
                  description: "Token hết hạn",
                  schema: {
                    $ref: "#/components/schemas/TokenExpiredVerify",
                  },
                },
                {
                  description: "Token không hợp lệ",
                  schema: {
                    $ref: "#/components/schemas/TokenInvalidVerify",
                  },
                },
              ],
              examples: {
                TokenBlackListVerify: {
                  description: "Token đang nằm trong Black List",
                  value: {
                    status: 401,
                    error: {
                      errorCode: "TOKEN_IN_BLACKLIST",
                      errorMessage: "Token in the backlist",
                    },
                  },
                },
                TokenExpiredVerify: {
                  description: "Token hết hạn",
                  value: {
                    status: 401,
                    error: {
                      errorCode: "TOKEN_EXPIRED",
                      errorMessage: "Token has expired",
                    },
                  },
                },
                TokenInvalidVerify: {
                  description: "Token không hợp lệ",
                  value: {
                    status: 401,
                    error: {
                      errorCode: "TOKEN_INVALID",
                      errorMessage: "You are not authenticated",
                    },
                  },
                },
              },
            },
          },
        },
        404: {
          description: "Không tìm thấy sản phẩm",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/ProductNotFound",
              },
            },
          },
        },
        500: {
          description: "Lỗi server",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/ErrorServerResponse",
              },
            },
          },
        },
      },
    },
  },
  "/api/product/delete/{slug}": {
    delete: {
      summary: "Xóa sản phẩm bằng slug",
      description: "Xóa sản phẩm bằng slug",
      tags: ["Product"],
      operationId: "deleteProductBySlug",
      security: [
        {
          BearerAuth: [],
        },
      ],
      parameters: [
        {
          name: "slug",
          in: "path",
          require: "true",
          schema: {
            $ref: "#/components/schemas/slugParams",
          },
        },
      ],
      responses: {
        200: {
          description: "Xóa sản phẩm thành công",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/DeleteProductResponse",
              },
            },
          },
        },
        404: {
          description: "Không tìm thấy sản phẩm",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/ProductNotFound",
              },
            },
          },
        },
        401: {
          description: "Lỗi yêu cầu không hợp lệ",
          content: {
            "application/json": {
              oneOf: [
                {
                  description: "Token đang nằm trong Black List",
                  schema: {
                    $ref: "#/components/schemas/TokenBlackListVerify",
                  },
                },
                {
                  description: "Token hết hạn",
                  schema: {
                    $ref: "#/components/schemas/TokenExpiredVerify",
                  },
                },
                {
                  description: "Token không hợp lệ",
                  schema: {
                    $ref: "#/components/schemas/TokenInvalidVerify",
                  },
                },
              ],
              examples: {
                TokenBlackListVerify: {
                  description: "Token đang nằm trong Black List",
                  value: {
                    status: 401,
                    error: {
                      errorCode: "TOKEN_IN_BLACKLIST",
                      errorMessage: "Token in the backlist",
                    },
                  },
                },
                TokenExpiredVerify: {
                  description: "Token hết hạn",
                  value: {
                    status: 401,
                    error: {
                      errorCode: "TOKEN_EXPIRED",
                      errorMessage: "Token has expired",
                    },
                  },
                },
                TokenInvalidVerify: {
                  description: "Token không hợp lệ",
                  value: {
                    status: 401,
                    error: {
                      errorCode: "TOKEN_INVALID",
                      errorMessage: "You are not authenticated",
                    },
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
                $ref: "#/components/schemas/ErrorServerResponse",
              },
            },
          },
        },
      },
    },
  },
  "/api/product/create-rating/{productId}": {
    post: {
      summary: "Đánh giá sản phẩm",
      description: "Đánh giá sản phẩm",
      tags: ["Product"],
      operationId: "createRating",
      security: [
        {
          BearerAuth: [],
        },
      ],
      parameters: [
        {
          name: "productId",
          in: "path",
          require: "true",
          schema: {
            $ref: "#/components/schemas/IdParams",
          },
        },
      ],
      requestBody: {
        required: true,
        content: {
          "multipart/form-data": {
            schema: {
              $ref: "#/components/schemas/CreateRatingRequest",
            },
          },
        },
      },
      responses: {
        200: {
          description: "Đánh giá thành công",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/CreateRatingResponse",
              },
            },
          },
        },
        400: {
          description: "Bạn phải trọn đánh giá mấy sao",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/InvalidRating",
              },
            },
          },
        },
        401: {
          description: "Lỗi yêu cầu không hợp lệ",
          content: {
            "application/json": {
              oneOf: [
                {
                  description: "Token đang nằm trong Black List",
                  schema: {
                    $ref: "#/components/schemas/TokenBlackListVerify",
                  },
                },
                {
                  description: "Token hết hạn",
                  schema: {
                    $ref: "#/components/schemas/TokenExpiredVerify",
                  },
                },
                {
                  description: "Token không hợp lệ",
                  schema: {
                    $ref: "#/components/schemas/TokenInvalidVerify",
                  },
                },
              ],
              examples: {
                TokenBlackListVerify: {
                  description: "Token đang nằm trong Black List",
                  value: {
                    status: 401,
                    error: {
                      errorCode: "TOKEN_IN_BLACKLIST",
                      errorMessage: "Token in the backlist",
                    },
                  },
                },
                TokenExpiredVerify: {
                  description: "Token hết hạn",
                  value: {
                    status: 401,
                    error: {
                      errorCode: "TOKEN_EXPIRED",
                      errorMessage: "Token has expired",
                    },
                  },
                },
                TokenInvalidVerify: {
                  description: "Token không hợp lệ",
                  value: {
                    status: 401,
                    error: {
                      errorCode: "TOKEN_INVALID",
                      errorMessage: "You are not authenticated",
                    },
                  },
                },
              },
            },
          },
        },
        404: {
          description: "Không tìm thấy sản phẩm",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/ProductNotFound",
              },
            },
          },
        },
        500: {
          description: "Lỗi server",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/ErrorServerResponse",
              },
            },
          },
        },
      },
    },
  },
  "/api/product/rating/{productId}": {
    get: {
      summary: "Hiển thị tất cả đánh giá của sản phẩm",
      description: "Hiển thị tât cả đánh giá sản phẩm",
      tags: ["Product"],
      operationId: "getAllRatingOfProduct",
      security: [
        {
          BearerAuth: [],
        },
      ],
      parameters: [
        {
          name: "productId",
          in: "path",
          require: "true",
          schema: {
            $ref: "#/components/schemas/IdParams",
          },
        },
      ],
      responses: {
        200: {
          description: "Hiển thị tất cả đánh giá của sản phẩm",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/GetAllRatingOfProductResponse",
              },
            },
          },
        },
        401: {
          description: "Lỗi yêu cầu không hợp lệ",
          content: {
            "application/json": {
              oneOf: [
                {
                  description: "Token đang nằm trong Black List",
                  schema: {
                    $ref: "#/components/schemas/TokenBlackListVerify",
                  },
                },
                {
                  description: "Token hết hạn",
                  schema: {
                    $ref: "#/components/schemas/TokenExpiredVerify",
                  },
                },
                {
                  description: "Token không hợp lệ",
                  schema: {
                    $ref: "#/components/schemas/TokenInvalidVerify",
                  },
                },
              ],
              examples: {
                TokenBlackListVerify: {
                  description: "Token đang nằm trong Black List",
                  value: {
                    status: 401,
                    error: {
                      errorCode: "TOKEN_IN_BLACKLIST",
                      errorMessage: "Token in the backlist",
                    },
                  },
                },
                TokenExpiredVerify: {
                  description: "Token hết hạn",
                  value: {
                    status: 401,
                    error: {
                      errorCode: "TOKEN_EXPIRED",
                      errorMessage: "Token has expired",
                    },
                  },
                },
                TokenInvalidVerify: {
                  description: "Token không hợp lệ",
                  value: {
                    status: 401,
                    error: {
                      errorCode: "TOKEN_INVALID",
                      errorMessage: "You are not authenticated",
                    },
                  },
                },
              },
            },
          },
        },
        404: {
          description: "Không có đánh giá sản phẩm",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/ProductNotRating",
              },
            },
          },
        },
        500: {
          description: "Lỗi server",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/ErrorServerResponse",
              },
            },
          },
        },
      },
    },
  },

  "/api/cart": {
    get: {
      summary: "Hiển thị tất cả sản phẩm trong giỏ hàng",
      description: "Hiển thị tât cả sản phẩm trong giỏ hàng",
      tags: ["Cart"],
      operationId: "getAllProductOfCart",
      security: [
        {
          BearerAuth: [],
        },
      ],
      responses: {
        200: {
          description: "Hiển thị tất cả sản phẩm có trong giỏ hàng",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/GetAllProductInCartResponse",
              },
            },
          },
        },
        401: {
          description: "Lỗi yêu cầu không hợp lệ",
          content: {
            "application/json": {
              oneOf: [
                {
                  description: "Token đang nằm trong Black List",
                  schema: {
                    $ref: "#/components/schemas/TokenBlackListVerify",
                  },
                },
                {
                  description: "Token hết hạn",
                  schema: {
                    $ref: "#/components/schemas/TokenExpiredVerify",
                  },
                },
                {
                  description: "Token không hợp lệ",
                  schema: {
                    $ref: "#/components/schemas/TokenInvalidVerify",
                  },
                },
              ],
              examples: {
                TokenBlackListVerify: {
                  description: "Token đang nằm trong Black List",
                  value: {
                    status: 401,
                    error: {
                      errorCode: "TOKEN_IN_BLACKLIST",
                      errorMessage: "Token in the backlist",
                    },
                  },
                },
                TokenExpiredVerify: {
                  description: "Token hết hạn",
                  value: {
                    status: 401,
                    error: {
                      errorCode: "TOKEN_EXPIRED",
                      errorMessage: "Token has expired",
                    },
                  },
                },
                TokenInvalidVerify: {
                  description: "Token không hợp lệ",
                  value: {
                    status: 401,
                    error: {
                      errorCode: "TOKEN_INVALID",
                      errorMessage: "You are not authenticated",
                    },
                  },
                },
              },
            },
          },
        },
        404: {
          description: "Thêm sản phẩm để tạo giỏ hàng",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/ProductNotFound",
              },
            },
          },
        },
        500: {
          description: "Lỗi server",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/ErrorServerResponse",
              },
            },
          },
        },
      },
    },
  },
  "/api/cart/item": {
    post: {
      summary: "Thêm sản phẩm vào giỏ hàng",
      description: "Thêm sản phẩm vào giỏ hàng",
      tags: ["Cart"],
      operationId: "addProductToCart",
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
              $ref: "#/components/schemas/AddProductToCartRequest",
            },
          },
        },
      },
      responses: {
        200: {
          description: "Thêm sản phẩm vào giỏ hàng thành công",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/AddAndUpdateProductToCartResponse",
              },
            },
          },
        },
        401: {
          description: "Lỗi yêu cầu không hợp lệ",
          content: {
            "application/json": {
              oneOf: [
                {
                  description: "Token đang nằm trong Black List",
                  schema: {
                    $ref: "#/components/schemas/TokenBlackListVerify",
                  },
                },
                {
                  description: "Token hết hạn",
                  schema: {
                    $ref: "#/components/schemas/TokenExpiredVerify",
                  },
                },
                {
                  description: "Token không hợp lệ",
                  schema: {
                    $ref: "#/components/schemas/TokenInvalidVerify",
                  },
                },
              ],
              examples: {
                TokenBlackListVerify: {
                  description: "Token đang nằm trong Black List",
                  value: {
                    status: 401,
                    error: {
                      errorCode: "TOKEN_IN_BLACKLIST",
                      errorMessage: "Token in the backlist",
                    },
                  },
                },
                TokenExpiredVerify: {
                  description: "Token hết hạn",
                  value: {
                    status: 401,
                    error: {
                      errorCode: "TOKEN_EXPIRED",
                      errorMessage: "Token has expired",
                    },
                  },
                },
                TokenInvalidVerify: {
                  description: "Token không hợp lệ",
                  value: {
                    status: 401,
                    error: {
                      errorCode: "TOKEN_INVALID",
                      errorMessage: "You are not authenticated",
                    },
                  },
                },
              },
            },
          },
        },
        404: {
          description: "Không có đánh giá sản phẩm",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/ProductNotRating",
              },
            },
          },
        },
        500: {
          description: "Lỗi server",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/ErrorServerResponse",
              },
            },
          },
        },
      },
    },
  },
  "/api/cart/items": {
    delete: {
      summary: "Xóa nhiều sản phẩm trong giỏ hàng",
      description: "Xóa nhiều sản phẩm trong giỏ hàng",
      tags: ["Cart"],
      operationId: "deleteAllSelected",
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
              $ref: "#/components/schemas/DeleteAllSelectedRequest",
            },
          },
        },
      },
      responses: {
        200: {
          description: "Xóa nhiều sản phẩm trong giỏ hàng thành công",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/DeleteCartOptionResponse",
              },
            },
          },
        },
        401: {
          description: "Lỗi yêu cầu không hợp lệ",
          content: {
            "application/json": {
              oneOf: [
                {
                  description: "Token đang nằm trong Black List",
                  schema: {
                    $ref: "#/components/schemas/TokenBlackListVerify",
                  },
                },
                {
                  description: "Token hết hạn",
                  schema: {
                    $ref: "#/components/schemas/TokenExpiredVerify",
                  },
                },
                {
                  description: "Token không hợp lệ",
                  schema: {
                    $ref: "#/components/schemas/TokenInvalidVerify",
                  },
                },
              ],
              examples: {
                TokenBlackListVerify: {
                  description: "Token đang nằm trong Black List",
                  value: {
                    status: 401,
                    error: {
                      errorCode: "TOKEN_IN_BLACKLIST",
                      errorMessage: "Token in the backlist",
                    },
                  },
                },
                TokenExpiredVerify: {
                  description: "Token hết hạn",
                  value: {
                    status: 401,
                    error: {
                      errorCode: "TOKEN_EXPIRED",
                      errorMessage: "Token has expired",
                    },
                  },
                },
                TokenInvalidVerify: {
                  description: "Token không hợp lệ",
                  value: {
                    status: 401,
                    error: {
                      errorCode: "TOKEN_INVALID",
                      errorMessage: "You are not authenticated",
                    },
                  },
                },
              },
            },
          },
        },
        404: {
          description: "Không tìm được sản phẩm cần xóa",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/CartOptionNotFound",
              },
            },
          },
        },
        500: {
          description: "Lỗi server",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/ErrorServerResponse",
              },
            },
          },
        },
      },
    },
  },
  "/api/cart/items/{cartItemId}": {
    delete: {
      summary: "Xóa sản phẩm trong giỏ hàng",
      description: "Xóa sản phẩm trong giỏ hàng",
      tags: ["Cart"],
      operationId: "deleteProductInCart",
      security: [
        {
          BearerAuth: [],
        },
      ],
      parameters: [
        {
          name: "cartItemId",
          in: "path",
          require: "true",
          schema: {
            $ref: "#/components/schemas/IdParams",
          },
        },
      ],
      responses: {
        200: {
          description: "Xóa sản phẩm trong giỏ hàng thành công",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/DeleteCartOptionResponse",
              },
            },
          },
        },
        401: {
          description: "Lỗi yêu cầu không hợp lệ",
          content: {
            "application/json": {
              oneOf: [
                {
                  description: "Token đang nằm trong Black List",
                  schema: {
                    $ref: "#/components/schemas/TokenBlackListVerify",
                  },
                },
                {
                  description: "Token hết hạn",
                  schema: {
                    $ref: "#/components/schemas/TokenExpiredVerify",
                  },
                },
                {
                  description: "Token không hợp lệ",
                  schema: {
                    $ref: "#/components/schemas/TokenInvalidVerify",
                  },
                },
              ],
              examples: {
                TokenBlackListVerify: {
                  description: "Token đang nằm trong Black List",
                  value: {
                    status: 401,
                    error: {
                      errorCode: "TOKEN_IN_BLACKLIST",
                      errorMessage: "Token in the backlist",
                    },
                  },
                },
                TokenExpiredVerify: {
                  description: "Token hết hạn",
                  value: {
                    status: 401,
                    error: {
                      errorCode: "TOKEN_EXPIRED",
                      errorMessage: "Token has expired",
                    },
                  },
                },
                TokenInvalidVerify: {
                  description: "Token không hợp lệ",
                  value: {
                    status: 401,
                    error: {
                      errorCode: "TOKEN_INVALID",
                      errorMessage: "You are not authenticated",
                    },
                  },
                },
              },
            },
          },
        },
        404: {
          description: "Không tìm được sản phẩm cần xóa",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/CartOptionNotFound",
              },
            },
          },
        },
        500: {
          description: "Lỗi server",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/ErrorServerResponse",
              },
            },
          },
        },
      },
    },
    put: {
      summary: "Cập nhật sản phẩm trong giỏ hàng",
      description: "Cập nhật sản phẩm trong giỏ hàng",
      tags: ["Cart"],
      operationId: "updateProductInCart",
      security: [
        {
          BearerAuth: [],
        },
      ],
      parameters: [
        {
          name: "cartItemId",
          in: "path",
          require: "true",
          schema: {
            $ref: "#/components/schemas/IdParams",
          },
        },
      ],
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              $ref: "#/components/schemas/UpdateCartItemRequest",
            },
          },
        },
      },
      responses: {
        200: {
          description: "Cập nhật sản phẩm trong giỏ hàng thành công",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/AddAndUpdateProductToCartResponse",
              },
            },
          },
        },
        401: {
          description: "Lỗi yêu cầu không hợp lệ",
          content: {
            "application/json": {
              oneOf: [
                {
                  description: "Token đang nằm trong Black List",
                  schema: {
                    $ref: "#/components/schemas/TokenBlackListVerify",
                  },
                },
                {
                  description: "Token hết hạn",
                  schema: {
                    $ref: "#/components/schemas/TokenExpiredVerify",
                  },
                },
                {
                  description: "Token không hợp lệ",
                  schema: {
                    $ref: "#/components/schemas/TokenInvalidVerify",
                  },
                },
              ],
              examples: {
                TokenBlackListVerify: {
                  description: "Token đang nằm trong Black List",
                  value: {
                    status: 401,
                    error: {
                      errorCode: "TOKEN_IN_BLACKLIST",
                      errorMessage: "Token in the backlist",
                    },
                  },
                },
                TokenExpiredVerify: {
                  description: "Token hết hạn",
                  value: {
                    status: 401,
                    error: {
                      errorCode: "TOKEN_EXPIRED",
                      errorMessage: "Token has expired",
                    },
                  },
                },
                TokenInvalidVerify: {
                  description: "Token không hợp lệ",
                  value: {
                    status: 401,
                    error: {
                      errorCode: "TOKEN_INVALID",
                      errorMessage: "You are not authenticated",
                    },
                  },
                },
              },
            },
          },
        },
        404: {
          description: "Không tìm được sản phẩm cần xóa",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/CartOptionNotFound",
              },
            },
          },
        },
        500: {
          description: "Lỗi server",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/ErrorServerResponse",
              },
            },
          },
        },
      },
    },
  },

  "/api/checkout/cart-and-shipping": {
    post: {
      summary: "Hiển thị sản phẩm đã trọn trong giỏ hàng",
      description: "Hiển thị sản phẩm đã trọn trong giỏ hàng",
      tags: ["Checkout"],
      operationId: "getAllSelected",
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
              $ref: "#/components/schemas/GetAllSelectedRequest",
            },
          },
        },
      },
      responses: {
        200: {
          description:
            "Hiển thị sản phẩm trong giỏ hàng và phí vận chuyển thành công",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/GetAllSelectedResponse",
              },
            },
          },
        },
        401: {
          description: "Lỗi yêu cầu không hợp lệ",
          content: {
            "application/json": {
              oneOf: [
                {
                  description: "Token đang nằm trong Black List",
                  schema: {
                    $ref: "#/components/schemas/TokenBlackListVerify",
                  },
                },
                {
                  description: "Token hết hạn",
                  schema: {
                    $ref: "#/components/schemas/TokenExpiredVerify",
                  },
                },
                {
                  description: "Token không hợp lệ",
                  schema: {
                    $ref: "#/components/schemas/TokenInvalidVerify",
                  },
                },
              ],
              examples: {
                TokenBlackListVerify: {
                  description: "Token đang nằm trong Black List",
                  value: {
                    status: 401,
                    error: {
                      errorCode: "TOKEN_IN_BLACKLIST",
                      errorMessage: "Token in the backlist",
                    },
                  },
                },
                TokenExpiredVerify: {
                  description: "Token hết hạn",
                  value: {
                    status: 401,
                    error: {
                      errorCode: "TOKEN_EXPIRED",
                      errorMessage: "Token has expired",
                    },
                  },
                },
                TokenInvalidVerify: {
                  description: "Token không hợp lệ",
                  value: {
                    status: 401,
                    error: {
                      errorCode: "TOKEN_INVALID",
                      errorMessage: "You are not authenticated",
                    },
                  },
                },
              },
            },
          },
        },
        404: {
          description: "Không tìm được sản phẩm cần xóa",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/CartOptionNotFound",
              },
            },
          },
        },
        500: {
          description: "Lỗi server",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/ErrorServerResponse",
              },
            },
          },
        },
      },
    },
  },
  "/api/checkout/create": {
    post: {
      summary: "Thanh toán",
      description: "Thanh toán",
      tags: ["Checkout"],
      operationId: "createPayment",
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
              $ref: "#/components/schemas/CreateCheckoutRequest",
            },
          },
        },
      },
      responses: {
        200: {
          description: "Tạo hóa đơn thanh toán thành công",
          content: {
            "application/json": {
              schema: {
                oneOf: [
                  {
                    $ref: "#/components/schemas/CreateCheckoutResponse",
                  },
                  {
                    $ref: "#/components/schemas/CreateCheckoutDataNullResponse",
                  },
                ],
              },
            },
          },
        },
        401: {
          description: "Lỗi yêu cầu không hợp lệ",
          content: {
            "application/json": {
              oneOf: [
                {
                  description: "Token đang nằm trong Black List",
                  schema: {
                    $ref: "#/components/schemas/TokenBlackListVerify",
                  },
                },
                {
                  description: "Token hết hạn",
                  schema: {
                    $ref: "#/components/schemas/TokenExpiredVerify",
                  },
                },
                {
                  description: "Token không hợp lệ",
                  schema: {
                    $ref: "#/components/schemas/TokenInvalidVerify",
                  },
                },
              ],
              examples: {
                TokenBlackListVerify: {
                  description: "Token đang nằm trong Black List",
                  value: {
                    status: 401,
                    error: {
                      errorCode: "TOKEN_IN_BLACKLIST",
                      errorMessage: "Token in the backlist",
                    },
                  },
                },
                TokenExpiredVerify: {
                  description: "Token hết hạn",
                  value: {
                    status: 401,
                    error: {
                      errorCode: "TOKEN_EXPIRED",
                      errorMessage: "Token has expired",
                    },
                  },
                },
                TokenInvalidVerify: {
                  description: "Token không hợp lệ",
                  value: {
                    status: 401,
                    error: {
                      errorCode: "TOKEN_INVALID",
                      errorMessage: "You are not authenticated",
                    },
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
                $ref: "#/components/schemas/ErrorServerResponse",
              },
            },
          },
        },
      },
    },
  },

  "/api/order/create": {
    post: {
      summary: "Tạo hóa đơn",
      description: "Tạo hóa đơn",
      tags: ["Order"],
      operationId: "createOrder",
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
              $ref: "#/components/schemas/CreateOrderRequest",
            },
          },
        },
      },
      responses: {
        200: {
          description: "Tạo hóa đơn thành công",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/CreateOrderResponse",
              },
            },
          },
        },
        401: {
          description: "Lỗi yêu cầu không hợp lệ",
          content: {
            "application/json": {
              oneOf: [
                {
                  description: "Token đang nằm trong Black List",
                  schema: {
                    $ref: "#/components/schemas/TokenBlackListVerify",
                  },
                },
                {
                  description: "Token hết hạn",
                  schema: {
                    $ref: "#/components/schemas/TokenExpiredVerify",
                  },
                },
                {
                  description: "Token không hợp lệ",
                  schema: {
                    $ref: "#/components/schemas/TokenInvalidVerify",
                  },
                },
              ],
              examples: {
                TokenBlackListVerify: {
                  description: "Token đang nằm trong Black List",
                  value: {
                    status: 401,
                    error: {
                      errorCode: "TOKEN_IN_BLACKLIST",
                      errorMessage: "Token in the backlist",
                    },
                  },
                },
                TokenExpiredVerify: {
                  description: "Token hết hạn",
                  value: {
                    status: 401,
                    error: {
                      errorCode: "TOKEN_EXPIRED",
                      errorMessage: "Token has expired",
                    },
                  },
                },
                TokenInvalidVerify: {
                  description: "Token không hợp lệ",
                  value: {
                    status: 401,
                    error: {
                      errorCode: "TOKEN_INVALID",
                      errorMessage: "You are not authenticated",
                    },
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
                $ref: "#/components/schemas/ErrorServerResponse",
              },
            },
          },
        },
      },
    },
  },

  "/api/banners": {
    get: {
      summary: "Lấy danh sách banner và sản phẩm ngẫu nhiên",
      tags: ["Banners"],
      responses: {
        200: {
          description: "Danh sách banner và sản phẩm ngẫu nhiên",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/GetBannersResponse",
              },
            },
          },
        },
        500: {
          description: "Lỗi server",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/ErrorResponse",
              },
            },
          },
        },
      },
    },
    post: {
      summary: "Thêm mới banner",
      tags: ["Banners"],
      requestBody: {
        required: true,
        content: {
          "multipart/form-data": {
            schema: {
              $ref: "#/components/schemas/BannerFormData",
            },
          },
        },
      },
      responses: {
        201: {
          description: "Banner đã được tạo",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/Banner",
              },
            },
          },
        },
        400: {
          description: "Dữ liệu không hợp lệ",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/ErrorResponse",
              },
            },
          },
        },
      },
    },
  },
  "/api/banners/{id}": {
    put: {
      summary: "Cập nhật banner",
      tags: ["Banners"],
      parameters: [
        {
          name: "id",
          in: "path",
          required: true,
          schema: {
            type: "string",
            format: "uuid",
          },
          example: "3f68d039-d850-48fb-b2e9-bfc9564e03ff",
        },
      ],
      requestBody: {
        required: true,
        content: {
          "multipart/form-data": {
            schema: {
              $ref: "#/components/schemas/BannerFormData",
            },
          },
        },
      },
      responses: {
        200: {
          description: "Banner đã được cập nhật",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/Banner",
              },
            },
          },
        },
        400: {
          description: "Dữ liệu không hợp lệ",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/ErrorResponse",
              },
            },
          },
        },
      },
    },
    delete: {
      summary: "Xóa banner",
      tags: ["Banners"],
      parameters: [
        {
          name: "id",
          in: "path",
          required: true,
          schema: {
            type: "integer",
          },
          example: 1,
        },
      ],
      responses: {
        200: {
          description: "Banner đã được xóa",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  message: {
                    type: "string",
                    example: "Banner deleted successfully",
                  },
                },
              },
            },
          },
        },
        404: {
          description: "Không tìm thấy banner",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/ErrorResponse",
              },
            },
          },
        },
      },
    },
  },
};
