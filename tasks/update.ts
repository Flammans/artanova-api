import artic from '~/sources/artic';
import metmuseum from '~/sources/metmuseum';

export default defineTask({
  meta: {
    name: 'update',
    description: 'Update database',
  },
  async run ({payload}) {
    const source = payload?.source;

    if (source === 'artic') {
      await artic();
    } else if (source === 'metmuseum') {
      await metmuseum();
    } else if (!source) {
      await Promise.all([
        artic(),
        metmuseum(),
      ]);
    } else {
      throw new Error('Invalid source');
    }

    return {
      result: 'Success',
    };
  },
});
