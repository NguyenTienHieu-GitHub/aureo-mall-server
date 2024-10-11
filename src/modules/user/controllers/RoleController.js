const RoleService = require("../services/RoleService");

const getAllRole = async (req, res) => {
  try {
    const getAllRoleResult = await RoleService.getAllRole();
    res.locals.data = getAllRoleResult;
    res.locals.message = "Show all roles successfully";
    return res.status(200).json({ data: res.locals.data });
  } catch (error) {
    if (error.message === "Roles not found") {
      res.locals.message = error.message;
      res.locals.error = "Roles not found in the database.";
      return res.status(404).json();
    } else {
      res.locals.message = "Internal Server Error";
      res.locals.error = error.message;
      return res.status(500).json();
    }
  }
};
const getRoleById = async (req, res) => {
  const roleId = req.params.id;
  if (!roleId) {
    res.locals.message = "Missing required fields";
    res.locals.error = "Missing required fields: id";
    return res.status(400).json();
  }
  try {
    const getRoleByIdResult = await RoleService.getRoleById(roleId);
    res.locals.data = getRoleByIdResult;
    res.locals.message = "Show role successfully";
    return res.status(200).json({ data: res.locals.data });
  } catch (error) {
    if (error.message === "Roles not found") {
      res.locals.message = error.message;
      res.locals.error = "Roles not found in the database.";
      return res.status(404).json();
    } else {
      res.locals.message = "Internal Server Error";
      res.locals.error = error.message;
      return res.status(500).json();
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
    res.locals.data = addRoleResult;
    res.locals.message = "Create role successfully";
    return res.status(200).json({ data: res.locals.data });
  } catch (error) {
    console.error(error);
    if (error.message === "Role created failed") {
      res.locals.message = error.message;
      res.locals.error = "Unable to create role in the database.";
      return res.status(404).json();
    } else {
      res.locals.message = "Internal Server Error";
      res.locals.error = error.message;
      return res.status(500).json();
    }
  }
};

const updateRole = async (req, res) => {
  const roleId = req.params.id;
  if (!roleId) {
    res.locals.message = "Missing required fields";
    res.locals.error = "Missing required fields: id";
    return res.status(400).json();
  }
  const { roleName, description } = req.body;
  try {
    const updateResult = await RoleService.updateRole({
      roleId,
      roleName,
      description,
    });
    res.locals.message = "Role updated successfully";
    res.locals.data = updateResult;
    return res.status(200).json({ data: res.locals.data });
  } catch (error) {
    if (error.message === "Role not found") {
      res.locals.message = error.message;
      res.locals.error = "Role not found in the database";
      return res.status(404).json();
    } else {
      res.locals.message = "Internal Server Error";
      res.locals.error = error.message;
      return res.status(500).json();
    }
  }
};

const deleteRole = async (req, res) => {
  const roleId = req.params.id;
  if (!roleId) {
    res.locals.message = "Missing required fields";
    res.locals.error = "Missing required fields: id";
    return res.status(400).json();
  }
  try {
    await RoleService.deleteRole(roleId);
    res.locals.message = "Role Deteled Succesfully";
    return res.status(200).json();
  } catch (error) {
    if (error.message === "Role not found") {
      res.locals.message = error.message;
      res.locals.error = "Role not found in the database";
      return res.status(404).json();
    } else {
      res.locals.message = "Internal Server Error";
      res.locals.error = error.message;
      res.status(500).json();
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
