const Role = require("../../modules/auth/models/RoleModel");

const createDefaultRoles = async () => {
  const count = await Role.count();
  if (count === 0) {
    await Role.sequelize.query('ALTER SEQUENCE "Roles_id_seq" RESTART WITH 1;');
  }
  const roles = [
    {
      roleName: "Admin",
      description: "Administrator",
    },
    {
      roleName: "Seller",
      description: "Seller role",
    },
    {
      roleName: "Standard Seller",
      description: "Standard Seller role",
    },
    {
      roleName: "Logistic",
      description: "Logistic role",
    },
    {
      roleName: "Customer",
      description: "Customer role",
    },
  ];
  try {
    for (let role of roles) {
      const roleExits = await Role.findOne({
        where: { roleName: role.roleName },
      });
      if (!roleExits) {
        await Role.create(role);
      }
    }
    console.log("Default roles created successfully");
  } catch (error) {
    console.error("Error creating default roles: ", error);
    throw error;
  }
};

module.exports = createDefaultRoles;
