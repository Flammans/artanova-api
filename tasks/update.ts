export default defineTask({
  meta: {
    name: 'update',
    description: 'Update database',
  },
  run ({payload, context}) {
    console.log('Running task...');

    return {
      result: 'Success',
    };
  },
});
