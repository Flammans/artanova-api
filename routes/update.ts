export default defineEventHandler((event) => {
  runTask('update');

  return 'OK';
});
