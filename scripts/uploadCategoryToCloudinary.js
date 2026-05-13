import "dotenv/config";
import fs from "fs";
import path from "path";
import { v2 as cloudinary } from "cloudinary";

const eventId = process.argv[2];
const categoryId = process.argv[3];

if (!eventId || !categoryId) {
  console.error("❌ Debés indicar eventId y categoryId.");
  console.log("Ejemplo: npm run upload:category cpro-capilla-2026 tanda-2");
  process.exit(1);
}

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const categoryFolder = path.join(
  process.cwd(),
  "public",
  "images",
  "events",
  eventId,
  categoryId
);

const outputFolder = path.join(process.cwd(), "src", "data", "generated");

const photosOutputFile = path.join(
  outputFolder,
  `${eventId}.${categoryId}.cloudinary.json`
);

const metaOutputFile = path.join(
  outputFolder,
  `${eventId}.${categoryId}.meta.json`
);

if (!fs.existsSync(categoryFolder)) {
  console.error(`❌ No existe la carpeta: ${categoryFolder}`);
  process.exit(1);
}

if (!fs.existsSync(outputFolder)) {
  fs.mkdirSync(outputFolder, { recursive: true });
}

const allowedExtensions = [".jpg", ".jpeg", ".webp", ".png"];

const allImageFiles = fs
  .readdirSync(categoryFolder)
  .filter((file) => allowedExtensions.includes(path.extname(file).toLowerCase()));

const coverFile = allImageFiles.find(
  (file) => path.parse(file).name.toLowerCase() === "cover"
);

const photoFiles = allImageFiles
  .filter((file) => path.parse(file).name.toLowerCase() !== "cover")
  .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));

let coverImage = null;

if (coverFile) {
  const coverPath = path.join(categoryFolder, coverFile);

  console.log(`⬆️ Subiendo portada ${coverFile}...`);

  const coverResult = await cloudinary.uploader.upload(coverPath, {
    folder: `juan-acosta-photography/events/${eventId}/${categoryId}`,
    public_id: "cover",
    overwrite: true,
    resource_type: "image",
  });

  coverImage = coverResult.secure_url.replace(
    "/upload/",
    "/upload/f_auto,q_auto,w_1600/"
  );
}

const uploadedPhotos = [];

for (const file of photoFiles) {
  const filePath = path.join(categoryFolder, file);
  const id = path.parse(file).name;

  console.log(`⬆️ Subiendo ${file}...`);

  const result = await cloudinary.uploader.upload(filePath, {
    folder: `juan-acosta-photography/events/${eventId}/${categoryId}`,
    public_id: id,
    overwrite: true,
    resource_type: "image",
  });

  uploadedPhotos.push({
    id,
    image: result.secure_url.replace(
      "/upload/",
      "/upload/f_auto,q_auto,w_1200/"
    ),
    thumbnail: result.secure_url.replace(
      "/upload/",
      "/upload/f_auto,q_auto:good,w_700/"
    ),
    publicId: result.public_id,
  });
}

fs.writeFileSync(photosOutputFile, JSON.stringify(uploadedPhotos, null, 2));

if (coverImage) {
  fs.writeFileSync(
    metaOutputFile,
    JSON.stringify({ coverImage }, null, 2)
  );
}

console.log("✅ Subida de categoría finalizada.");
console.log(`📁 Evento: ${eventId}`);
console.log(`📁 Categoría: ${categoryId}`);
console.log(`📸 Fotos subidas: ${uploadedPhotos.length}`);
console.log(`📝 JSON generado: ${photosOutputFile}`);

if (coverImage) {
  console.log(`🖼️ Meta generado: ${metaOutputFile}`);
}