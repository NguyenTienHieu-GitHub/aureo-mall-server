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
                $ref: "#/components/schemas/responseRegisterSuccess",
              },
            },
          },
        },
        401: {
          description: "Thiếu các trường bắt buộc",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/missingRequireFields",
              },
            },
          },
        },
        400: {
          description: "Mật khẩu không đúng định dạng",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/passwordRegexError",
              },
            },
          },
        },
        409: {
          description: "Email đăng ký đã tồn tại",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/passwordRegexError",
              },
            },
          },
        },
        500: {
          description: "Lỗi server",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/internalServerErrorResponse",
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
              $ref: "#/components/schemas/requestLogin",
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
                $ref: "#/components/schemas/responseLoginSuccess",
              },
            },
          },
        },
        400: {
          description: "Email hoặc mật khẩu không hợp lệ",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/emailOrPasswordFalse",
              },
            },
          },
        },
        401: {
          description: "Thiếu các trường bắt buộc",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/missingRequireFields",
              },
            },
          },
        },
        500: {
          description: "Lỗi server",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/internalServerErrorResponse",
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
                $ref: "#/components/schemas/responseRefreshSuccess",
              },
            },
          },
        },
        401: {
          description: "Không có refreshKey",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/refreshKeyNotInCookie",
              },
            },
          },
        },
        404: {
          description: "RefreshKey không tồn tại trong database",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/refreshKeyNotInDB",
              },
            },
          },
        },
        500: {
          description: "Lỗi server",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/internalServerErrorResponse",
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
                $ref: "#/components/schemas/responseLogoutSuccess",
              },
            },
          },
        },
        401: {
          description: "Không có refresh token",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/refreshKeyNotInCookie",
              },
            },
          },
        },
        500: {
          description: "Lỗi server",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/internalServerErrorResponse",
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
                $ref: "#/components/schemas/responseGetAllUserSuccess",
              },
            },
          },
        },
        404: {
          description: "Người dùng không tồn tại",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/userNotFound",
              },
            },
          },
        },
        500: {
          description: "Lỗi server",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/internalServerErrorResponse",
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
            $ref: "#/components/schemas/paramsIdFind",
          },
        },
      ],
      responses: {
        200: {
          description: "Hiển thị thông tin tài khoản thành công",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/responseGetUserByIdSuccess",
              },
            },
          },
        },
        400: {
          description: "Thiếu trường ID bắt buộc",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/missingRequireFields",
              },
            },
          },
        },
        400: {
          description: "ID người dùng không đúng định dạng",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/formatIdUser",
              },
            },
          },
        },
        404: {
          description: "Không tìm thấy người dùng",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/userNotFound",
              },
            },
          },
        },
        500: {
          description: "Lỗi server",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/internalServerErrorResponse",
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
                $ref: "#/components/schemas/responseGetMyInfo",
              },
            },
          },
        },
        404: {
          description: "Người dùng không tồn tại",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/userNotFound",
              },
            },
          },
        },
        500: {
          description: "Lỗi server",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/internalServerErrorResponse",
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
          "application/json": {
            schema: {
              $ref: "#/components/schemas/fieldUpdateAndCreateUserAdmin",
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
                $ref: "#/components/schemas/responseCreateSuccess",
              },
            },
          },
        },
        401: {
          description: "Thiếu các trường bắt buộc",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/missingRequireFields",
              },
            },
          },
        },
        409: {
          description: "Email đăng ký đã tồn tại",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/mailExists",
              },
            },
          },
        },
        500: {
          description: "Lỗi server",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/internalServerErrorResponse",
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
            $ref: "#/components/schemas/paramsIdDelete",
          },
        },
      ],
      responses: {
        200: {
          description: "Xóa tài khoản thành công",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/responseDeleteUserSuccess",
              },
            },
          },
        },
        400: {
          description: "Thiếu trường ID bắt buộc",
          content: {
            "application/json": {
              schema: {
                $ref: "#components/schemas/missingRequireFields",
              },
            },
          },
        },
        400: {
          description: "ID người dùng không đúng định dạng",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schema/formatIdUser",
              },
            },
          },
        },
        404: {
          description: "Người dùng không tồn tại",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schema/userNotFound",
              },
            },
          },
        },
        500: {
          description: "Lỗi server",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/internalServerErrorResponse",
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
                $ref: "#/components/schemas/responseDeleteMyUserSuccess",
              },
            },
          },
        },
        404: {
          description: "Người dùng không tồn tại",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/userNotFound",
              },
            },
          },
        },
        500: {
          description: "Lỗi server",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/internalServerErrorResponse",
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
              $ref: "#/components/schemas/fieldUpdateAndCreateUserAdmin",
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
                $ref: "#/components/schemas/responseUpdateUserByIdSuccess",
              },
            },
          },
        },
        400: {
          description: "Thiếu trường ID bắt buộc",
          content: {
            "application/json": {
              schema: {
                $ref: "#components/schemas/missingRequireFields",
              },
            },
          },
        },
        400: {
          description: "ID người dùng không đúng định dạng",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/formatIdUser",
              },
            },
          },
        },
        400: {
          description: "Mật khẩu không đúng định dạng",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/passwordRegexError",
              },
            },
          },
        },
        401: {
          description: "Thiếu các trường bắt buộc",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/missingRequireFields",
              },
            },
          },
        },
        404: {
          description: "Người dùng không tồn tại",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/userNotFound",
              },
            },
          },
        },
        409: {
          description: "Email đã tồn tại",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/mailExists",
              },
            },
          },
        },
        500: {
          description: "Lỗi server",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/internalServerErrorResponse",
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
              $ref: "#/components/schemas/fieldUpdateMyInfo",
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
                $ref: "#/components/schemas/responseUpdateMyInfoSuccess",
              },
            },
          },
        },
        400: {
          description: "Mật khẩu không đúng định dạng",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/passwordRegexError",
              },
            },
          },
        },
        404: {
          description: "Người dùng không tồn tại",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/userNotFound",
              },
            },
          },
        },
        409: {
          description: "Email đã tồn tại",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/mailExists",
              },
            },
          },
        },
        500: {
          description: "Lỗi server",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/internalServerErrorResponse",
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
      tags: ["Address"],
      operationId: "getAllAddress",
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
                $ref: "#/components/schemas/responseGetAllAddress",
              },
            },
          },
        },
        400: {
          description: "Không có địa chỉ",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/addressNotFound",
              },
            },
          },
        },
        500: {
          description: "Lỗi server",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/internalServerErrorResponse",
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
      tags: ["Address"],
      operationId: "getAddressById",
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
            $ref: "#/components/schemas/paramsIdFind",
          },
        },
      ],
      responses: {
        200: {
          description: "Hiển thị thông tin địa chỉ thành công",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/responseGetAddressById",
              },
            },
          },
        },
        400: {
          description: "Thiếu trường ID bắt buộc",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/missingRequireFields",
              },
            },
          },
        },
        404: {
          description: "Địa chỉ không tồn tại",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/addressNotFound",
              },
            },
          },
        },
        500: {
          description: "Lỗi server",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/internalServerErrorResponse",
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
      tags: ["Address"],
      operationId: "addAddress",
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
              $ref: "#/components/schemas/fieldUpdateAndCreateAddress",
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
                $ref: "#/components/schemas/responseCreateAddressSuccess",
              },
            },
          },
        },
        401: {
          description: "Thiếu các trường bắt buộc",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/missingRequireFields",
              },
            },
          },
        },
        400: {
          description: "Người dùng chưa được xác thực",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/userIdIsRequired",
              },
            },
          },
        },
        400: {
          description: "Tạo địa chỉ thất bại",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/errorCreateAddress",
              },
            },
          },
        },
        500: {
          description: "Lỗi server",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/internalServerErrorResponse",
              },
            },
          },
        },
      },
    },
  },
  "/api/address/update/{id}": {
    put: {
      summary: "Cập nhật tài khoản",
      description: "Cập nhật tài khoản bằng id",
      tags: ["User"],
      operationId: "updataAddress",
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
            $ref: "#/components/schemas/paramsIdFind",
          },
        },
      ],
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              $ref: "#/components/schemas/fieldUpdateAndCreateAddress",
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
                $ref: "#/components/schemas/responseUpdateAddressSuccess",
              },
            },
          },
        },
        400: {
          description: "Thiếu trường bắt buộc",
          content: {
            "application/json": {
              schema: {
                $ref: "#components/schemas/missingRequireFields",
              },
            },
          },
        },
        400: {
          description: "Người dùng chưa được xác thực",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/userIdIsRequired",
              },
            },
          },
        },
        404: {
          description: "Địa chỉ không tồn tại",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/addressNotFound",
              },
            },
          },
        },
        500: {
          description: "Lỗi server",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/internalServerErrorResponse",
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
      tags: ["Address"],
      operationId: "deleteAddress",
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
            $ref: "#/components/schemas/paramsIdDelete",
          },
        },
      ],
      responses: {
        200: {
          description: "Xóa địa chỉ thành công",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/responseDeleteAddressSuccess",
              },
            },
          },
        },
        400: {
          description: "Thiếu trường bắt buộc",
          content: {
            "application/json": {
              schema: {
                $ref: "#components/schemas/missingRequireFields",
              },
            },
          },
        },
        400: {
          description: "Người dùng chưa được xác thực",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/userIdIsRequired",
              },
            },
          },
        },
        404: {
          description: "Địa chỉ không tồn tại",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schema/addressNotFound",
              },
            },
          },
        },
        500: {
          description: "Lỗi server",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/internalServerErrorResponse",
              },
            },
          },
        },
      },
    },
  },
};
