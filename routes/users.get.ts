import {User} from '~/plugins/db';

export default defineEventHandler(() => {
  return {hello: User.findAll()};
});
