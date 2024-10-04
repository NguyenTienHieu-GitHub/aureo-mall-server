const Permission = require("../models/PermissionModel");
const RolePermission = require("../models/RolePermissionModel");

const getAllPermissions = async (req, res) => {
  try {
    const allPermissions = await Permission.findAll();
    if (allPermissions.length === 0) {
      return res.status(404).json({ message: "No permissions found" });
    }
    return res.status(200).json(allPermissions);
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
};

const getPermissionById = async (req, res) => {
  const permissionId = req.params.id;
  try {
    const permission = await Permission.findById(permissionId);
    if (permission.length === 0) {
      return res.status(404).json({ message: "No permission found" });
    }
    return res.status(200).json(permission);
  } catch (error) {
    return res.status(500).json({ message: "Internal Server Error", error });
  }
};
const addPermission = async (req, res) => {
  const { action, resource, description, roleId } = req.body;
  try {
    const newPermission = await Permission.create({
      action,
      resource,
      description,
    });
    await RolePermission.create({
      roleId: roleId,
      permissionId: newPermission.id,
    });
    const roleName = await RolePermission.findOne({
      where: { permissionId: newPermission.id },
      include: [
        {
          model: RolePermission,
          as: "Role",
          attributes: ["roleName"],
        },
      ],
    });
    const responseData = {
      ...newPermission,
      roleName: roleName,
    };
    return res.status(200).json({
      success: true,
      message: "Created permission",
      responseData,
    });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error", error: error });
  }
};
const updatePermission = async (req, res) => {
  const { id } = req.params;
  const { action, resource, description } = req.body;

  try {
    const permission = await Permission.findByPk(id);
    if (!permission) {
      return res.status(404).json({ message: "Permission not found." });
    }

    await permission.update({ action, resource, description });
    return res.status(200).json(permission);
  } catch (error) {
    console.error("Error updating permission:", error);
    return res.status(500).json({ message: "Internal server error." });
  }
};
const deletePermission = async (req, res) => {
  const { id } = req.params;

  try {
    const permission = await Permission.findByPk(id);
    if (!permission) {
      return res.status(404).json({ message: "Permission not found." });
    }

    await permission.destroy();
    return res.status(204).send();
  } catch (error) {
    console.error("Error deleting permission:", error);
    return res.status(500).json({ message: "Internal server error." });
  }
};

module.exports = {
  addPermission,
  updatePermission,
  deletePermission,
  getAllPermissions,
  getPermissionById,
};
