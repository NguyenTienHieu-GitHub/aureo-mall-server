const RoleService = require("../services/RoleService");
const setResponseLocals = require("../../../shared/middleware/setResponseLocals");

const getAllRole = async (req, res) => {
  try {
    const getAllRoleResult = await RoleService.getAllRole();
    return setResponseLocals({
      res,
      statusCode: 200,
      messageSuccess: "Show all roles successfully",
      data: getAllRoleResult,
    });
  } catch (error) {
    if (error.message.includes("Roles not found")) {
      return setResponseLocals({
        res,
        statusCode: 404,
        errorCode: "ROLE_NOT_FOUND",
        errorMessage: "Roles not found in the database",
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
const getRoleById = async (req, res) => {
  const roleId = req.params.id;
  try {
    const getRoleByIdResult = await RoleService.getRoleById(roleId);
    return setResponseLocals({
      res,
      statusCode: 200,
      messageSuccess: "Show role Successfully",
      data: getRoleByIdResult,
    });
  } catch (error) {
    if (error.message.includes("Roles not found")) {
      return setResponseLocals({
        res,
        statusCode: 404,
        errorCode: "ROLE_NOT_FOUND",
        errorMessage: "Roles not found in the database",
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

const createRole = async (req, res) => {
  const { roleName, description } = req.body;
  try {
    const addRoleResult = await RoleService.createRole({
      roleName,
      description,
    });
    return setResponseLocals({
      res,
      statusCode: 200,
      messageSuccess: "Create role successfully",
      data: addRoleResult,
    });
  } catch (error) {
    console.error(error);
    return setResponseLocals({
      res,
      statusCode: 500,
      errorCode: "INTERNAL_SERVER_ERROR",
      errorMessage: error.message,
    });
  }
};

const updateRole = async (req, res) => {
  const roleId = req.params.id;
  const { roleName, description } = req.body;
  try {
    const updateResult = await RoleService.updateRole({
      roleId,
      roleName,
      description,
    });
    return setResponseLocals({
      res,
      statusCode: 200,
      messageSuccess: "Role updated successfully",
      data: updateResult,
    });
  } catch (error) {
    if (error.message.includes("Role not found")) {
      return setResponseLocals({
        res,
        statusCode: 404,
        errorCode: "ROLE_NOT_FOUND",
        errorMessage: "Role not found in the database",
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

const deleteRole = async (req, res) => {
  const roleId = req.params.id;
  try {
    await RoleService.deleteRole(roleId);
    return setResponseLocals({
      res,
      statusCode: 200,
      messageSuccess: "Role deleted successfully",
    });
  } catch (error) {
    if (error.message.includes("Role not found")) {
      return setResponseLocals({
        res,
        statusCode: 404,
        errorCode: "ROLE_NOT_FOUND",
        errorMessage: "Roles not found in the database",
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
  getAllRole,
  getRoleById,
  createRole,
  updateRole,
  deleteRole,
};
