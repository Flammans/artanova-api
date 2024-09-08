import {defineEventHandler, readValidatedBody} from 'h3';
import {sha256} from 'ohash';
import {z} from 'zod';

export default defineEventHandler(async (event) => {
  const body = await readValidatedBody(event, z.object({
    email: z.string().email(),
    password: z.string(),
  }).parse);

  const prisma = usePrisma();

  const user = await prisma.user.findUnique({
    where: {
      email: body.email,
      password: sha256(body.password),
    },
  });

  if (!user) {
    throw new Error('Invalid credentials');
  }

  return {
    name: user.name,
    email: user.email,
    token: await useUser().generateToken(user),
  };
});
