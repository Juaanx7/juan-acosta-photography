import { useEffect, useRef } from "react";
import { usePlateEditor } from "./usePlateEditor";
import { normalizePlates } from "../utils/plateMetadata";
import "./PlateEditor.scss";

export default function PlateEditor() {
  const editor = usePlateEditor();
  const inputRef = useRef(null);
  useEffect(() => {
    if (!editor.saving) inputRef.current?.focus();
  }, [editor.saving, editor.photo?.id, editor.ready]);
  return (
    <section className="plate-editor" onKeyDown={(event) => {
      if (event.altKey && ["ArrowLeft", "ArrowRight"].includes(event.key)) {
        event.preventDefault();
        editor.navigate(event.key === "ArrowLeft" ? -1 : 1);
      }
    }}>
      <h1>Editor local de dorsales</h1>
      <p>Las revisiones se guardan en los archivos del proyecto.</p>
      <div className="plate-editor__filters">
        <label>Evento<select value={editor.event?.id || ""} disabled={editor.saving}
          onChange={(event) => editor.changeEvent(event.target.value)}>
          {editor.events.map((event) => <option key={event.id} value={event.id}>{event.title}</option>)}
        </select></label>
        <label>Categoría<select value={editor.categoryId} disabled={editor.saving}
          onChange={(event) => editor.changeCategory(event.target.value)}>
          <option value="">Todas las categorías</option>
          {editor.event?.categories?.map((category) => <option key={category.id} value={category.id}>{category.title}</option>)}
        </select></label>
        <button disabled={editor.saving} onClick={editor.refresh}>Recargar metadata</button>
      </div>
      {editor.error && <p role="alert">{editor.error}</p>}
      {editor.storageError && <p role="alert">{editor.storageError}</p>}
      {!editor.ready ? <p>Cargando metadata…</p> : !editor.photo ? <p>No hay fotografías en este filtro.</p> : <>
        <p>Foto {editor.index + 1} de {editor.photos.length} · Revisadas{editor.categoryId ? " en este filtro" : ""}: {editor.reviewedCount} / {editor.photos.length}</p>
        {editor.categoryId && <p>Total del evento: {editor.totalReviewed} / {editor.total} revisadas</p>}
        <div className="plate-editor__workspace">
          <figure>
            <img src={editor.photo.image} alt={editor.photo.id} />
            <figcaption>{editor.photo.id}{editor.photo.categoryTitle && ` · ${editor.photo.categoryTitle}`}</figcaption>
          </figure>
          <form onSubmit={(event) => { event.preventDefault(); editor.save(); }}>
            <p>{editor.reviewed ? "Revisada" : "Pendiente de revisión"}</p>
            <label>Número/s de corredor
              <input ref={inputRef} type="text" value={editor.input} disabled={editor.saving}
                placeholder="154, 231" onChange={(event) => editor.changeInput(event.target.value)} />
            </label>
            <p>Enter: guardar y avanzar. Alt + ← / →: navegar sin guardar.</p>
            <div className="plate-editor__actions">
              <button type="button" disabled={editor.saving || editor.index === 0} onClick={() => editor.navigate(-1)}>← Anterior</button>
              <button type="button" disabled={editor.saving || editor.index === editor.photos.length - 1} onClick={() => editor.navigate(1)}>Siguiente →</button>
              <button type="button" disabled={editor.saving} onClick={() => editor.save(true)}>Sin dorsal visible</button>
              <button type="submit" disabled={editor.saving || normalizePlates(editor.input.split(",")).length === 0}>
                {editor.saving ? "Guardando…" : "Guardar y siguiente →"}
              </button>
            </div>
          </form>
        </div>
      </>}
    </section>
  );
}
