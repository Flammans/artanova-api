import {Sequelize} from 'sequelize';
import User from '~/models/user';

export default defineNitroPlugin((nitro) => {
  const config = useRuntimeConfig();

  const sequelize = new Sequelize(config.databaseUrl);

  [User].forEach((model) => {
    model.init(model.attributes, {
      sequelize,
      tableName: model.tableName,
    });
  });

  sequelize.sync({
    alter: true,
  });

  nitro.hooks.hookOnce('close', async () => {
    sequelize.close();
  });
});
