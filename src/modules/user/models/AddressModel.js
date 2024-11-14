const { DataTypes } = require("sequelize");
const sequelize = require("../../../config/db/index");
const moment = require("moment-timezone");

const Address = sequelize.define(
  "Addresses",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: "Users",
        key: "id",
      },
      onDelete: "CASCADE",
    },
    fullName: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    phoneNumber: {
      type: DataTypes.STRING(10),
      allowNull: false,
    },
    addressType: {
      type: DataTypes.ENUM("HOME", "OFFICE"),
      allowNull: false,
      defaultValue: "HOME",
    },
    provinceCode: {
      type: DataTypes.STRING(10),
      allowNull: false,
      reference: {
        model: "Provinces",
        key: "code",
      },
    },
    districtCode: {
      type: DataTypes.STRING(10),
      allowNull: false,
      reference: {
        model: "Districts",
        key: "code",
      },
    },
    wardCode: {
      type: DataTypes.STRING(10),
      allowNull: false,
      reference: {
        model: "Wards",
        key: "code",
      },
    },
    address: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    isPrimary: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      get() {
        const rawValue = this.getDataValue("createdAt");
        return rawValue
          ? moment
              .utc(rawValue)
              .tz("Asia/Ho_Chi_Minh")
              .format("HH:mm:ss DD/MM/YYYY")
          : null;
      },
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      get() {
        const rawValue = this.getDataValue("updatedAt");
        return rawValue
          ? moment
              .utc(rawValue)
              .tz("Asia/Ho_Chi_Minh")
              .format("HH:mm:ss DD/MM/YYYY")
          : null;
      },
    },
  },
  {
    tableName: "Addresses",
    modelName: "Address",
    timestamps: true,
  }
);

const AdministrativeRegion = sequelize.define(
  "AdministrativeRegions",
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    nameEn: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    codeName: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    codeNameEn: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
  },
  {
    tableName: "AdministrativeRegions",
    timestamps: false,
  }
);

const AdministrativeUnit = sequelize.define(
  "AdministrativeUnits",
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
    },
    fullName: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    fullNameEn: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    shortName: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    shortNameEn: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    codeName: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    codeNameEn: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
  },
  {
    tableName: "AdministrativeUnits",
    timestamps: false,
  }
);

const Province = sequelize.define(
  "Provinces",
  {
    code: {
      type: DataTypes.STRING(20),
      allowNull: false,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    nameEn: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    fullName: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    fullNameEn: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    codeName: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    administrativeUnitId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: "AdministrativeUnits",
        key: "id",
      },
    },
    administrativeRegionId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: "AdministrativeRegions",
        key: "id",
      },
    },
  },
  {
    tableName: "Provinces",
    timestamps: false,
    indexes: [
      { fields: ["administrativeRegionId"] },
      { fields: ["administrativeUnitId"] },
    ],
  }
);

const District = sequelize.define(
  "Districts",
  {
    code: {
      type: DataTypes.STRING(20),
      allowNull: false,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    nameEn: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    fullName: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    fullNameEn: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    codeName: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    provinceCode: {
      type: DataTypes.STRING(20),
      allowNull: true,
      references: {
        model: "Provinces",
        key: "code",
      },
    },
    administrativeUnitId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: "AdministrativeUnits",
        key: "id",
      },
    },
  },
  {
    tableName: "Districts",
    timestamps: false,
    indexes: [
      { fields: ["provinceCode"] },
      { fields: ["administrativeUnitId"] },
    ],
  }
);

const Ward = sequelize.define(
  "Wards",
  {
    code: {
      type: DataTypes.STRING(20),
      allowNull: false,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    nameEn: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    fullName: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    fullNameEn: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    codeName: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    districtCode: {
      type: DataTypes.STRING(20),
      allowNull: true,
      references: {
        model: "Districts",
        key: "code",
      },
    },
    administrativeUnitId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: "AdministrativeUnits",
        key: "id",
      },
    },
  },
  {
    tableName: "Wards",
    timestamps: false,
    indexes: [
      { fields: ["districtCode"] },
      { fields: ["administrativeUnitId"] },
    ],
  }
);

module.exports = {
  Address,
  Province,
  District,
  Ward,
  AdministrativeRegion,
  AdministrativeUnit,
};
