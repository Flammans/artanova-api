import {z} from 'zod';
import {sha256} from 'ohash';

export default defineEventHandler(async (event) => {
  const body = await readValidatedBody(event, z.object({
    name: z.string(),
    email: z.string().email(),
    password: z.string().min(8),
  }).parse);

  const prisma = usePrisma();

  if (await prisma.user.findUnique({where: {email: body.email}})) {
    throw new Error('Email already in use');
  }

  const user = await prisma.user.create({
    data: {
      name: body.name,
      email: body.email,
      password: sha256(body.password),
    },
  });

  return {
    name: user.name,
    email: user.email,
    token: await useUser().generateToken(user),
  };
});
