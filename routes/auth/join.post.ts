import {defineEventHandler, readValidatedBody} from 'h3';
import {z} from 'zod';
import {sha256} from 'ohash';
import {User} from '~/plugins/db';

export default defineEventHandler(async (event) => {
  const body = await readValidatedBody(event, z.object({
    name: z.string(),
    email: z.string().email(),
    password: z.string().min(8),
  }).parse);

  if (await User.findOne({where: {email: body.email}})) {
    throw new Error('Email already in use');
  }

  const user = await User.create({
    name: body.name,
    email: body.email,
    password: sha256(body.password),
  });

  return {
    name: user.name,
    email: user.email,
    token: await useUser().generateToken(user),
  };
});
