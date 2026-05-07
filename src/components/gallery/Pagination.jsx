import "./Pagination.scss";

const Pagination = ({ currentPage, totalPages, setCurrentPage }) => {
  if (totalPages <= 1) return null;

  const goToPreviousPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const goToNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="pagination">
      <button onClick={goToPreviousPage} disabled={currentPage === 1}>
        Anterior
      </button>

      <span>
        Página {currentPage} de {totalPages}
      </span>

      <button onClick={goToNextPage} disabled={currentPage === totalPages}>
        Siguiente
      </button>
    </div>
  );
};

export default Pagination;