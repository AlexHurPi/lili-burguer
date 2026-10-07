/* ============================================================================= 
    R2 Service
   Este servicio se encarga de subir y obtener imagenes de Cloudflare R2 
 ============================================================================= */

import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

// Inicialización del cliente S3 configurado para Cloudflare R2
const s3Client = new S3Client({
  region: "auto", // R2 utiliza 'auto' como región
  endpoint: import.meta.env.VITE_R2_ENDPOINT,
  credentials: {
    accessKeyId: import.meta.env.VITE_R2_ACCESS_KEY_ID,
    secretAccessKey: import.meta.env.VITE_R2_SECRET_ACCESS_KEY,
  },
});

/**
 * Sube un archivo de imagen directamente a Cloudflare R2
 * @param {File} file - Archivo obtenido del input type="file"
 * @returns {Promise<string>} URL pública de la imagen subida
 */
export const uploadImageToR2 = async (file) => {
  if (!file) return null;

  // 1. Validar que sea un archivo de imagen
  if (!file.type.startsWith("image/")) {
    throw new Error("El archivo seleccionado debe ser una imagen válida.");
  }

  // 2. Crear un nombre único de archivo para evitar colisiones
  const extension = file.name.split(".").pop() || "webp";
  const fileName = `products/prod_${Date.now()}_${Math.random().toString(36).substring(2, 7)}.${extension}`;

  // 3. Convertir el archivo a ArrayBuffer para el envío binario
  const fileArrayBuffer = await file.arrayBuffer();

  const command = new PutObjectCommand({
    Bucket: import.meta.env.VITE_R2_BUCKET_NAME,
    Key: fileName,
    Body: new Uint8Array(fileArrayBuffer),
    ContentType: file.type,
  });

  // 4. Enviar a Cloudflare R2
  await s3Client.send(command);

  // 5. Retornar la URL pública para guardarla en Firestore
  const publicBaseUrl = import.meta.env.VITE_R2_PUBLIC_URL.replace(/\/$/, "");
  return `${publicBaseUrl}/${fileName}`;
};