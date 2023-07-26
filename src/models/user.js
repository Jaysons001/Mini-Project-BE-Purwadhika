"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.hasMany(models.Blog, { foreignKey: "userId" });
    }
  }
  User.init(
    {
      user: { type: DataTypes.STRING, unique: true },
      email: DataTypes.STRING,
      phone: DataTypes.STRING,
      password: DataTypes.STRING,
      isVerified: DataTypes.STRING,
      imgProfile: DataTypes.STRING,
      isVerified: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      role: {
        type: DataTypes.STRING,
        defaultValue: "user",
      },
    },
    {
      sequelize,
      modelName: "User",
    }
  );
  return User;
};
