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
              $ref: "#/components/schemas/requestRegistered",
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
            $ref: "#/components/schemas/paramsIdFindUser",
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
            $ref: "#/components/schemas/paramsIdDeleteUser",
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
            $ref: "#/components/schemas/paramsIdFindUser",
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
      tags: ["Address"],
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
            $ref: "#/components/schemas/paramsIdFindUser",
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
            $ref: "#/components/schemas/paramsIdFindUser",
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
  "/api/address/districts": {
    get: {
      summary: "Hiển thị tất cả Quận/Huyện",
      description: "Hiển thị tât cả Quận/Huyện",
      tags: ["Province"],
      operationId: "getDistrict",
      security: [
        {
          BearerAuth: [],
        },
      ],
      responses: {
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
  "/api/address/wards": {
    get: {
      summary: "Hiển thị tất cả Xã/Phường",
      description: "Hiển thị tât cả Xã/Phường",
      tags: ["Province"],
      operationId: "getWard",
      security: [
        {
          BearerAuth: [],
        },
      ],
      responses: {
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
  "/api/address/units": {
    get: {
      summary: "Hiển thị tất cả đơn vị hành chánh",
      description: "Hiển thị tât cả đơn vị hành chánh",
      tags: ["Province"],
      operationId: "getUnit",
      security: [
        {
          BearerAuth: [],
        },
      ],
      responses: {
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
  "/api/address/regions": {
    get: {
      summary: "Hiển thị tất cả khu vực",
      description: "Hiển thị tât cả khu vực",
      tags: ["Province"],
      operationId: "getRegion",
      security: [
        {
          BearerAuth: [],
        },
      ],
      responses: {
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
  "/api/address/my-address": {
    get: {
      summary: "Hiển thị tất cả địa chỉ của người dùng",
      description: "Hiển thị tât cả địa chỉ của người dùng",
      tags: ["Province"],
      operationId: "getMyAddress",
      security: [
        {
          BearerAuth: [],
        },
      ],
      responses: {
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
  "/api/address/districts/{provinceCode}": {
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
          name: "provinceCode",
          in: "path",
          require: "true",
          schema: {
            type: "string",
            description: "Nhập Id muốn tìm kiếm",
          },
        },
      ],
      responses: {
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
  "/api/address/wards/{districtCode}": {
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
          name: "districtCode",
          in: "path",
          require: "true",
          schema: {
            type: "string",
            description: "Nhập Id muốn tìm kiếm",
          },
        },
      ],
      responses: {
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

  "/api/category": {
    get: {
      summary: "Hiển thị tất cả danh mục",
      description: "Hiển thị tât cả danh mục",
      tags: ["Category"],
      operationId: "getAllCategory",
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
                type: "object",
                properties: {
                  status: {
                    type: "integer",
                    example: 200,
                  },
                  message: {
                    type: "string",
                    example: "Show all categories",
                  },
                  data: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        categoryId: {
                          type: "integer",
                          example: 7,
                        },
                        categoryName: {
                          type: "string",
                          example: "Áo Tee",
                        },
                        toggle: {
                          type: "boolean",
                          example: true,
                        },
                        updatedAt: {
                          type: "string",
                          format: "date-time",
                          example: "2024-10-22T12:23:30Z",
                        },
                        images: {
                          type: "array",
                          items: {
                            type: "string",
                            format: "uri",
                            example: "https://cf.shopee.sg/file/1002",
                          },
                        },
                        path: {
                          type: "array",
                          items: {
                            type: "object",
                            properties: {
                              categoryId: {
                                type: "integer",
                                example: 5,
                              },
                              categoryName: {
                                type: "string",
                                example: "Thời trang nam",
                              },
                            },
                          },
                        },
                      },
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
                $ref: "#/components/schemas/internalServerErrorResponse",
              },
            },
          },
        },
      },
    },
  },
  "/api/category/create": {
    post: {
      summary: "Tạo địa chỉ người dùng",
      description: "Tạo địa của người dùng",
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
          "application/json": {
            schema: {
              type: "object",
              properties: {
                categoryName: {
                  type: "string",
                  example: "Thời trang nữ",
                },
                parentId: {
                  type: "string",
                  example: "",
                },
                toggle: {
                  type: "boolean",
                  example: true, // Có thể sửa thành boolean nếu cần
                },
                imageUrls: {
                  type: "array",
                  items: {
                    type: "string",
                    format: "uri",
                    example: "https://cf.shopee.sg/file/1002",
                  },
                },
              },
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
                type: "object",
                properties: {
                  status: {
                    type: "integer",
                    example: 200,
                  },
                  message: {
                    type: "string",
                    example: "Category created successfully",
                  },
                  data: {
                    type: "object",
                    properties: {
                      categoryId: {
                        type: "integer",
                        example: 8,
                      },
                      categoryName: {
                        type: "string",
                        example: "Thời trang nữ",
                      },
                      toggle: {
                        type: "boolean",
                        example: true,
                      },
                      updatedAt: {
                        type: "string",
                        format: "date-time",
                        example: "2024-10-22T17:55:59Z",
                      },
                      images: {
                        type: "array",
                        items: {
                          type: "string",
                          format: "uri",
                          example: "https://cf.shopee.sg/file/1002",
                        },
                      },
                      path: {
                        type: "array",
                        items: {
                          type: "object",
                          properties: {
                            categoryId: {
                              type: "integer",
                              example: 8,
                            },
                            categoryName: {
                              type: "string",
                              example: "Thời trang nữ",
                            },
                          },
                        },
                      },
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
                $ref: "#/components/schemas/internalServerErrorResponse",
              },
            },
          },
        },
      },
    },
  },
  "/api/category/update/{categoryId}": {
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
            $ref: "#/components/schemas/paramsIdFind",
          },
        },
      ],
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              type: "object",
              properties: {
                categoryName: {
                  type: "string",
                  example: "Thời trang nữ",
                },
                parentId: {
                  type: "string",
                  example: "",
                },
                toggle: {
                  type: "boolean",
                  example: true, // Có thể sửa thành boolean nếu cần
                },
                imageUrls: {
                  type: "array",
                  items: {
                    type: "string",
                    format: "uri",
                    example: "https://cf.shopee.sg/file/1002",
                  },
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
                  status: {
                    type: "integer",
                    example: 200,
                  },
                  message: {
                    type: "string",
                    example: "Category created successfully",
                  },
                  data: {
                    type: "object",
                    properties: {
                      categoryId: {
                        type: "integer",
                        example: 8,
                      },
                      categoryName: {
                        type: "string",
                        example: "Thời trang nữ",
                      },
                      toggle: {
                        type: "boolean",
                        example: true,
                      },
                      updatedAt: {
                        type: "string",
                        format: "date-time",
                        example: "2024-10-22T17:55:59Z",
                      },
                      images: {
                        type: "array",
                        items: {
                          type: "string",
                          format: "uri",
                          example: "https://cf.shopee.sg/file/1002",
                        },
                      },
                      path: {
                        type: "array",
                        items: {
                          type: "object",
                          properties: {
                            categoryId: {
                              type: "integer",
                              example: 8,
                            },
                            categoryName: {
                              type: "string",
                              example: "Thời trang nữ",
                            },
                          },
                        },
                      },
                    },
                  },
                },
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
  "/api/category/delete/{categoryId}": {
    delete: {
      summary: "Xóa địa chỉ",
      description: "Xóa tài địa chỉ bằng id",
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
