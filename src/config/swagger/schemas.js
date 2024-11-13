module.exports = {
  components: {
    schemas: {
      //Params
      TokenParams: {
        type: "string",
        description: "Token nhận được qua email",
      },
      uuidParams: {
        type: "string",
        format: "uuid",
        description: "Nhập Id",
      },
      IdParams: {
        type: "integer",
        description: "Nhập Id",
      },
      slugParams: {
        type: "string",
        description: "Nhập slug",
      },
      // =================================================================================================

      //[Auth] Register
      RegisterUserRequest: {
        type: "object",
        properties: {
          firstName: {
            type: "string",
            example: "John",
          },
          lastName: {
            type: "string",
            example: "Doe",
          },
          email: {
            type: "string",
            example: "john.doe@example.com",
          },
          password: {
            type: "string",
            example: "your@Password123",
          },
        },
        required: ["email", "firstName", "lastName", "password"],
      },
      RegisterUserResponse: {
        type: "object",
        properties: {
          status: {
            type: "integer",
            example: 200,
          },
          message: {
            type: "string",
            example: "Registered account successfully",
          },
        },
      },
      //[Auth] Forget Password
      ForgetPasswordRequest: {
        type: "object",
        properties: {
          email: { type: "string", example: "john.doe@example.com" },
        },
        required: ["email"],
      },
      ForgetPasswordResponse: {
        type: "object",
        properties: {
          status: {
            type: "integer",
            example: 200,
          },
          message: {
            type: "string",
            example: "Password reset request has been sent to your email!",
          },
        },
      },
      ResetPasswordRequest: {
        type: "object",
        properties: {
          password: { type: "string", example: "your@NewPassword123" },
          confirmPassword: { type: "string", example: "your@NewPassword123" },
        },
        required: ["password", "confirmPassword"],
      },
      ResetPasswordResponse: {
        type: "object",
        properties: {
          status: {
            type: "integer",
            example: 200,
          },
          message: {
            type: "string",
            example: "Password reset successfully",
          },
        },
      },
      //[Auth] login
      LoginRequest: {
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
      LoginResponse: {
        type: "object",
        properties: {
          status: {
            type: "integer",
            example: 200,
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
                  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImQxNjEwNDllLTQwNGMtNGUxNy04ZDViLWVmYmM2MDEzODg3ZSIsImVtYWlsIjoidGllbmhpZXUya2szQGdtYWlsLmNvbSIsImlhdCI6MTczMTE2MDMzMiwiZXhwIjoxNzMxMTYwOTMyfQ.mWQ7s8OuVfI5MlnjlJzDgnkh1M_Pn8TCtbljLoNs-m0",
              },
            },
          },
        },
      },
      LoginCheck: {
        type: "object",
        properties: {
          status: {
            type: "integer",
            example: 401,
          },
          error: {
            type: "object",
            properties: {
              errorCode: {
                type: "string",
                example: "INVALID_EMAIL_OR_PASSWORD",
              },
              errorMessage: {
                type: "string",
                example: "Invalid email or password",
              },
            },
          },
        },
      },
      //[Auth] Refresh Token
      RefreshResponse: {
        type: "object",
        properties: {
          status: {
            type: "integer",
            example: 200,
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
                  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImQxNjEwNDllLTQwNGMtNGUxNy04ZDViLWVmYmM2MDEzODg3ZSIsImVtYWlsIjoidGllbmhpZXUya2szQGdtYWlsLmNvbSIsImlhdCI6MTczMTE2MDMzMiwiZXhwIjoxNzMxMTYwOTMyfQ.mWQ7s8OuVfI5MlnjlJzDgnkh1M_Pn8TCtbljLoNs-m0",
              },
            },
          },
        },
      },
      //[Auth] Logout
      LogoutResponse: {
        type: "object",
        properties: {
          status: {
            type: "integer",
            example: 200,
          },
          message: {
            type: "string",
            example: "Logout Successfully",
          },
          data: {
            type: "object",
            properties: {
              newAccessKey: {
                type: "string",
                example:
                  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImQxNjEwNDllLTQwNGMtNGUxNy04ZDViLWVmYmM2MDEzODg3ZSIsImVtYWlsIjoidGllbmhpZXUya2szQGdtYWlsLmNvbSIsImlhdCI6MTczMTE2MDMzMiwiZXhwIjoxNzMxMTYwOTMyfQ.mWQ7s8OuVfI5MlnjlJzDgnkh1M_Pn8TCtbljLoNs-m0",
              },
            },
          },
        },
      },
      // =================================================================================================

      //[Role] Get All Roles
      GetAllRolesResponse: {
        type: "object",
        properties: {
          status: {
            type: "integer",
            example: 200,
          },
          message: {
            type: "string",
            example: "Show all roles successfully",
          },
          data: {
            type: "array",
            items: {
              type: "object",
              properties: {
                createdAt: {
                  type: "string",
                  format: "date-time",
                  example: "2024-10-22T12:17:47Z",
                },
                updatedAt: {
                  type: "string",
                  format: "date-time",
                  example: "2024-10-22T12:17:47Z",
                },
                id: {
                  type: "integer",
                  example: 1,
                },
                roleName: {
                  type: "string",
                  example: "Admin",
                },
                description: {
                  type: "string",
                  example: "Administrator",
                },
              },
            },
          },
        },
      },
      RoleNotFound: {
        type: "object",
        properties: {
          status: {
            type: "integer",
            example: 404,
          },
          error: {
            type: "object",
            properties: {
              errorCode: {
                type: "string",
                example: "ROLE_NOT_FOUND",
              },
              errorMessage: {
                type: "string",
                example: "Roles not found in the database",
              },
            },
          },
        },
      },
      //[Role] Get Role By Id
      GetRoleByIdResponse: {
        type: "object",
        properties: {
          status: {
            type: "integer",
            example: 200,
          },
          message: {
            type: "string",
            example: "Show role successfully",
          },
          data: {
            type: "object",
            properties: {
              createdAt: {
                type: "string",
                format: "date-time",
                example: "2024-10-22T12:17:47Z",
              },
              updatedAt: {
                type: "string",
                format: "date-time",
                example: "2024-10-22T12:17:47Z",
              },
              id: {
                type: "integer",
                example: 1,
              },
              roleName: {
                type: "string",
                example: "Admin",
              },
              description: {
                type: "string",
                example: "Administrator",
              },
            },
          },
        },
      },
      //[Role] Create Or Update Role
      CreateOrUpdateRoleRequest: {
        type: "object",
        properties: {
          roleName: {
            type: "string",
            example: "Admin",
          },
          description: {
            type: "string",
            example: "Administrator",
          },
        },
      },
      CreateOrUpdateRoleResponse: {
        type: "object",
        properties: {
          status: {
            type: "integer",
            example: 201,
          },
          message: {
            type: "string",
            example: "Create or Update role successfully",
          },
          data: {
            type: "object",
            properties: {
              createdAt: {
                type: "string",
                format: "date-time",
                example: "2024-10-22T12:17:47Z",
              },
              updatedAt: {
                type: "string",
                format: "date-time",
                example: "2024-10-22T12:17:47Z",
              },
              id: {
                type: "integer",
                example: 1,
              },
              roleName: {
                type: "string",
                example: "Admin",
              },
              description: {
                type: "string",
                example: "Administrator",
              },
            },
          },
        },
      },
      //[Role] Delete Role
      DeleteRoleResponse: {
        type: "object",
        properties: {
          status: {
            type: "integer",
            example: 200,
          },
          message: {
            type: "string",
            example: "Role deleted successfully",
          },
        },
      },
      // ====================================================================================================

      //[User] Get All
      GetAllUserResponse: {
        type: "object",
        properties: {
          status: {
            type: "integer",
            example: 200,
          },
          message: {
            type: "string",
            example: "Show all users successfully",
          },
          data: {
            $ref: "#/components/schemas/DataUsers",
          },
        },
      },
      DataUsers: {
        oneOf: [{ type: "null" }, { type: "object" }],
        type: "array",
        items: {
          type: "object",
          properties: {
            userId: {
              type: "string",
              format: "uuid",
              example: "ababcbfb-f7b8-4d87-9c69-b1ae2355f565",
            },
            avatar: {
              type: "string",
              example:
                "https://res.cloudinary.com/dfkadlnoh/image/upload/v1730995424/avatars/y1svl2iaw0vikbup34dw.jpg",
            },
            fullName: {
              type: "string",
              example: "Admin Promax",
            },
            firstName: {
              type: "string",
              example: "Admin",
            },
            lastName: {
              type: "string",
              example: "Promax",
            },
            email: {
              type: "string",
              example: "admin@gmail.com",
            },
            roleList: {
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
      UserNotFound: {
        type: "object",
        properties: {
          status: {
            type: "integer",
            example: 404,
          },
          error: {
            type: "object",
            properties: {
              errorCode: {
                type: "string",
                example: "USER_NOT_FOUND",
              },
              errorMessage: {
                type: "string",
                example: "User not found in the database",
              },
            },
          },
        },
      },
      //[User] Get User By Id
      GetUserByIdResponse: {
        type: "object",
        properties: {
          status: {
            type: "integer",
            example: 200,
          },
          message: {
            type: "string",
            example: "Show user successfully",
          },
          data: {
            $ref: "#/components/schemas/DataUser",
          },
        },
      },
      //[User] Get My User
      GetMyUserResponse: {
        type: "object",
        properties: {
          status: {
            type: "integer",
            example: 200,
          },
          message: {
            type: "string",
            example: "User information retrieved successfully",
          },
          data: {
            $ref: "#/components/schemas/DataUsers",
          },
        },
      },
      //[User] Create Or Update User By Admin
      CreateOrUpdateUserByAdminRequest: {
        type: "object",
        properties: {
          firstName: {
            type: "string",
            example: "Admin",
            description: "Nhập tên",
          },
          lastName: {
            type: "string",
            example: "Promax",
            description: "Nhập họ",
          },
          email: {
            type: "string",
            description: "Nhập email",
          },
          password: {
            type: "string",
            example: "your@Password123",
            description: "Nhập mật khẩu",
          },
          avatar: {
            type: "string",
            format: "binary",
            description: "Tải lên ảnh đại diện",
          },
          roleId: {
            type: "array",
            items: {
              type: "integer",
            },
            example: [1, 2, 3],
          },
        },
        required: [
          "email",
          "firstName",
          "lastName",
          "password",
          "avatar",
          "roleId",
        ],
      },
      CreateOrUpdateUserByAdminResponse: {
        type: "object",
        properties: {
          status: {
            type: "integer",
            example: 200,
          },
          message: {
            type: "string",
            example: "User 'created or updated' successfully",
          },
          data: {
            $ref: "#/components/schemas/DataUser",
          },
        },
      },
      //[User] Delete User By Admin
      DeleteUserResponse: {
        type: "object",
        properties: {
          status: {
            type: "integer",
            example: 201,
          },
          message: {
            type: "string",
            example: "User deleted successfully",
          },
        },
      },
      //[User] Delete My User
      DeleteMyUserResponse: {
        type: "object",
        properties: {
          status: {
            type: "integer",
            example: 201,
          },
          message: {
            type: "string",
            example: "Your account has been deleted successfully",
          },
        },
      },
      //[User] Update My Info
      UpdateMyInfoRequest: {
        type: "object",
        properties: {
          firstName: {
            type: "string",
            example: "Admin",
            description: "Nhập tên của bạn",
          },
          lastName: {
            type: "string",
            example: "Promax",
            description: "Nhập họ của bạn",
          },
          email: {
            type: "string",
            description: "Nhập email của bạn",
          },
          password: {
            type: "string",
            example: "your@Password123",
            description: "Nhập mật khẩu của bạn",
          },
          avatar: {
            type: "string",
            format: "binary",
            description: "Tải lên ảnh đại diện",
          },
        },
        required: ["firstName", "lastName", "email", "password", "avatar"],
      },
      UpdateMyInfoResponse: {
        type: "object",
        properties: {
          status: {
            type: "integer",
            example: 200,
          },
          message: {
            type: "string",
            example: "Your information has been updated successfully",
          },
          data: {
            $ref: "#/components/schemas/DataUser",
          },
        },
      },
      DataUser: {
        type: "object",
        properties: {
          userId: {
            type: "string",
            format: "uuid",
            example: "ababcbfb-f7b8-4d87-9c69-b1ae2355f565",
          },
          avatar: {
            type: "string",
            example:
              "https://res.cloudinary.com/dfkadlnoh/image/upload/v1730995424/avatars/y1svl2iaw0vikbup34dw.jpg",
          },
          fullName: {
            type: "string",
            example: "Admin Promax",
          },
          firstName: {
            type: "string",
            example: "Admin",
          },
          lastName: {
            type: "string",
            example: "Promax",
          },
          email: {
            type: "string",
            example: "admin@gmail.com",
          },
          roleList: {
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
      // =================================================================

      //[Permission] Get All Permissions
      GetAllPermissionsResponse: {
        type: "object",
        properties: {
          status: {
            type: "integer",
            example: 200,
          },
          message: {
            type: "string",
            example: "Show all successful permissions",
          },
          data: {
            $ref: "#/components/schemas/DataPermissions",
          },
        },
      },
      PermissionNotFound: {
        type: "object",
        properties: {
          status: {
            type: "integer",
            example: 404,
          },
          error: {
            type: "object",
            properties: {
              errorCode: {
                type: "string",
                example: "PERMISSION_NOT_FOUND",
              },
              errorMessage: {
                type: "string",
                example: "Permissions not found in the database",
              },
            },
          },
        },
      },
      DataPermissions: {
        type: "array",
        items: {
          type: "object",
          properties: {
            id: {
              type: "string",
              example: "1",
            },
            action: {
              type: "string",
              example: "view_all_users",
            },
            resource: {
              type: "string",
              example: "User",
            },
            description: {
              type: "string",
              example: "View all user details",
            },
            roleList: {
              type: "array",
              items: {
                type: "string",
              },
              example: ["Admin", "Customer"],
            },
            createdAt: {
              type: "string",
              format: "date-time",
              example: "12:17:47 22/10/2024",
            },
            updatedAt: {
              type: "string",
              format: "date-time",
              example: "12:17:47 22/10/2024",
            },
          },
        },
      },
      //[Permission]  All Permission By Id
      GetPermissionsByIdResponse: {
        type: "object",
        properties: {
          status: {
            type: "integer",
            example: 200,
          },
          message: {
            type: "string",
            example: "Show successfully permission",
          },
          data: {
            $ref: "#/components/schemas/DataPermission",
          },
        },
      },
      DataPermission: {
        type: "object",
        properties: {
          id: {
            type: "string",
            example: "1",
          },
          action: {
            type: "string",
            example: "view_all_users",
          },
          resource: {
            type: "string",
            example: "User",
          },
          description: {
            type: "string",
            example: "View all user details",
          },
          roleList: {
            type: "array",
            items: {
              type: "string",
            },
            example: ["Admin", "Customer"],
          },
          createdAt: {
            type: "string",
            format: "date-time",
            example: "12:17:47 22/10/2024",
          },
          updatedAt: {
            type: "string",
            format: "date-time",
            example: "12:17:47 22/10/2024",
          },
        },
      },
      //[Permission] Create Or Update Permission
      CreateOrUpdatePermissionRequest: {
        type: "object",
        properties: {
          action: {
            type: "string",
            example: "View_all_permission",
          },
          resource: {
            type: "string",
            example: "Permission",
          },
          description: {
            type: "string",
            example: "View all permission",
          },
          roleIds: {
            type: "array",
            example: ["1", "2", "3"],
          },
        },
      },
      CreateOrUpdatePermissionResponse: {
        type: "object",
        properties: {
          status: {
            type: "integer",
            example: 200,
          },
          message: {
            type: "string",
            example: "Create permission successfully",
          },
          data: {
            $ref: "#/components/schemas/DataPermission",
          },
        },
      },
      PermissionExists: {
        type: "object",
        properties: {
          status: {
            type: "integer",
            example: 409,
          },
          error: {
            type: "object",
            properties: {
              errorCode: {
                type: "string",
                example: "PERMISSION_EXISTS",
              },
              errorMessage: {
                type: "string",
                example:
                  "Permission with this action and resource already exists",
              },
            },
          },
        },
      },
      //[Permission] Update Permission
      RoleNotCreated: {
        type: "object",
        properties: {
          status: {
            type: "integer",
            example: 404,
          },
          error: {
            type: "object",
            properties: {
              errorCode: {
                type: "string",
                example: "ROLE_NOT_CREATED",
              },
              errorMessage: {
                type: "string",
                example: "Please create a role first",
              },
            },
          },
        },
      },
      //[Permission] Delete Permission
      DeletePermissionResponse: {
        type: "object",
        properties: {
          status: {
            type: "integer",
            example: 200,
          },
          message: {
            type: "string",
            example: "Permission deleted successfully",
          },
        },
      },
      // =================================================================

      //[Address] Get All Address
      GetAllAddressResponse: {
        type: "object",
        properties: {
          status: {
            type: "integer",
            example: 200,
          },
          message: {
            type: "string",
            example: "Show all addresses successfully",
          },
          data: {
            $ref: "#/components/schemas/DataAddresses",
          },
        },
      },
      AddressNotFound: {
        type: "object",
        properties: {
          status: {
            type: "integer",
            example: 404,
          },
          error: {
            type: "object",
            properties: {
              errorCode: {
                type: "string",
                example: "ADDRESS_NOT_FOUND",
              },
              errorMessage: {
                type: "string",
                example: "Address not found in the database",
              },
            },
          },
        },
      },
      DataAddresses: {
        oneOf: [{ type: "null" }, { type: "object" }],
        type: "array",
        items: {
          type: "object",
          properties: {
            addressId: {
              type: "string",
              format: "uuid",
              example: "abcdefgh-f7b8-4d87-9c69-b1ae2355f565",
            },
            userId: {
              type: "string",
              format: "uuid",
              example: "ababcbfb-f7b8-4d87-9c69-b1ae2355f565",
            },
            fullName: {
              type: "string",
              example: "Admin Promax",
            },
            phoneNumber: {
              type: "string",
              example: "0975515940",
            },
            provinceCode: {
              type: "string",
              example: "02",
            },
            provinceName: {
              type: "string",
              example: "Hà Giang",
            },
            districtCode: {
              type: "string",
              example: "027",
            },
            districtName: {
              type: "string",
              example: "Mèo Vạc",
            },
            wardCode: {
              type: "string",
              example: "00817",
            },
            wardName: {
              type: "string",
              example: "Niêm Sơn",
            },
            address: {
              type: "string",
              example: "230/20/1 Phan Huy Ích",
            },
            addressType: {
              type: "string",
              enum: ["HOME", "OFFICE"],
              default: "HOME",
              description: "Type of address",
              example: "HOME",
            },
            isPrimary: {
              type: "boolean",
              example: "true",
            },
          },
        },
      },
      //[Address] Get Address By Id
      GetAddressByIdResponse: {
        type: "object",
        properties: {
          status: {
            type: "integer",
            example: 200,
          },
          message: {
            type: "string",
            example: "Show address successfully",
          },
          data: {
            $ref: "#/components/schemas/DataAddress",
          },
        },
      },
      DataAddress: {
        oneOf: [{ type: "null" }, { type: "object" }],
        type: "object",
        properties: {
          addressId: {
            type: "string",
            format: "uuid",
            example: "abcdefgh-f7b8-4d87-9c69-b1ae2355f565",
          },
          userId: {
            type: "string",
            format: "uuid",
            example: "ababcbfb-f7b8-4d87-9c69-b1ae2355f565",
          },
          fullName: {
            type: "string",
            example: "Admin Promax",
          },
          phoneNumber: {
            type: "string",
            example: "0975515940",
          },
          provinceCode: {
            type: "string",
            example: "02",
          },
          provinceName: {
            type: "string",
            example: "Hà Giang",
          },
          districtCode: {
            type: "string",
            example: "027",
          },
          districtName: {
            type: "string",
            example: "Mèo Vạc",
          },
          wardCode: {
            type: "string",
            example: "00817",
          },
          wardName: {
            type: "string",
            example: "Niêm Sơn",
          },
          address: {
            type: "string",
            example: "230/20/1 Phan Huy Ích",
          },
          addressType: {
            type: "string",
            enum: ["HOME", "OFFICE"],
            default: "HOME",
            description: "Type of address",
            example: "HOME",
          },
          isPrimary: {
            type: "boolean",
            example: "true",
          },
        },
      },
      //[Address] Create Address
      CreateOrUpdateAddressRequest: {
        type: "object",
        properties: {
          fullName: {
            type: "string",
            example: "Admin Promax",
          },
          phoneNumber: {
            type: "string",
            example: "0975515940",
          },
          provinceCode: {
            type: "string",
            example: "02",
          },
          districtCode: {
            type: "string",
            example: "027",
          },
          wardCode: {
            type: "string",
            example: "00817",
          },
          address: {
            type: "string",
            example: "51 Lê Thị Nho",
          },
          addressType: {
            type: "string",
            enum: ["HOME", "OFFICE"],
            default: "HOME",
            description: "Type of address",
            example: "HOME",
          },
          isPrimary: {
            type: "boolean",
            example: true,
          },
        },
      },
      CreateOrUpdateAddressResponse: {
        type: "object",
        properties: {
          status: {
            type: "integer",
            example: 201,
          },
          message: {
            type: "string",
            example: "Address 'created or update' successfully",
          },
          data: {
            $ref: "#/components/schemas/DataAddress",
          },
        },
      },
      //[Address] Delete Address
      DeleteAddressResponse: {
        type: "object",
        properties: {
          status: {
            type: "integer",
            example: 200,
          },
          message: {
            type: "string",
            example: "Address deleted successfully",
          },
        },
      },
      //[Address] Get My Address
      GetMyAddressResponse: {
        type: "object",
        properties: {
          status: {
            type: "integer",
            example: 200,
          },
          message: {
            type: "string",
            example: "Show all addresses successfully",
          },
          data: {
            $ref: "#/components/schemas/DataAddresses",
          },
        },
      },
      // =================================================================

      //[Province] Get All Provinces
      GetAllProvincesResponse: {
        type: "object",
        properties: {
          status: {
            type: "integer",
            example: 200,
          },
          message: {
            type: "string",
            example: "Show all provinces",
          },
          data: {
            type: "array",
            items: {
              type: "object",
              properties: {
                code: {
                  type: "string",
                  example: "01",
                },
                name: {
                  type: "string",
                  example: "Hà Nội",
                },
              },
            },
          },
        },
      },
      //[Province] Get All Districts
      GetAllDistrictResponse: {
        type: "object",
        properties: {
          status: {
            type: "integer",
            example: 200,
          },
          message: {
            type: "string",
            example: "Show all districts",
          },
          data: {
            type: "array",
            items: {
              type: "object",
              properties: {
                code: {
                  type: "string",
                  example: "001",
                },
                name: {
                  type: "string",
                  example: "Ba Đình",
                },
              },
            },
          },
        },
      },
      //[Province] Get All Wards
      GetAllWardResponse: {
        type: "object",
        properties: {
          status: {
            type: "integer",
            example: 200,
          },
          message: {
            type: "string",
            example: "Show all wards",
          },
          data: {
            type: "array",
            items: {
              type: "object",
              properties: {
                code: {
                  type: "string",
                  example: "00001",
                },
                name: {
                  type: "string",
                  example: "Phúc Xá",
                },
              },
            },
          },
        },
      },
      //[Province] Get All Units
      GetAllUnitsResponse: {
        type: "object",
        properties: {
          status: {
            type: "integer",
            example: 200,
          },
          message: {
            type: "string",
            example: "Show all units",
          },
          data: {
            type: "array",
            items: {
              type: "object",
              properties: {
                id: {
                  type: "integer",
                  example: 1,
                },
                fullName: {
                  type: "string",
                  example: "Thành phố trực thuộc trung ương",
                },
                fullNameEn: {
                  type: "string",
                  example: "Municipality",
                },
                shortName: {
                  type: "string",
                  example: "Thành phố",
                },
                shortNameEn: {
                  type: "string",
                  example: "City",
                },
                codeName: {
                  type: "string",
                  example: "thanh_pho_truc_thuoc_trung_uong",
                },
                codeNameEn: {
                  type: "string",
                  example: "municipality",
                },
              },
            },
          },
        },
      },
      //[Province] Get All Regions
      GetAllRegionsResponse: {
        type: "object",
        properties: {
          status: {
            type: "integer",
            example: 200,
          },
          message: {
            type: "string",
            example: "Show all regions",
          },
          data: {
            type: "array",
            items: {
              type: "object",
              properties: {
                id: {
                  type: "integer",
                  example: 1,
                },
                name: {
                  type: "string",
                  example: "Đông Bắc Bộ",
                },
                nameEn: {
                  type: "string",
                  example: "Northeast",
                },
                codeName: {
                  type: "string",
                  example: "dong_bac_bo",
                },
                codeNameEn: {
                  type: "string",
                  example: "northest",
                },
              },
            },
          },
        },
      },
      //[Province] Get All District By ProvinceCode
      GetDistrictByProvinceCode: {
        type: "object",
        properties: {
          status: {
            type: "integer",
            example: 200,
          },
          message: {
            type: "string",
            example: "Show districts by province",
          },
          data: {
            type: "array",
            items: {
              type: "object",
              properties: {
                code: {
                  type: "string",
                  example: "001",
                },
                name: {
                  type: "string",
                  example: "Ba Đình",
                },
                provinceCode: {
                  type: "string",
                  example: "01",
                },
              },
            },
          },
        },
      },
      //[Province] Get All Ward By DistrictCode
      GetWardByDistrictCode: {
        type: "object",
        properties: {
          status: {
            type: "integer",
            example: 200,
          },
          message: {
            type: "string",
            example: "Show wards by district",
          },
          data: {
            type: "array",
            items: {
              properties: {
                code: {
                  type: "string",
                  example: "00001",
                },
                name: {
                  type: "string",
                  example: "Phúc Xá",
                },
                districtCode: {
                  type: "string",
                  example: "001",
                },
              },
            },
          },
        },
      },
      // =================================================================

      //[Category] Get All Categories
      GetAllCategoriesResponse: {
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
                  example: 1,
                },
                categoryName: {
                  type: "string",
                  example: "Thời trang nam",
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
                        example: 1,
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
      CategoryNotFound: {
        type: "object",
        properties: {
          status: {
            type: "integer",
            example: 404,
          },
          error: {
            type: "object",
            properties: {
              errorCode: {
                type: "string",
                example: "CATEGORIES_NOT_FOUND",
              },
              errorMessage: {
                type: "string",
                example: "Categories not found in the database",
              },
            },
          },
        },
      },
      //[Category] Create Or Update Category
      CreateOrUpdateCategoryRequest: {
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
            example: true,
          },
          imageUrls: {
            type: "array",
            items: {
              type: "string",
              format: "binary",
            },
          },
        },
        required: ["categoryName", "toggle", "imageUrls"],
      },
      CreateOrUpdateCategoryResponse: {
        type: "object",
        properties: {
          status: {
            type: "integer",
            example: 200,
          },
          message: {
            type: "string",
            example: "Category 'created or updated' successfully",
          },
          data: {
            type: "object",
            properties: {
              categoryId: {
                type: "integer",
                example: 1,
              },
              categoryName: {
                type: "string",
                example: "Thời trang nam",
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
                      example: 1,
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
      //[Category] Delete Category
      DeleteCategoryResponse: {
        type: "object",
        properties: {
          status: {
            type: "integer",
            example: 200,
          },
          message: {
            type: "string",
            example: "Category deleted successfully",
          },
        },
      },
      // =================================================================

      //[Shop] Create Shop
      CreateShopRequest: {
        type: "object",
        properties: {
          shopName: {
            type: "string",
            example: "Shop Của Hiệuu",
          },
          description: {
            type: "string",
            example: "Shop Của Hiệu",
          },
          address: {
            type: "string",
            example: "",
          },
          phone: {
            type: "string",
            example: "",
            pattern: "^[0-9]+$",
          },
          email: {
            type: "string",
            format: "email",
            example: "",
          },
          logo: {
            type: "string",
            example: "",
          },
          website: {
            type: "string",
            example: "",
          },
        },
        required: ["shopName"],
      },
      CreateShopResponse: {},
      // =================================================================================================

      //[Product] Get All Products
      GetAllProducts: {
        type: "array",
        items: {
          type: "object",
          properties: {
            status: {
              type: "integer",
              example: 200,
            },
            message: {
              type: "string",
              example: "Product created successfully",
            },
            data: {
              type: "object",
              properties: {
                shopName: {
                  type: "string",
                  example: "Shop Của Hiệuu",
                },
                productName: {
                  type: "string",
                  example: "Áo thun 100%",
                },
                originalPrice: {
                  type: "integer",
                  example: 100000,
                },
                discountPrice: {
                  type: "integer",
                  nullable: true,
                  example: null,
                },
                discountType: {
                  type: "string",
                  example: "percent",
                },
                discountStartDate: {
                  type: "string",
                  example: "00:00:00 12/11/2024",
                },
                discountEndDate: {
                  type: "string",
                  example: "00:00:00 19/11/2024",
                },
                finalPrice: {
                  type: "integer",
                  example: 100000,
                },
                description: {
                  type: "string",
                  example: "Text",
                },
                categoryList: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      id: {
                        type: "integer",
                        example: 1,
                      },
                      categoryName: {
                        type: "string",
                        example: "Thời trang nữ",
                      },
                    },
                  },
                },
                mediaList: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      mediaUrl: {
                        type: "string",
                        example:
                          "https://res.cloudinary.com/dfkadlnoh/image/upload/v1731434761/f46ut5dkyq7a1iai5wot.jpg",
                      },
                      isFeatured: {
                        type: "boolean",
                        example: true,
                      },
                    },
                  },
                },
                optionList: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      optionName: {
                        type: "string",
                        example: "Color",
                      },
                      optionValues: {
                        type: "array",
                        items: {
                          type: "string",
                          example: "Red",
                        },
                      },
                    },
                  },
                },
                slug: {
                  type: "string",
                  example: "ao-thun-100percent",
                },
                createdAt: {
                  type: "string",
                  example: "18:05:59 12/11/2024",
                },
                updatedAt: {
                  type: "string",
                  example: "18:05:59 12/11/2024",
                },
              },
            },
          },
        },
      },
      //[Product] Get Product By Slug
      GetProductBySlugResponse: {
        type: "object",
        properties: {
          status: {
            type: "integer",
            example: 200,
          },
          message: {
            type: "string",
            example: "Show product successfully",
          },
          data: {
            type: "object",
            properties: {
              shopName: {
                type: "string",
                example: "Shop Của Hiệuu",
              },
              productName: {
                type: "string",
                example: "Áo thun 100%",
              },
              originalPrice: {
                type: "integer",
                example: 100000,
              },
              discountPrice: {
                type: "integer",
                nullable: true,
                example: null,
              },
              discountType: {
                type: "string",
                example: "percent",
              },
              discountStartDate: {
                type: "string",
                example: "00:00:00 12/11/2024",
              },
              discountEndDate: {
                type: "string",
                example: "00:00:00 19/11/2024",
              },
              finalPrice: {
                type: "integer",
                example: 100000,
              },
              description: {
                type: "string",
                example: "Text",
              },
              categoryList: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    id: {
                      type: "integer",
                      example: 1,
                    },
                    categoryName: {
                      type: "string",
                      example: "Thời trang nữ",
                    },
                  },
                },
              },
              mediaList: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    mediaUrl: {
                      type: "string",
                      example:
                        "https://res.cloudinary.com/dfkadlnoh/image/upload/v1731434761/f46ut5dkyq7a1iai5wot.jpg",
                    },
                    isFeatured: {
                      type: "boolean",
                      example: true,
                    },
                  },
                },
              },
              optionList: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    optionName: {
                      type: "string",
                      example: "Color",
                    },
                    optionValues: {
                      type: "array",
                      items: {
                        type: "string",
                        example: "Red",
                      },
                    },
                  },
                },
              },
              slug: {
                type: "string",
                example: "ao-thun-100percent",
              },
              createdAt: {
                type: "string",
                example: "18:05:59 12/11/2024",
              },
              updatedAt: {
                type: "string",
                example: "18:05:59 12/11/2024",
              },
            },
          },
        },
      },
      ProductNotFound: {
        type: "object",
        properties: {
          status: {
            type: "integer",
            example: 404,
          },
          error: {
            type: "object",
            properties: {
              errorCode: {
                type: "string",
                example: "PRODUCT_NOT_FOUND",
              },
              errorMessage: {
                type: "string",
                example: "Product not found in database",
              },
            },
          },
        },
      },
      //[Product] Search Product
      SearchProductRequest: {
        type: "object",
        properties: {
          searchItems: {
            type: "string",
            example: "Áo",
          },
        },
      },
      //[Product] Create Or Update Product
      CreateOrUpdateProductRequest: {
        type: "object",
        properties: {
          productName: {
            type: "string",
            example: "Áo thun 100% cotton",
          },
          originalPrice: {
            type: "integer",
            example: 100000,
          },
          discountPrice: {
            type: "integer",
            example: 10,
          },
          discountType: {
            type: "string",
            enum: ["amount", "percent"],
            example: "percent",
          },
          discountStartDate: {
            type: "string",
            format: "date-time",
            example: "2024-11-12T00:00:00Z",
          },
          discountEndDate: {
            type: "string",
            format: "date-time",
            example: "2024-11-19T00:00:00Z",
          },
          description: {
            type: "text",
            example: "Text",
          },
          categoryId: {
            type: "integer",
            example: 1,
          },
          mediaList: {
            type: "array",
            items: {
              type: "string",
              format: "binary",
            },
          },
          optionList: {
            type: "string",
            example:
              '[{"optionName": "Color", "optionValues": ["Red", "Blue", "Green"]}, {"optionName": "Size", "optionValues": ["S", "M", "L"]}]',
          },
          quantity: {
            type: "integer",
            example: 100,
          },
        },
        required: [
          "productName",
          "originalPrice",
          "discountType",
          "discountStartDate",
          "discountEndDate",
          "categoryId",
          "mediaList",
          "optionList",
          "quantity",
        ],
      },
      CreateOrUpdateProductResponse: {
        type: "object",
        properties: {
          status: {
            type: "integer",
            example: 200,
          },
          message: {
            type: "string",
            example: "Product created successfully",
          },
          data: {
            type: "object",
            properties: {
              shopName: {
                type: "string",
                example: "Shop Của Hiệuu",
              },
              productName: {
                type: "string",
                example: "Áo thun 100%",
              },
              originalPrice: {
                type: "integer",
                example: 100000,
              },
              discountPrice: {
                type: "integer",
                nullable: true,
                example: null,
              },
              discountType: {
                type: "string",
                example: "percent",
              },
              discountStartDate: {
                type: "string",
                example: "00:00:00 12/11/2024",
              },
              discountEndDate: {
                type: "string",
                example: "00:00:00 19/11/2024",
              },
              finalPrice: {
                type: "integer",
                example: 100000,
              },
              description: {
                type: "string",
                example: "Text",
              },
              categoryList: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    id: {
                      type: "integer",
                      example: 1,
                    },
                    categoryName: {
                      type: "string",
                      example: "Thời trang nữ",
                    },
                  },
                },
              },
              mediaList: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    mediaUrl: {
                      type: "string",
                      example:
                        "https://res.cloudinary.com/dfkadlnoh/image/upload/v1731434761/f46ut5dkyq7a1iai5wot.jpg",
                    },
                    isFeatured: {
                      type: "boolean",
                      example: true,
                    },
                  },
                },
              },
              optionList: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    optionName: {
                      type: "string",
                      example: "Color",
                    },
                    optionValues: {
                      type: "array",
                      items: {
                        type: "string",
                        example: "Red",
                      },
                    },
                  },
                },
              },
              slug: {
                type: "string",
                example: "ao-thun-100percent",
              },
              createdAt: {
                type: "string",
                example: "18:05:59 12/11/2024",
              },
              updatedAt: {
                type: "string",
                example: "18:05:59 12/11/2024",
              },
            },
          },
        },
      },
      ShopNotFound: {
        type: "object",
        properties: {
          status: {
            type: "integer",
            example: 404,
          },
          error: {
            type: "object",
            properties: {
              errorCode: {
                type: "string",
                example: "CREATE_PRODUCT_NO_ASSOCIATED_SHOP",
              },
              errorMessage: {
                type: "string",
                example: "You need to create a store before creating products",
              },
            },
          },
        },
      },
      MissingFieldDiscountValidate: {
        type: "object",
        properties: {
          status: {
            type: "integer",
            example: 400,
          },
          error: {
            type: "object",
            properties: {
              errorCode: {
                type: "string",
                example: "CREATE_DISCOUNT_MISSING_REQUIRED_FIELDS",
              },
              errorMessage: {
                type: "string",
                example:
                  "You need to create a discount type, a discount start date and a discount end date",
              },
            },
          },
        },
      },
      DiscountInvalidDate: {
        type: "object",
        properties: {
          status: {
            type: "integer",
            example: 400,
          },
          error: {
            type: "object",
            properties: {
              errorCode: {
                type: "string",
                example: "DISCOUNT_INVALID_DATE_RANGE",
              },
              errorMessage: {
                type: "string",
                example:
                  "You need to create a discount end date that is less than the discount start date",
              },
            },
          },
        },
      },
      //[Product] Delete Product By Slug
      DeleteProductResponse: {
        type: "object",
        properties: {
          status: {
            type: "integer",
            example: 200,
          },
          message: {
            type: "string",
            example: "Product deleted successfully",
          },
        },
      },

      //================================================

      //Validation
      MissingFieldsValidate: {
        type: "object",
        properties: {
          status: {
            type: "integer",
            example: 400,
          },
          error: {
            type: "object",
            properties: {
              errorCode: {
                type: "string",
                example: "MISSING_FIELD",
              },
              errorMessage: {
                type: "string",
                example:
                  "The field 'FIELD_NAME' is required and cannot be empty",
              },
            },
          },
        },
      },
      PasswordValidate: {
        type: "object",
        properties: {
          status: {
            type: "integer",
            example: 422,
          },
          error: {
            type: "object",
            properties: {
              errorCode: {
                type: "string",
                example: "INVALID_PASSWORD_FORMAT",
              },
              errorMessage: {
                type: "string",
                example:
                  "Password must be between 12 to 23 characters long and include at least one uppercase letter, one lowercase letter, one digit, and one special character",
              },
            },
          },
        },
      },
      IncorrectFormatValidate: {
        type: "object",
        properties: {
          status: {
            type: "integer",
            example: 422,
          },
          error: {
            type: "object",
            properties: {
              errorCode: {
                type: "string",
                example: "INCORRECT_FORMAT",
              },
              errorMessage: {
                type: "string",
                example: "Invalid format for field 'FIELD_NAME'",
              },
            },
          },
        },
      },
      ParamsValidate: {
        type: "object",
        properties: {
          status: {
            type: "integer",
            example: 400,
          },
          error: {
            type: "object",
            properties: {
              errorCode: {
                type: "string",
                example: "PARAMS_INCORRECT_FORMAT",
              },
              errorMessage: {
                type: "string",
                example: "Invalid params format: 'DATA_TYPE'",
              },
            },
          },
        },
      },
      MailExistsValidate: {
        type: "object",
        properties: {
          status: {
            type: "integer",
            example: 409,
          },
          error: {
            type: "object",
            properties: {
              errorCode: {
                type: "string",
                example: "EMAIL_EXISTS",
              },
              errorMessage: {
                type: "string",
                example:
                  "This email is already associated with another account",
              },
            },
          },
        },
      },
      MailNotFoundValidate: {
        type: "object",
        properties: {
          status: {
            type: "integer",
            example: 404,
          },
          error: {
            type: "object",
            properties: {
              errorCode: {
                type: "string",
                example: "EMAIL_NOT_FOUND",
              },
              errorMessage: {
                type: "string",
                example: "Email not found in the database",
              },
            },
          },
        },
      },
      // =================================================================

      //Token verify
      TokenBlackListVerify: {
        type: "object",
        properties: {
          status: {
            type: "integer",
            example: 401,
          },
          error: {
            type: "object",
            properties: {
              errorCode: {
                type: "string",
                example: "TOKEN_IN_BLACKLIST",
              },
              errorMessage: {
                type: "string",
                example: "Token in the backlist",
              },
            },
          },
        },
      },
      TokenExpiredVerify: {
        type: "object",
        properties: {
          status: {
            type: "integer",
            example: 401,
          },
          error: {
            type: "object",
            properties: {
              errorCode: {
                type: "string",
                example: "TOKEN_EXPIRED",
              },
              errorMessage: {
                type: "string",
                example: "Token has expired",
              },
            },
          },
        },
      },
      TokenNotFoundCookieVerify: {
        type: "object",
        properties: {
          status: {
            type: "integer",
            example: 401,
          },
          error: {
            type: "object",
            properties: {
              errorCode: {
                type: "string",
                example: "TOKEN_NOT_FOUND",
              },
              errorMessage: {
                type: "string",
                example: "Token not found in the cookie",
              },
            },
          },
        },
      },
      TokenNotFoundInDBVerify: {
        type: "object",
        properties: {
          status: {
            type: "integer",
            example: 401,
          },
          error: {
            type: "object",
            properties: {
              errorCode: {
                type: "string",
                example: "TOKEN_NOT_FOUND",
              },
              errorMessage: {
                type: "string",
                example: "Token not found in the database",
              },
            },
          },
        },
      },
      TokenInvalidVerify: {
        type: "object",
        properties: {
          status: {
            type: "integer",
            example: 401,
          },
          error: {
            type: "object",
            properties: {
              errorCode: {
                type: "string",
                example: "TOKEN_INVALID",
              },
              errorMessage: {
                type: "string",
                example: "You are not authenticated",
              },
            },
          },
        },
      },
      // =================================================================

      //Permissions Verify
      PermissionVerify: {
        type: "object",
        properties: {
          status: {
            type: "integer",
            example: 403,
          },
          error: {
            type: "object",
            properties: {
              errorCode: {
                type: "string",
                example: "PERMISSION_DENIED",
              },
              errorMessage: {
                type: "string",
                example: "User does not have permission",
              },
            },
          },
        },
      },
      // =================================================================

      //Internal server error
      ErrorServerResponse: {
        type: "object",
        properties: {
          status: {
            type: "integer",
            example: 500,
          },
          error: {
            type: "object",
            properties: {
              errorCode: {
                type: "string",
                example: "INTERNAL_SERVER_ERROR",
              },
              errorMessage: {
                type: "string",
                example: "error.message",
              },
            },
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
