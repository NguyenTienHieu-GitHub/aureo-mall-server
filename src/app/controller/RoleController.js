const Role = require("../models/RoleModel");

const getAllRole = async (req, res) => {
  try {
    const getAllRoleResult = await Role.findAll();
    if (getAllRoleResult.length === 0) {
      return res.status(404).json({ message: "No roles found" });
    }
    return res.status(200).json(getAllRoleResult);
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
};
const getRoleById = async (req, res) => {
  const roleId = req.params.id;
  try {
    const getRoleByIdResult = await Role.findByPk(roleId);
    if (getRoleByIdResult.length === 0) {
      return res.status(404).json({ message: "No roles found" });
    }
    return res.status(200).json(getRoleByIdResult);
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
};

const addRole = async (req, res) => {
  const { roleName, description } = req.body;
  try {
    const addRoleResult = await Role.create({ roleName, description });
    if (!addRoleResult) {
      res.status(404).json({ message: "Role created failed" });
    }
    return res.status(200).json(addRoleResult);
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error", error });
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

      return res
        .status(200)
        .json({ message: "Role updated successfully", Role: updateResult });
    } else {
      res.status(404).json({ message: "Role not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error", error });
  }
};

const deleteRole = async (req, res) => {
  const roleId = req.params.id;
  try {
    const deletedRoleResult = await Role.destroy({ where: { id: roleId } });
    if (!deletedRoleResult) {
      res.status(400).json("Role not found");
    }
    return res.status(200).json("Role Deteled Succesfully");
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error", error });
  }
};
module.exports = {
  getAllRole,
  getRoleById,
  addRole,
  updateRole,
  deleteRole,
};
