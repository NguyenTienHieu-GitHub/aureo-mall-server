const sequelize = require("../../config/db");
const User = require("../models/UserModel");
const UserRole = require("../models/UserRoleModel");
const bcrypt = require("bcrypt");

const createAdminIfNotExists = async () => {
  const roleId = await UserRole.findOne({ where: { roleId: 1 } });
  if (!roleId) {
    const transaction = await sequelize.transaction();
    const hashedPassword = await bcrypt.hash(process.env.PASSWORD_ADMIN, 10);
    const admin = await User.create(
      {
        firstName: "admin",
        lastName: "admin",
        email: "admin@gmail.com",
        password: hashedPassword,
      },
      { transaction }
    );
    const roleAdmin = 1;
    await UserRole.create(
      {
        userId: admin.id,
        roleId: roleAdmin,
      },
      { transaction }
    );
    await transaction.commit();
    console.log("Admin account created");
  } else {
    console.log("Admin account already exists");
  }
};
module.exports = createAdminIfNotExists;
