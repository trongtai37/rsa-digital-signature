export function arrayBufferToBase64String(arrayBuffer: ArrayBuffer): string {
  const byteArray = new Uint8Array(arrayBuffer);
  let byteString = '';
  for (let i = 0; i < byteArray.byteLength; i++) {
    byteString += String.fromCharCode(byteArray[i]);
  }
  return btoa(byteString);
}

export function base64StringToArrayBuffer(b64str: string): ArrayBuffer {
  const byteStr = atob(b64str);
  const bytes = new Uint8Array(byteStr.length);
  for (let i = 0; i < byteStr.length; i++) {
    bytes[i] = byteStr.charCodeAt(i);
  }
  return bytes.buffer;
}

export function convertBinaryToPem(
  binaryData: ArrayBuffer,
  label: `RSA ${'PUBLIC' | 'PRIVATE'} KEY`
) {
  const base64Cert = arrayBufferToBase64String(binaryData);
  let pemCert = '-----BEGIN ' + label + '-----\r\n';
  let nextIndex = 0;
  while (nextIndex < base64Cert.length) {
    if (nextIndex + 64 <= base64Cert.length) {
      pemCert += base64Cert.substr(nextIndex, 64) + '\r\n';
    } else {
      pemCert += base64Cert.substr(nextIndex) + '\r\n';
    }
    nextIndex += 64;
  }
  pemCert += '-----END ' + label + '-----\r\n';
  return pemCert;
}

export function convertPemToBinary(pem: string): ArrayBuffer {
  const lines = pem.split('\n');
  let encoded = '';
  for (let i = 0; i < lines.length; i++) {
    if (
      lines[i].trim().length > 0 &&
      lines[i].indexOf('-BEGIN RSA PRIVATE KEY-') < 0 &&
      lines[i].indexOf('-BEGIN RSA PUBLIC KEY-') < 0 &&
      lines[i].indexOf('-END RSA PRIVATE KEY-') < 0 &&
      lines[i].indexOf('-END RSA PUBLIC KEY-') < 0
    ) {
      encoded += lines[i].trim();
    }
  }
  return base64StringToArrayBuffer(encoded);
}

export function stringToArrayBuffer(text: string): ArrayBuffer {
  const encoder = new TextEncoder();
  return encoder.encode(text);
}

export function arrayBufferToString(arrayBuffer: ArrayBuffer): string {
  const decoder = new TextDecoder();
  return decoder.decode(arrayBuffer);
}
