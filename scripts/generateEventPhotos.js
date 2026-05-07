import fs from "fs";
import path from "path";

const eventId = process.argv[2];

if (!eventId) {
  console.error("❌ Debés indicar el id del evento.");
  console.log("Ejemplo: npm run generate:photos rio-pinto-2026");
  process.exit(1);
}

const eventFolder = path.join(
  process.cwd(),
  "public",
  "images",
  "events",
  eventId
);

const outputFolder = path.join(process.cwd(), "src", "data", "generated");
const outputFile = path.join(outputFolder, `${eventId}.json`);

if (!fs.existsSync(eventFolder)) {
  console.error(`❌ No existe la carpeta del evento: ${eventFolder}`);
  process.exit(1);
}

if (!fs.existsSync(outputFolder)) {
  fs.mkdirSync(outputFolder, { recursive: true });
}

const allowedExtensions = [".jpg", ".jpeg", ".webp", ".png"];

const photos = fs
  .readdirSync(eventFolder)
  .filter((file) => {
    const ext = path.extname(file).toLowerCase();
    return allowedExtensions.includes(ext) && !file.toLowerCase().startsWith("cover");
  })
  .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }))
  .map((file) => {
    const id = path.parse(file).name;

    return {
      id,
      image: `/images/events/${eventId}/${file}`,
    };
  });

fs.writeFileSync(outputFile, JSON.stringify(photos, null, 2));

console.log(`✅ Archivo generado correctamente: ${outputFile}`);
console.log(`📸 Fotos detectadas: ${photos.length}`);