//https://nitro.unjs.io/config
export default defineNitroConfig({
  runtimeConfig: {
    databaseUrl: '',
    jwtSecret: 'secret',
  },
  experimental: {
    tasks: true,
  },
  scheduledTasks: {
    '0 * * * *': ['update'],
  },
});
