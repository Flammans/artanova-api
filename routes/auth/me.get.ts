export default defineEventHandler(async (event) => {
  const user = await useUser().getFromEvent(event);

  return {
    name: user.name,
    email: user.email,
  };
});
