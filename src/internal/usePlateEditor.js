import { useEffect, useState } from "react";
import { events } from "../data/events";
import { getEventPhotos } from "../utils/eventPhotos";
import { normalizePlates } from "../utils/plateMetadata";

const key = "juan-plate-editor-session-v1";
const initialSession = () => {
  try {
    const saved = JSON.parse(localStorage.getItem(key));
    if (saved && events.some((event) => event.id === saved.eventId)) {
      return { eventId: saved.eventId, categoryId: typeof saved.categoryId === "string" ? saved.categoryId : "",
        photoId: typeof saved.photoId === "string" ? saved.photoId : "",
        drafts: saved.drafts && typeof saved.drafts === "object" && !Array.isArray(saved.drafts) ? saved.drafts : {} };
    }
  } catch { /* Un borrador corrupto no impide abrir el editor. */ }
  return { eventId: events[0]?.id || "", categoryId: "", photoId: "", drafts: {} };
};
const request = async (eventId, options) => {
  const response = await fetch(`/__plates?eventId=${encodeURIComponent(eventId)}`, options);
  const data = await response.json();
  if (!response.ok) throw new Error(data.error || "No se pudo guardar.");
  return data;
};

export function usePlateEditor() {
  const [session, setSession] = useState(initialSession);
  const [loaded, setLoaded] = useState(null);
  const [error, setError] = useState("");
  const [storageError, setStorageError] = useState("");
  const [saving, setSaving] = useState(false);
  const [reload, setReload] = useState(0);
  const event = events.find((item) => item.id === session.eventId);
  const allPhotos = getEventPhotos(event);
  const categoryId = event?.categories?.some((item) => item.id === session.categoryId) ? session.categoryId : "";
  const photos = categoryId ? allPhotos.filter((photo) => photo.categoryId === categoryId) : allPhotos;
  const index = Math.max(0, photos.findIndex((photo) => photo.id === session.photoId));
  const photo = photos[index];
  const data = loaded?.eventId === session.eventId ? loaded : null;
  const metadata = data?.metadata || {};
  const draftKey = `${session.eventId}/${photo?.id}`;
  const draft = session.drafts[draftKey];
  const input = typeof draft === "string" ? draft : normalizePlates(metadata[photo?.id]?.plates).join(", ");

  const update = (next) => {
    // Persistir antes del render también protege el borrador ante recargas de Vite.
    try { localStorage.setItem(key, JSON.stringify(next)); setStorageError(""); }
    catch { setStorageError("No se pudo guardar el progreso temporal. No recargues con cambios sin guardar."); }
    setSession(next);
  };

  useEffect(() => {
    let active = true;
    request(session.eventId).then((result) => {
      if (active) { setLoaded({ ...result, eventId: session.eventId }); setError(""); }
    }).catch((error) => { if (active) setError(error.message); });
    return () => { active = false; };
  }, [session.eventId, reload]);

  const navigate = (offset) => {
    const target = photos[index + offset];
    if (target && !saving) update({ ...session, photoId: target.id });
  };
  const save = async (withoutPlate = false) => {
    const plates = withoutPlate ? [] : normalizePlates(input.split(","));
    if (!data || !photo || saving || (!withoutPlate && plates.length === 0)) return;
    setSaving(true);
    setError("");
    try {
      const result = await request(event.id, { method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ eventId: event.id, photoId: photo.id, plates, revision: data.revision }) });
      setLoaded({ ...result, eventId: event.id });
      const drafts = { ...session.drafts };
      delete drafts[draftKey];
      update({ ...session, drafts, photoId: photos[index + 1]?.id || photo.id });
    } catch (error) { setError(error.message); }
    finally { setSaving(false); }
  };

  return { events, event, photo, photos, index, categoryId, input, saving, ready: !!data, error, storageError,
    reviewed: metadata[photo?.id]?.reviewed === true,
    reviewedCount: photos.filter((item) => metadata[item.id]?.reviewed === true).length,
    totalReviewed: allPhotos.filter((item) => metadata[item.id]?.reviewed === true).length,
    total: allPhotos.length,
    changeEvent: (eventId) => { setError(""); update({ ...session, eventId, categoryId: "", photoId: "" }); },
    changeCategory: (categoryId) => update({ ...session, categoryId, photoId: "" }),
    changeInput: (input) => update({ ...session, photoId: photo.id, drafts: { ...session.drafts, [draftKey]: input } }),
    refresh: () => { setLoaded(null); setReload((value) => value + 1); },
    navigate, save };
}
