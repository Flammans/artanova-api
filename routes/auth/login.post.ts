import {defineEventHandler, readValidatedBody} from 'h3';
import {sha256} from 'ohash';
import {z} from 'zod';
import User from '~/models/user';

export default defineEventHandler(async (event) => {
  const body = await readValidatedBody(event, z.object({
    email: z.string().email(),
    password: z.string(),
  }).parse);

  const user = await User.findOne({
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
