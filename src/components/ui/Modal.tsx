import { useEffect, type ReactNode } from "react";
import { createPortal } from "react-dom";
import "./Modal.scss";

interface Props {
  children: ReactNode;
  onClose: () => void;
  contentClassName?: string;
  overlayClassName?: string;
  closeOnOverlayClick?: boolean;
}

const Modal: React.FC<Props> = ({
  children,
  onClose,
  contentClassName = "",
  overlayClassName = "",
  closeOnOverlayClick = true,
}) => {
  useEffect(() => {
    const previousOverflow = document.body.style.overflow;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [onClose]);

  const overlayClasses = ["modal-overlay-solution", overlayClassName]
    .filter(Boolean)
    .join(" ");
  const contentClasses = ["modal-content", contentClassName]
    .filter(Boolean)
    .join(" ");

  const handleOverlayClick = () => {
    if (closeOnOverlayClick) {
      onClose();
    }
  };

  return createPortal(
    <div
      className={overlayClasses}
      onClick={handleOverlayClick}
      role="dialog"
      aria-modal="true"
    >
      <div className={contentClasses} onClick={(e) => e.stopPropagation()}>
        {children}
      </div>
    </div>,
    document.body,
  );
};

export default Modal;
