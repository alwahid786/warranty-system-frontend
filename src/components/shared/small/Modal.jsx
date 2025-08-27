// import { CrossIcon } from "../../../assets/icons/icons";
import { useEffect, useState } from 'react';

const Modal = ({ title, onClose, children, width, className }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    requestAnimationFrame(() => {
      setIsVisible(true);
    });
  }, []);

  const handleClose = () => {
    setIsVisible(false);

    setTimeout(onClose, 300);
  };

  return (
    <div
      className="modal bg-[#00000099] fixed top-0 left-0 inset-0 z-99 p-6 flex items-end md:items-center justify-center transition-opacity duration-300"
      onClick={handleClose}
      style={{ opacity: isVisible ? 1 : 0 }}
    >
      <div
        className={`bg-white rounded-t-[20px] md:rounded-md shadow-lg p-4 md:p-6 overflow-y-scroll h-fit max-h-[90vh] scroll-0 transition-transform duration-300 ease-in-out ${
          width ? width : 'w-[300px] md:w-[600px] lg:w-[900px] xl:w-[1200px]'
        }${className || ''}`}
        onClick={(e) => e.stopPropagation()}
        style={{ transform: isVisible ? 'translateY(0)' : 'translateY(100%)' }}
      >
        <div className="flex items-center justify-center">
          <h2 className="text-[#09090B] text-center font-medium text-xl xl:text-2xl">{title}</h2>
        </div>
        <div className="mt-4 md:mt-6">{children}</div>
      </div>
    </div>
  );
};

export default Modal;
