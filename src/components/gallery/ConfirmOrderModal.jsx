import { FiX } from "react-icons/fi";
import "./ConfirmOrderModal.scss";

const ConfirmOrderModal = ({
  closeModal,
  confirmOrder,
  selectedPhotos,
}) => {
  return (
    <div className="confirm-order-modal" onClick={closeModal}>
      <div
        className="confirm-order-modal__content"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          className="confirm-order-modal__close"
          onClick={closeModal}
        >
          <FiX />
        </button>

        <span>Confirmar pedido</span>

        <h2>
          Estás por enviar {selectedPhotos.length}{" "}
          {selectedPhotos.length === 1 ? "foto" : "fotos"}
        </h2>

        <p>
          Se abrirá WhatsApp automáticamente con las fotos seleccionadas
          para enviar tu pedido.
        </p>

        <div className="confirm-order-modal__actions">
          <button onClick={closeModal} className="secondary">
            Cancelar
          </button>

          <button onClick={confirmOrder} className="primary">
            Continuar
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmOrderModal;