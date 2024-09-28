import { z } from 'zod'

export default defineEventHandler(async (event) => {
  const { uuid, id } = await getValidatedRouterParams(event, z.object({
    uuid: z.string().uuid(),
    id: z.coerce.number()
  }).parse)
  const user = await useUser().getFromEvent(event)
  const prisma = usePrisma()

  const collection = await prisma.collection.findFirstOrThrow({
    where: {
      uuid,
      userId: user.id,
    },
  })

  const element = await prisma.element.findFirstOrThrow({
    where: {
      artworkId: id,
      collectionId: collection.id,
    }
  })

  await prisma.element.delete({
    where: {
      id: element.id,
    },
  })

  return
})
