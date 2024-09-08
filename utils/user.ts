import {H3Event} from 'h3';
import {Prisma} from '@prisma/client';

type User = Prisma.UserGetPayload<{}>
type JwtPayload = {
  userId: number;
}

export function useUser () {
  const jwt = useJwt<JwtPayload>();
  const prisma = usePrisma();

  return {
    getFromEvent: async (event: H3Event): Promise<User> => {
      const header = getRequestHeader(event, 'Authorization');
      const token = header?.replace('Bearer ', '');

      if (!token) {
        throw new Error('Unauthorized');
      }

      const payload = await jwt.verify(token);

      const user = await prisma.user.findUnique({
        where: {
          id: payload.userId,
        },
      });

      if (!user) {
        throw new Error('User not found');
      }

      return user;
    },
    generateToken: async (user: User): Promise<string> => {
      return jwt.sign({
        userId: user.id,
      });
    },
  };
}
