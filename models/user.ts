import {DataTypes, Model, ModelAttributes} from 'sequelize';

export default class extends Model {
  static tableName = 'users';

  static attributes: ModelAttributes = {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: new DataTypes.STRING,
    },
    email: {
      type: new DataTypes.STRING,
      unique: true,
    },
    password: {
      type: new DataTypes.STRING,
    },
  };

  declare id: number;
  declare name: string;
  declare email: string;
  declare password: string;
}
