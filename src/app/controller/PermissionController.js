const Permission = require("../models/PermissionModel");
const RolePermission = require("../models/RolePermissionModel");

const getAllPermissions = async (req, res) => {
  try {
    const allPermissions = await Permission.findAll();
    if (allPermissions.length === 0) {
      res.locals.message = "Permissions not found";
      res.locals.error = "Permissions not found in the database";
      return res.status(404).json();
    }
    res.locals.message = "Show all successful permissions";
    res.locals.data = allPermissions;
    return res.status(200).json({ data: res.locals.data });
  } catch (error) {
    res.locals.message = "Internal Server Error";
    res.locals.error = error.message;
    return res.status(500).json();
  }
};

const getPermissionById = async (req, res) => {
  const permissionId = req.params.id;
  try {
    const permission = await Permission.findById(permissionId);
    if (permission.length === 0) {
      res.locals.message = "Permission not found";
      res.locals.error = "Permissions not found in the database";
      return res.status(404).json();
    }
    res.locals.message = "Show successful permission";
    res.locals.data = permission;
    return res.status(200).json({ data: res.locals.data });
  } catch (error) {
    res.locals.message = "Internal Server Error";
    res.locals.error = error.message;
    return res.status(500).json();
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
    res.locals.message = "Created permission";
    res.locals.data = responseData;
    return res.status(200).json({ data: res.locals.data });
  } catch (error) {
    res.locals.message = "Internal Server Error";
    res.locals.error = error.message;
    return res.status(500).json();
  }
};
const updatePermission = async (req, res) => {
  const { id } = req.params;
  const { action, resource, description } = req.body;

  try {
    const permission = await Permission.findByPk(id);
    if (!permission) {
      res.locals.message = "Permission not found.";
      res.locals.error = "Permission not found in the database.";
      return res.status(404).json();
    }
    await permission.update({ action, resource, description });
    res.locals.message = "Permission updated successfully.";
    res.locals.data = permission;
    return res.status(200).json({ data: res.locals.data });
  } catch (error) {
    console.error("Error updating permission:", error);
    res.locals.message = "Internal Server Error";
    res.locals.error = error.message;
    return res.status(500).json();
  }
};
const deletePermission = async (req, res) => {
  const { id } = req.params;

  try {
    const permission = await Permission.findByPk(id);
    if (!permission) {
      res.locals.message = "Permission not found";
      res.locals.error = "Permission not found in the database.";
      return res.status(404).json();
    }

    await permission.destroy();
    res.locals.message = "Permission deleted successfully";
    return res.status(204).json();
  } catch (error) {
    console.error("Error deleting permission:", error);
    res.locals.message = "Internal Server Error";
    res.locals.error = error.message;
    return res.status(500).json();
  }
};

module.exports = {
  addPermission,
  updatePermission,
  deletePermission,
  getAllPermissions,
  getPermissionById,
};
