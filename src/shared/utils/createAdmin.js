const sequelize = require("../../config/db/index");
const User = require("../../modules/auth/models/UserModel");
const UserRole = require("../../modules/auth/models/UserRoleModel");
const bcrypt = require("bcrypt");

const createAdminIfNotExists = async () => {
  const roleId = await UserRole.findOne({ where: { roleId: 1 } });
  if (!roleId) {
    const transaction = await sequelize.transaction();
    const hashedPassword = await bcrypt.hash(process.env.PASSWORD_ADMIN, 10);
    const admin = await User.create(
      {
        firstName: process.env.FIRST_NAME_ADMIN,
        lastName: process.env.LAST_NAME_ADMIN,
        email: process.env.EMAIL_ADMIN,
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
