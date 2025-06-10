export function base64EncodeArray(data: unknown[]): string {
  const jsonString = JSON.stringify(data);
  const utf8Bytes = new TextEncoder().encode(jsonString);
  const binary = String.fromCharCode(...utf8Bytes);
  return btoa(binary);
}

export function base64DecodeArray(base64: string): unknown[] {
  const binary = atob(base64);
  const bytes = new Uint8Array([...binary].map((char) => char.charCodeAt(0)));
  const jsonString = new TextDecoder().decode(bytes);
  return JSON.parse(jsonString) as unknown[];
}
