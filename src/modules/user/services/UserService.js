const User = require("../../auth/models/UserModel");
const Role = require("../../auth/models/RoleModel");
const UserRole = require("../../auth/models/UserRoleModel");
const bcrypt = require("bcrypt");
const sequelize = require("../../../config/db/index");
const { uploadImageToCloudinary } = require("../../../shared/utils/upload");

const getMyInfo = async (userId) => {
  const userWithRole = await User.findOne({
    where: { id: userId },
    include: {
      model: Role,
      attributes: ["roleName"],
      through: { attributes: [] },
    },
  });

  if (!userWithRole) {
    throw new Error("User is not found");
  }
  const userData = userWithRole.toJSON();
  return userData;
};
const getAllUsers = async () => {
  const allUserResults = await User.findAll({
    include: {
      model: Role,
      attribute: ["roleName"],
    },
  });
  if (!allUserResults) {
    throw new Error("User not found");
  }
  const allUserData = allUserResults.map((user) => {
    const userJson = user.toJSON();
    return {
      userId: userJson.id,
      avatar: userJson.avatar,
      fullName: `${userJson.firstName} ${userJson.lastName}`,
      firstName: userJson.firstName,
      lastName: userJson.lastName,
      email: userJson.email,
      roleList: userJson.Roles?.map((role) => role.roleName) || [],
      createdAt: userJson.createdAt,
      updatedAt: userJson.updatedAt,
    };
  });
  return allUserData;
};

const getUserById = async (userId) => {
  const getUsersByIdResult = await User.findByPk(userId, {
    include: {
      model: Role,
      attribute: ["roleName"],
    },
  });
  if (!getUsersByIdResult) {
    throw new Error("User not found");
  }
  const userDataById = getUsersByIdResult.toJSON();
  return userDataById;
};
const checkMailExists = async (email) => {
  try {
    const existingUser = await User.findOne({ where: { email: email } });
    return existingUser !== null;
  } catch (error) {
    throw new Error(error.message);
  }
};
const createUser = async ({
  avatar,
  firstName,
  lastName,
  email,
  password,
  roleId,
}) => {
  const transaction = await sequelize.transaction();
  try {
    const emailExists = await checkMailExists(email);
    if (emailExists) {
      throw new Error("Email already exists");
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const avatars = await uploadImageToCloudinary(avatar, firstName, "avatars");
    const addUserResult = await User.create(
      {
        avatar: avatars,
        firstName,
        lastName,
        email,
        password: hashedPassword,
      },
      { transaction }
    );

    for (const role of roleId) {
      if (isNaN(role)) {
        throw new Error("roleId is not integer");
      }
      await UserRole.create(
        {
          userId: addUserResult.id,
          roleId: role,
        },
        { transaction }
      );
    }

    await transaction.commit();
    const userWithRole = await User.findOne({
      where: { id: addUserResult.id },
      include: {
        model: Role,
        attributes: ["roleName"],
        through: { attributes: [] },
      },
    });
    const userData = userWithRole.toJSON();
    return userData;
  } catch (err) {
    await transaction.rollback();
    throw err;
  }
};
const deleteUser = async (userId) => {
  const deleteResult = await User.destroy({ where: { id: userId } });
  if (!deleteResult) {
    throw new Error("User not found");
  }
};

const deleteMyUser = async (userId) => {
  const userMyUser = await User.findByPk(userId);
  if (!userMyUser) {
    throw new Error("User not found");
  }
  await User.destroy({
    where: { id: userId },
  });
};

const updateUserByAdmin = async ({
  userId,
  avatar,
  firstName,
  lastName,
  email,
  password,
  roleId,
}) => {
  const transaction = await sequelize.transaction();
  try {
    const avatars = await uploadImageToCloudinary(avatar, firstName, "avatars");
    const user = await User.findByPk(userId);
    if (!user) {
      throw new Error("User not found");
    }
    user.avatar = avatars;
    user.firstName = firstName;
    user.lastName = lastName;
    if (email && email !== user.email) {
      const emailExists = await checkMailExists(email);
      if (emailExists) {
        throw new Error("Email already exists");
      }
    }
    user.email = email;
    if (password) {
      user.password = await bcrypt.hash(password, 10);
    }

    await user.save({ transaction });
    await UserRole.destroy({
      where: { userId: user.id },
      transaction,
    });
    for (const role of roleId) {
      if (isNaN(role)) {
        throw { code: "INVALID_ROLE_ID", message: "roleId is not integer" };
      }
      const roleExists = await Role.findByPk(role);
      if (!roleExists) {
        throw new Error(`Role with ID ${role} not found`);
      }
      const existingRole = await UserRole.findOne({
        where: { userId: user.id, roleId: role },
        transaction,
      });
      if (!existingRole) {
        await UserRole.create(
          { userId: user.id, roleId: role },
          { transaction }
        );
      }
    }
    await transaction.commit();
    const userWithRole = await User.findOne({
      where: { id: userId },
      include: {
        model: Role,
        attributes: ["roleName"],
      },
    });
    const userData = userWithRole.toJSON();
    return userData;
  } catch (error) {
    await transaction.rollback();
    throw new Error(error.message);
  }
};

const updateMyInfo = async ({
  userId,
  avatar,
  firstName,
  lastName,
  email,
  password,
}) => {
  const user = await User.findByPk(userId);
  if (!user) {
    throw new Error("User not found");
  }
  user.password = await bcrypt.hash(password, 10);

  if (email && email !== user.email) {
    const emailExists = await checkMailExists(email);
    if (emailExists) {
      throw new Error("Email already exists");
    }
  }
  const avatars = await uploadImageToCloudinary(avatar, firstName, "avatars");
  await user.update({
    avatar: avatars,
    firstName,
    lastName,
    email,
    password: user.password,
  });

  const userWithRole = await User.findOne({
    where: { id: userId },
    include: {
      model: Role,
      attributes: ["roleName"],
    },
  });
  const userData = userWithRole.toJSON();
  return userData;
};
module.exports = {
  getMyInfo,
  getAllUsers,
  getUserById,
  checkMailExists,
  createUser,
  deleteUser,
  deleteMyUser,
  updateUserByAdmin,
  updateMyInfo,
};
