import {SignJWT, JWTPayload, jwtVerify} from 'jose';

export function useJwt<T> () {
  const secret = new TextEncoder().encode(useRuntimeConfig().jwtSecret);
  const alg = 'HS256';

  return {
    sign: async (payload: T): Promise<string> => {
      return await new SignJWT(payload as JWTPayload)
          .setProtectedHeader({alg})
          .sign(secret);
    },
    verify: async (token: string): Promise<T> => {
      const {payload} = await jwtVerify(token, secret);

      return payload as T;
    },
  };
}
