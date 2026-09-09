import { useState } from "react";
import { photoHasPlateNumber } from "../../utils/plateSearch";
//import "./PlateSearch.scss";

const PlateSearch = ({ event, photos, onSearch }) => {
  const [plateNumber, setPlateNumber] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    const normalizedPlate = plateNumber.trim();

    if (!normalizedPlate) {
      onSearch([], "");
      return;
    }

    const results = photos.filter((photo) =>
      photoHasPlateNumber(event.id, photo.id, normalizedPlate)
    );

    onSearch(results, normalizedPlate);
  };

  return (
    <section className="plate-search">
      <div className="plate-search__header">
        <span>Encontrá tus fotos</span>
        <h2>Buscá por número de corredor</h2>

        <p>
          Ingresá el número de tu placa para encontrar tus fotos dentro del
          evento.
        </p>
      </div>

      <form className="plate-search__form" onSubmit={handleSubmit}>
        <input
          type="text"
          inputMode="numeric"
          placeholder="Ej: 154"
          value={plateNumber}
          onChange={(e) => setPlateNumber(e.target.value)}
        />

        <button type="submit">
          Buscar
        </button>
      </form>
    </section>
  );
};

export default PlateSearch;