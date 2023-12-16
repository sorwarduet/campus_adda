const Modal = ({ isOpen, onClose, children }) => {
  const modalClass = isOpen
    ? "modal-overlay opacity-100 pointer-events-auto"
    : "modal-overlay opacity-0 pointer-events-none";
  const modalContentClass = isOpen
    ? "modal-content opacity-100 translate-y-0"
    : "modal-content opacity-0 translate-y-4";

  return (
    <div className={modalClass}>
      <div className="fixed inset-0 flex items-center justify-center">
        <div
          className={`modal-container bg-white p-6 rounded shadow-lg ${modalContentClass}`}
        >
          <button onClick={onClose} className="absolute top-0 right-0 p-4">
            <svg
              className="h-6 w-6 text-gray-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              ></path>
            </svg>
          </button>
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;
