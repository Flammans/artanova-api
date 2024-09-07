import {Sequelize, DataTypes, Model} from 'sequelize';

let sequelize: Sequelize;

class User extends Model {
  declare id: number;
  declare name: string;
  declare email: string;
  declare password: string;
}

export function useDb () {
  const config = useRuntimeConfig();

  return {
    User,
    init: (): Sequelize => {
      sequelize = new Sequelize(config.databaseUrl);

      User.init(
          {
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
          },
          {
            tableName: 'users',
            sequelize,
          },
      );

      return sequelize;
    },
  };
}
