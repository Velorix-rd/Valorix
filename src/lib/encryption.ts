// Web Crypto API standard AES-GCM client-side encryption & decryption

function arrayBufferToBase64(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  const len = bytes.byteLength;
  const chunkSize = 8192;
  let binary = '';
  for (let i = 0; i < len; i += chunkSize) {
    const chunk = bytes.subarray(i, Math.min(i + chunkSize, len));
    binary += String.fromCharCode.apply(null, chunk as unknown as number[]);
  }
  return btoa(binary);
}



function base64ToArrayBuffer(base64: string): ArrayBuffer {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes.buffer;
}

export interface EncryptResult {
  encryptedFile: File;
  iv: string;
  key: string;
}

/**
 * Encrypts a File using client-side AES-GCM (256-bit).
 * Returns encrypted File, base64 IV, and exported base64 raw key.
 */
export async function encryptFile(file: File): Promise<EncryptResult> {
  if (!crypto.subtle) {
    throw new Error('Web Crypto API is not supported in this browser environment');
  }

  // 1. Generate 256-bit AES-GCM key
  const cryptoKey = await crypto.subtle.generateKey(
    { name: 'AES-GCM', length: 256 },
    true,
    ['encrypt', 'decrypt']
  );

  // 2. Generate random 12-byte initialization vector (IV)
  const ivBytes = crypto.getRandomValues(new Uint8Array(12));

  // 3. Read file contents as ArrayBuffer
  const fileBuffer = await file.arrayBuffer();

  // 4. Encrypt data
  const ciphertextBuffer = await crypto.subtle.encrypt(
    { name: 'AES-GCM', iv: ivBytes },
    cryptoKey,
    fileBuffer
  );

  // 5. Export key and convert values to base64
  const exportedRawKey = await crypto.subtle.exportKey('raw', cryptoKey);
  const keyBase64 = arrayBufferToBase64(exportedRawKey);
  const ivBase64 = arrayBufferToBase64(ivBytes.buffer);

  // 6. Wrap encrypted buffer into a File with same name
  const encryptedFile = new File([ciphertextBuffer], file.name, {
    type: 'application/octet-stream',
    lastModified: file.lastModified
  });

  return {
    encryptedFile,
    iv: ivBase64,
    key: keyBase64
  };
}

/**
 * Decrypts an encrypted ArrayBuffer or Blob using the stored base64 IV and key.
 * Returns decrypted Blob with the target MIME type.
 */
export async function decryptFile(
  encryptedData: ArrayBuffer | Blob,
  ivBase64: string,
  keyBase64: string,
  originalMimeType?: string
): Promise<Blob> {
  if (!crypto.subtle) {
    throw new Error('Web Crypto API is not supported in this browser environment');
  }

  const rawBuffer = encryptedData instanceof Blob 
    ? await encryptedData.arrayBuffer() 
    : encryptedData;

  const keyBuffer = base64ToArrayBuffer(keyBase64);
  const ivBuffer = base64ToArrayBuffer(ivBase64);

  // Import raw key
  const cryptoKey = await crypto.subtle.importKey(
    'raw',
    keyBuffer,
    { name: 'AES-GCM', length: 256 },
    false,
    ['decrypt']
  );

  // Decrypt
  const decryptedBuffer = await crypto.subtle.decrypt(
    { name: 'AES-GCM', iv: new Uint8Array(ivBuffer) },
    cryptoKey,
    rawBuffer
  );

  return new Blob([decryptedBuffer], { type: originalMimeType || 'application/octet-stream' });
}
