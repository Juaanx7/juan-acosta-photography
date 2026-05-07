import "dotenv/config";
import fs from "fs";
import path from "path";
import { v2 as cloudinary } from "cloudinary";

const eventId = process.argv[2];

if (!eventId) {
  console.error("❌ Debés indicar el id del evento.");
  console.log("Ejemplo: npm run upload:cloudinary rio-pinto-2026");
  process.exit(1);
}

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const eventFolder = path.join(
  process.cwd(),
  "public",
  "images",
  "events",
  eventId
);

const outputFolder = path.join(process.cwd(), "src", "data", "generated");
const outputFile = path.join(outputFolder, `${eventId}.cloudinary.json`);

if (!fs.existsSync(eventFolder)) {
  console.error(`❌ No existe la carpeta: ${eventFolder}`);
  process.exit(1);
}

if (!fs.existsSync(outputFolder)) {
  fs.mkdirSync(outputFolder, { recursive: true });
}

const allowedExtensions = [".jpg", ".jpeg", ".webp", ".png"];

const allImageFiles = fs
  .readdirSync(eventFolder)
  .filter((file) => allowedExtensions.includes(path.extname(file).toLowerCase()));

const coverFile = allImageFiles.find((file) =>
  path.parse(file).name.toLowerCase() === "cover"
);

const files = allImageFiles
  .filter((file) => path.parse(file).name.toLowerCase() !== "cover")
  .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));

let coverImage = null;

if (coverFile) {
  const coverPath = path.join(eventFolder, coverFile);

  console.log(`⬆️ Subiendo portada ${coverFile}...`);

  const coverResult = await cloudinary.uploader.upload(coverPath, {
    folder: `juan-acosta-photography/events/${eventId}`,
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

for (const file of files) {
  const filePath = path.join(eventFolder, file);
  const id = path.parse(file).name;

  console.log(`⬆️ Subiendo ${file}...`);

  const result = await cloudinary.uploader.upload(filePath, {
    folder: `juan-acosta-photography/events/${eventId}`,
    public_id: id,
    overwrite: true,
    resource_type: "image",
  });

  uploadedPhotos.push({
    id,
    image: result.secure_url,
    thumbnail: result.secure_url.replace(
      "/upload/",
      "/upload/f_auto,q_auto,w_700/"
    ),
    publicId: result.public_id,
  });
}

fs.writeFileSync(outputFile, JSON.stringify(uploadedPhotos, null, 2));

if (coverImage) {
  const eventMetaFile = path.join(outputFolder, `${eventId}.meta.json`);

  fs.writeFileSync(
    eventMetaFile,
    JSON.stringify(
      {
        coverImage,
      },
      null,
      2
    )
  );

  console.log(`🖼️ Portada generada: ${eventMetaFile}`);
}

console.log("✅ Subida finalizada.");
console.log(`📸 Fotos subidas: ${uploadedPhotos.length}`);
console.log(`📝 JSON generado: ${outputFile}`);