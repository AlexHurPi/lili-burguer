/* ============================================================================= 
    R2 Service
   Este servicio se encarga de subir y obtener imagenes de Cloudflare R2 
 ============================================================================= */

import { S3Client, PutObjectCommand, ListObjectsV2Command } from "@aws-sdk/client-s3";

/**
 * Helper interno para inicializar y validar el cliente S3 de Cloudflare R2
 */
const getS3Client = () => {
  const accessKeyId = import.meta.env.VITE_R2_ACCESS_KEY_ID;
  const secretAccessKey = import.meta.env.VITE_R2_SECRET_ACCESS_KEY;
  const endpoint = import.meta.env.VITE_R2_ENDPOINT;
  const bucketName = import.meta.env.VITE_R2_BUCKET_NAME;

  if (!accessKeyId || !secretAccessKey || !endpoint || !bucketName) {
    throw new Error("Faltan configurar las variables de entorno de Cloudflare R2 en el archivo .env");
  }

  const s3Client = new S3Client({
    region: "auto",
    endpoint,
    credentials: {
      accessKeyId,
      secretAccessKey,
    },
  });

  return { s3Client, bucketName };
};

/**
 * Sube una imagen directamente a la carpeta 'products/' de Cloudflare R2
 * @param {File} file - Archivo de imagen seleccionado localmente
 * @returns {Promise<string|null>} URL pública final de la imagen guardada
 */
export const uploadImageToR2 = async (file) => {
  if (!file) return null;

  if (!file.type.startsWith("image/")) {
    throw new Error("El archivo seleccionado debe ser una imagen válida.");
  }

  const { s3Client, bucketName } = getS3Client();

  const extension = file.name.split(".").pop() || "webp";
  const fileName = `products/prod_${Date.now()}_${Math.random().toString(36).substring(2, 7)}.${extension}`;
  const fileArrayBuffer = await file.arrayBuffer();

  const command = new PutObjectCommand({
    Bucket: bucketName,
    Key: fileName,
    Body: new Uint8Array(fileArrayBuffer),
    ContentType: file.type,
  });

  await s3Client.send(command);

  const publicBaseUrl = (import.meta.env.VITE_R2_PUBLIC_URL || "").replace(/\/$/, "");
  return `${publicBaseUrl}/${fileName}`;
};

/**
 * Consulta y lista todas las imágenes almacenadas en la carpeta 'products/' de R2
 * @returns {Promise<string[]>} Arreglo de URLs públicas ordenadas de la más reciente a la más antigua
 */
export const listR2Images = async () => {
  try {
    const { s3Client, bucketName } = getS3Client();
    const publicBaseUrl = (import.meta.env.VITE_R2_PUBLIC_URL || "").replace(/\/$/, "");

    const command = new ListObjectsV2Command({
      Bucket: bucketName,
      Prefix: "products/",
    });

    const response = await s3Client.send(command);

    if (!response.Contents || response.Contents.length === 0) {
      return [];
    }

    // Filtra marcadores de carpetas y las ordena por fecha de modificación
    return response.Contents
      .filter((item) => item.Key && !item.Key.endsWith("/"))
      .sort((a, b) => new Date(b.LastModified) - new Date(a.LastModified))
      .map((item) => `${publicBaseUrl}/${item.Key}`);
  } catch (error) {
    console.error("Error al listar imágenes de Cloudflare R2:", error);
    throw error;
  }
};