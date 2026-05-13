import { useState } from "react";
import { FiX } from "react-icons/fi";
import ConfirmOrderModal from "./ConfirmOrderModal";
import "./SelectionBar.scss";

const WHATSAPP_NUMBER = "5493549461840";

const SelectionBar = ({ selectedPhotos, event, photos, togglePhotoSelection }) => {
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);

  const hasSelectedPhotos = selectedPhotos.length > 0;

  const selectedPhotoItems = photos.filter((photo) =>
    selectedPhotos.includes(photo.id)
  );

  const generateWhatsAppLink = () => {
    const photosList = selectedPhotos.map((id) => `- ${id}`).join("\n");

    const message = `Hola Juan! Quiero encargar fotos del evento ${event.title}.

Fotos seleccionadas:
${photosList}

Cantidad: ${selectedPhotos.length} ${
      selectedPhotos.length === 1 ? "foto" : "fotos"
    }.

Quedo atento/a para coordinar el pago y la entrega.`;

    return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
  };

  const confirmOrder = () => {
    window.open(generateWhatsAppLink(), "_blank");
    setIsConfirmModalOpen(false);
  };

  if (!hasSelectedPhotos) return null;

  return (
    <>
      <div className="selection-bar">
        <div className="selection-bar__content">
          <div className="selection-bar__info">
            <p>
              {selectedPhotos.length}{" "}
              {selectedPhotos.length === 1
                ? "foto seleccionada"
                : "fotos seleccionadas"}
            </p>

            <div className="selection-bar__thumbs">
              {selectedPhotoItems.map((photo) => (
                <div className="selection-bar__thumb" key={photo.id}>
                  <img
                    src={photo.thumbnail || photo.image}
                    alt={photo.id}
                    loading="lazy"
                  />
                  <button
                    type="button"
                    onClick={() => togglePhotoSelection(photo.id)}
                    aria-label={`Quitar ${photo.id}`}
                  >
                    <FiX />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <button
            className="selection-bar__button"
            onClick={() => setIsConfirmModalOpen(true)}
          >
            Encargar por WhatsApp
          </button>
        </div>
      </div>

      {isConfirmModalOpen && (
        <ConfirmOrderModal
          closeModal={() => setIsConfirmModalOpen(false)}
          confirmOrder={confirmOrder}
          selectedPhotos={selectedPhotos}
        />
      )}
    </>
  );
};

export default SelectionBar;