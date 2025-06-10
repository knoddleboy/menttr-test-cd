export async function encodeSHA256(data: string): Promise<string> {
  const encoder = new TextEncoder();
  const buffer = encoder.encode(data);
  const hashBuffer = await crypto.subtle.digest("SHA-256", buffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
  return hashHex;
}

export async function verifySHA256(
  data: string,
  hash: string,
): Promise<boolean> {
  const computedHash = await encodeSHA256(data);
  return computedHash === hash;
}
