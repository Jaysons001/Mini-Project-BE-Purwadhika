"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Blog extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.User, {
        foreignKey: "userId",
        as: "author",
      });
      this.belongsTo(models.Category, {
        foreignKey: "categoryId",
      });
      this.belongsTo(models.Country, {
        foreignKey: "countryId",
      });
    }
  }
  Blog.init(
    {
      title: { type: DataTypes.STRING(150), validate: { max: 150 } },
      content: { type: DataTypes.STRING(500), validate: { max: 500 } },
      imgBlog: DataTypes.STRING,
      videoUrl: DataTypes.STRING,
      keywords: DataTypes.STRING,
      userId: DataTypes.INTEGER,
      categoryId: DataTypes.INTEGER,
      countryId: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "Blog",
    }
  );
  return Blog;
};
