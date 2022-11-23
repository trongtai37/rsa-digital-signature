// Reference: https://gist.github.com/deiu/2c3208c89fbc91d23226
import { convertBinaryToPem, convertPemToBinary } from './data';

const HASH_ALGORITHM = 'SHA-256';
const SIGN_ALGORITHM = 'RSASSA-PKCS1-v1_5';

const signAlgorithmParams = {
  name: SIGN_ALGORITHM,
  hash: {
    name: HASH_ALGORITHM,
  },
  modulusLength: 2048,
  extractable: false,
  publicExponent: new Uint8Array([1, 0, 1]),
};

export async function digestDocument(
  text: string,
  algorithm: string
): Promise<string> {
  const encoder = new TextEncoder();
  const decoder = new TextDecoder();
  const data = encoder.encode(text);

  const hash = await crypto.subtle.digest(algorithm, data);
  return decoder.decode(hash);
}

export async function importPublicKey(pem: string): Promise<CryptoKey> {
  const binaryDer = convertPemToBinary(pem);
  return window.crypto.subtle.importKey(
    'spki',
    binaryDer,
    {
      name: SIGN_ALGORITHM,
      hash: HASH_ALGORITHM,
    },
    true,
    ['verify']
  );
}

export async function importPrivateKey(pem: string): Promise<CryptoKey> {
  const binaryDer = convertPemToBinary(pem);
  return window.crypto.subtle.importKey(
    'pkcs8',
    binaryDer,
    {
      name: SIGN_ALGORITHM,
      hash: HASH_ALGORITHM,
    },
    true,
    ['sign']
  );
}

export async function exportPrivateKey(
  key: CryptoKeyPair['privateKey']
): Promise<string> {
  const exported = await crypto.subtle.exportKey('pkcs8', key);
  return convertBinaryToPem(exported, 'RSA PRIVATE KEY');
}

export async function exportPublicKey(key: CryptoKeyPair['publicKey']) {
  const exported = await window.crypto.subtle.exportKey('spki', key);
  return convertBinaryToPem(exported, 'RSA PUBLIC KEY');
}

export async function generateRSAKeyPair(length: number) {
  const rsaAlgo: RsaHashedKeyGenParams = {
    ...signAlgorithmParams,
    modulusLength: length,
  };

  const keyPair = await crypto.subtle.generateKey(rsaAlgo, true, [
    'sign',
    'verify',
  ]);

  return keyPair;
}

export function sign(): string {
  // return window.crypto.subtle.sign(signAlgorithm, key, textToArrayBuffer(data))
  return '';
}

export function verify(): boolean {
  // return crypto.subtle.verify(signAlgorithm, pub, sig, data)
  return true;
}
