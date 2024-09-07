export default defineNitroPlugin((nitro) => {
  const sequelize = useDb().init();

  sequelize.sync({
    alter: true,
  });

  nitro.hooks.hookOnce('close', async () => {
    sequelize.close();
  });
});
