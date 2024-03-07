interface ModalProps {
  show: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ show, onClose, children }) => {
  if (!show) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-40 flex justify-center items-center">
      <div className="relative bg-white p-6 rounded-lg shadow-lg z-50 max-w-lg w-full">
        <button
          onClick={onClose}
          className="absolute top-0 right-0 mt-4 mr-4 text-gray-400 hover:text-gray-500 focus:outline-none focus:text-gray-500"
          aria-label="Close modal"
        >
          <span className="text-2xl">&times;</span>{" "}
        </button>

        {children}
      </div>
    </div>
  );
};

export default Modal;
