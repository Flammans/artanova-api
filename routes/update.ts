export default eventHandler((event) => {
  runTask('update');

  return 'OK';
});
