export default defineEventHandler(async (event) => {
  const user = await useUser().getFromEvent(event)

  return {
    id: user.id,
    name: user.name,
    email: user.email,
  }
})
