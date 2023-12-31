'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class UserLogin extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  UserLogin.init({
    userName: DataTypes.STRING,
    userEmail: DataTypes.STRING,
    userPassword: DataTypes.STRING,
    costOfLiving: DataTypes.FLOAT,
    totalIncomeUser: DataTypes.FLOAT
  }, {
    sequelize,
    modelName: 'UserLogin',
  });
  return UserLogin;
};