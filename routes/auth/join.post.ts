import {defineEventHandler, readValidatedBody} from 'h3';
import {z} from 'zod';
import {sha256} from 'ohash';

export default defineEventHandler(async (event) => {
  const body = await readValidatedBody(event, z.object({
    name: z.string(),
    email: z.string().email(),
    password: z.string().min(8),
  }).parse);

  const {User} = useDb();

  if (await User.findOne({where: {email: body.email}})) {
    throw new Error('Email already in use');
  }

  const user = await User.create({
    name: body.name,
    email: body.email,
    password: sha256(body.password),
  });

  return {id: user.id};
});