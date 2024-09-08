import {
  DataTypes,
  Model,
  ModelAttributes,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
} from 'sequelize';

export default class User extends Model<
    InferAttributes<User>,
    InferCreationAttributes<User>
> {
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

  declare id: CreationOptional<number>;
  declare name: string;
  declare email: string;
  declare password: string;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
}
