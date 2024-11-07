const User = require("../../auth/models/UserModel");
const Role = require("../../auth/models/RoleModel");
const UserRole = require("../../auth/models/UserRoleModel");
const bcrypt = require("bcrypt");
const sequelize = require("../../../config/db/index");
const { uploadImageToCloudinary } = require("../../../shared/utils/upload");
const fs = require("fs");
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
    console.error("Error checking email", error);
    throw new Error("Internal Server Error");
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
    const avatars = await uploadImageToCloudinary(avatar);
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
    await UserRole.create(
      {
        userId: addUserResult.id,
        roleId,
      },
      { transaction }
    );

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
  const user = await User.findByPk(userId);
  if (!user) {
    throw new Error("User not found");
  }
  user.avatar = avatar;
  user.firstName = firstName;
  user.lastName = lastName;
  if (email && email !== user.email) {
    const emailExists = await checkMailExists(user.email);
    if (emailExists) {
      throw new Error("Email already exists");
    }
  }
  user.email = email;
  user.password = await bcrypt.hash(password, 10);

  await user.save();

  await UserRole.update({ roleId: roleId }, { where: { userId: user.id } });

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
  const avt = await uploadImageToCloudinary(avatar);
  fs.unlinkSync(avatar);
  await user.update({
    avatar: avt,
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
