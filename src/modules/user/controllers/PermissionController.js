const PermissionService = require("../services/PermissionService");
const setResponseLocals = require("../../../shared/middleware/setResponseLocals");

const getAllPermissions = async (req, res) => {
  try {
    const allPermissions = await PermissionService.getAllPermissions();
    return setResponseLocals({
      res,
      statusCode: 200,
      messageSuccess: "Show all successful permissions",
      data: allPermissions,
    });
  } catch (error) {
    console.error(error);
    if (error.message.includes("Permissions not found")) {
      return setResponseLocals({
        res,
        statusCode: 404,
        errorCode: "PERMISSION_NOT_FOUND",
        errorMessage: "Permissions not found in the database",
      });
    } else {
      return setResponseLocals({
        res,
        statusCode: 500,
        errorCode: "INTERNAL_SERVER_ERROR",
        errorMessage: error.message,
      });
    }
  }
};
const getPermissionById = async (req, res) => {
  const permissionId = req.params.id;
  try {
    const permission = await PermissionService.getPermissionById(permissionId);
    return setResponseLocals({
      res,
      statusCode: 200,
      messageSuccess: "Show successfully permission",
      data: permission,
    });
  } catch (error) {
    console.log(error);
    if (error.message.includes("Permissions not found")) {
      return setResponseLocals({
        res,
        statusCode: 404,
        errorCode: "PERMISSION_NOT_FOUND",
        errorMessage: "Permissions not found in the database",
      });
    } else {
      return setResponseLocals({
        res,
        statusCode: 500,
        errorCode: "INTERNAL_SERVER_ERROR",
        errorMessage: error.message,
      });
    }
  }
};
const createPermission = async (req, res) => {
  const { action, resource, description, roleIds } = req.body;
  try {
    const responseData = await PermissionService.createPermission({
      action,
      resource,
      description,
      roleIds,
    });

    return setResponseLocals({
      res,
      statusCode: 200,
      messageSuccess: "Create permission successfully",
      data: responseData,
    });
  } catch (error) {
    console.error(error);
    if (
      error.message.includes(
        "Permission with this action and resource already exists."
      )
    ) {
      return setResponseLocals({
        res,
        statusCode: 409,
        errorCode: "PERMISSION_EXISTS",
        errorMessage: "Permission with this action and resource already exists",
      });
    } else {
      return setResponseLocals({
        res,
        statusCode: 500,
        errorCode: "INTERNAL_SERVER_ERROR",
        errorMessage: error.message,
      });
    }
  }
};
const updatePermission = async (req, res) => {
  const permissionId = req.params.id;
  const { action, resource, description, roleIds } = req.body;
  try {
    const permission = await PermissionService.updatePermission({
      permissionId,
      action,
      resource,
      description,
      roleIds,
    });
    return setResponseLocals({
      res,
      statusCode: 200,
      messageSuccess: "Permission updated successfully",
      data: permission,
    });
  } catch (error) {
    console.error("Error updating permission:", error);
    if (error.message.includes("Permission not found")) {
      return setResponseLocals({
        res,
        statusCode: 404,
        errorCode: "PERMISSION_NOT_FOUND",
        errorMessage: "Permission not found in the database",
      });
    } else if (error.message.includes("Please create role first")) {
      return setResponseLocals({
        res,
        statusCode: 404,
        errorCode: "ROLE_NOT_CREATED",
        errorMessage: "Please create a role first",
      });
    } else {
      return setResponseLocals({
        res,
        statusCode: 500,
        errorCode: "INTERNAL_SERVER_ERROR",
        errorMessage: error.message,
      });
    }
  }
};
const deletePermission = async (req, res) => {
  const permissionId = req.params.id;
  try {
    await PermissionService.deletePermission(permissionId);
    return setResponseLocals({
      res,
      statusCode: 200,
      messageSuccess: "Permission deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting permission:", error);
    if (error.message.includes("Permission not found")) {
      return setResponseLocals({
        res,
        statusCode: 404,
        errorCode: "PERMISSION_NOT_FOUND",
        errorMessage: "Permission not found in the database",
      });
    } else {
      return setResponseLocals({
        res,
        statusCode: 500,
        errorCode: "INTERNAL_SERVER_ERROR",
        errorMessage: error.message,
      });
    }
  }
};

module.exports = {
  createPermission,
  updatePermission,
  deletePermission,
  getAllPermissions,
  getPermissionById,
};
