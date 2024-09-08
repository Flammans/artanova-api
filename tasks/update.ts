import artic from '~/drivers/artic';

export default defineTask({
  meta: {
    name: 'update',
    description: 'Update database',
  },
  async run () {
    await Promise.all([
      artic(),
    ]);

    return {
      result: 'Success',
    };
  },
});
