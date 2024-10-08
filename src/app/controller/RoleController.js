const Role = require("../models/RoleModel");

const getAllRole = async (req, res) => {
  try {
    const getAllRoleResult = await Role.findAll();
    if (getAllRoleResult.length === 0) {
      res.locals.message = "Roles not found";
      res.locals.error = "Roles not found in the database.";
      return res.status(404).json();
    }
    res.locals.data = getAllRoleResult;
    return res.status(200).json({ data: res.locals.data });
  } catch (error) {
    res.locals.message = "Internal Server Error";
    res.locals.error = error.message;
    return res.status(500).json();
  }
};
const getRoleById = async (req, res) => {
  const roleId = req.params.id;
  try {
    const getRoleByIdResult = await Role.findByPk(roleId);
    if (getRoleByIdResult.length === 0) {
      res.locals.message = "Role not found";
      res.locals.error = "Role not found in the database.";
      return res.status(404).json();
    }
    res.locals.data = getRoleByIdResult;
    return res.status(200).json({ data: res.locals.data });
  } catch (error) {
    res.locals.message = "Internal Server Error";
    res.locals.error = error.message;
    return res.status(500).json();
  }
};

const addRole = async (req, res) => {
  const { roleName, description } = req.body;
  try {
    const addRoleResult = await Role.create({ roleName, description });
    if (!addRoleResult) {
      res.locals.message = "Role created failed";
      res.locals.error = "Unable to create role in the database.";
      return res.status(404).json();
    }
    res.locals.data = addRoleResult;
    return res.status(200).json({ data: res.locals.data });
  } catch (error) {
    res.locals.message = "Internal Server Error";
    res.locals.error = error.message;
    return res.status(500).json();
  }
};

const updateRole = async (req, res) => {
  const roleId = req.params.id;
  const { roleName, description } = req.body;
  try {
    const findRole = await Role.findByPk(roleId);
    if (findRole) {
      await Role.update({ roleName, description }, { where: { id: roleId } });
      const updateResult = await Role.findByPk(roleId);
      res.locals.message = "Role updated successfully";
      res.locals.data = updateResult;
      return res.status(200).json({ data: res.locals.data });
    } else {
      res.locals.message = "Role not found";
      res.locals.error = "Role not found in the database";
      res.status(404).json();
    }
  } catch (error) {
    res.locals.message = "Internal Server Error";
    res.locals.error = error.message;
    return res.status(500).json();
  }
};

const deleteRole = async (req, res) => {
  const roleId = req.params.id;
  try {
    const deletedRoleResult = await Role.destroy({ where: { id: roleId } });
    if (!deletedRoleResult) {
      res.locals.message = "Role not found";
      res.locals.error = "Role not found in the database";
      return res.status(400).json();
    }
    res.locals.message = "Role Deteled Succesfully";
    return res.status(200).json();
  } catch (error) {
    res.locals.message = "Internal Server Error";
    res.locals.error = error.message;
    res.status(500).json();
  }
};
module.exports = {
  getAllRole,
  getRoleById,
  addRole,
  updateRole,
  deleteRole,
};
