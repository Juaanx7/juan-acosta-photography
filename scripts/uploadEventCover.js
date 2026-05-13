import "dotenv/config";
import path from "path";
import fs from "fs";
import { v2 as cloudinary } from "cloudinary";

const eventId = process.argv[2];

if (!eventId) {
  console.error("❌ Debés indicar el eventId.");
  console.log("Ejemplo: npm run upload:event-cover cpro-capilla-2026");
  process.exit(1);
}

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const coverPath = path.join(
  process.cwd(),
  "public",
  "images",
  "events",
  eventId,
  "event-cover",
  "cover.webp"
);

if (!fs.existsSync(coverPath)) {
  console.error("❌ No existe cover.webp");
  process.exit(1);
}

console.log("⬆️ Subiendo portada general...");

const result = await cloudinary.uploader.upload(coverPath, {
  folder: `juan-acosta-photography/events/${eventId}`,
  public_id: "event-cover",
  overwrite: true,
  resource_type: "image",
});

const outputFolder = path.join(process.cwd(), "src", "data", "generated");

if (!fs.existsSync(outputFolder)) {
  fs.mkdirSync(outputFolder, { recursive: true });
}

const metaFile = path.join(
  outputFolder,
  `${eventId}.event-cover.meta.json`
);

const data = {
  coverImage: result.secure_url.replace(
    "/upload/",
    "/upload/f_auto,q_auto,w_1600/"
  ),
};

fs.writeFileSync(metaFile, JSON.stringify(data, null, 2));

console.log("✅ Cover general subido.");
console.log(`📝 Meta generado: ${metaFile}`);