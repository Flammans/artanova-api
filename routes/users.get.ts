export default defineEventHandler(() => {
  const {User} = useDb();

  return {hello: User.findAll()};
});
