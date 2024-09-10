//https://nitro.unjs.io/config
export default defineNitroConfig({
  runtimeConfig: {
    databaseUrl: '',
    jwtSecret: 'secret',
    artworksLimit: 100,
  },
  experimental: {
    tasks: true,
  },
  scheduledTasks: {
    '0 * * * *': ['update'],
  },
});
