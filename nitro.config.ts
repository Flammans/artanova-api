//https://nitro.unjs.io/config
export default defineNitroConfig({
  runtimeConfig: {
    databaseUrl: 'sqlite:db.sqlite',
    jwtSecret: 'secret',
  },
  experimental: {
    tasks: true,
  },
  scheduledTasks: {
    '0 * * * *': ['update'],
  },
});
