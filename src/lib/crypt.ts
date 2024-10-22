import { SignJWT, jwtVerify, JWTPayload } from 'jose';

const secretKey = 'hahascret';
const key = new TextEncoder().encode(secretKey);

export async function encrypt(payload: JWTPayload, expiresIn: string) {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(expiresIn)
    .sign(key);
}

export async function decrypt(token: string) : Promise<any> {
  try {
    const { payload } = await jwtVerify(token, key, { algorithms: ['HS256'] });
    return payload;
  } catch (error) {
    if ((error as any).code === 'ERR_JWT_EXPIRED') {
      throw new Error('Token expired');
    }
    throw new Error('Invalid token');
  }
}
