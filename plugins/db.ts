export default defineNitroPlugin((nitro) => {
  const db = useDb();

  db.init();

  nitro.hooks.hookOnce('close', async () => {
    db.close();
  });
});
