import {H3Event} from 'h3';
import {User} from '~/plugins/db';

interface JwtPayload {
  userId: number;
}

export function useUser () {
  const jwt = useJwt<JwtPayload>();

  return {
    getFromEvent: async (event: H3Event): Promise<User> => {
      const header = getRequestHeader(event, 'Authorization');
      const token = header?.replace('Bearer ', '');

      if (!token) {
        throw new Error('Unauthorized');
      }

      const payload = await jwt.verify(token);

      const user = await User.findByPk(payload.userId);

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
