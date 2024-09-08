import {H3Event} from 'h3';
import {useJwt} from '~/utils/jwt';
import User from '~/models/user';

interface Payload {
  id: number;
}

export function useUser () {
  const jwt = useJwt<Payload>();

  return {
    getFromEvent: async (event: H3Event): Promise<User> => {
      const header = getRequestHeader(event, 'Authorization');
      const token = header?.replace('Bearer ', '');

      if (!token) {
        throw new Error('Unauthorized');
      }

      const payload = await jwt.verify(token);

      const user = await User.findByPk(payload.id);

      if (!user) {
        throw new Error('User not found');
      }

      return user;
    },
    generateToken: async (user: User): Promise<string> => {
      return jwt.sign({
        id: user.id,
      });
    },
  };
}
