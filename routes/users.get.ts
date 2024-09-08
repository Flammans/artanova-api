import User from '~/models/user';

export default defineEventHandler(() => {
  return {hello: User.findAll()};
});
