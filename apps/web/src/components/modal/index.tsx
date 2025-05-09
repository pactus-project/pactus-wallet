'use client';
import React, { useEffect, useRef, useState, useId } from 'react';
import './style.css';
import { Typography } from '../common/Typography';

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  showCloseButton?: boolean;
  className?: string;
  isLoading?: boolean;
}

const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  showCloseButton = true,
  className = '',
  isLoading = false,
}) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const titleId = useId();

  // Handle modal visibility
  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
      document.body.style.overflow = 'hidden';

      // Focus trap setup - focus first focusable element
      setTimeout(() => {
        const focusableElements = modalRef.current?.querySelectorAll(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        if (focusableElements && focusableElements.length > 0) {
          (focusableElements[0] as HTMLElement).focus();
        }
      }, 50);
    } else {
      setTimeout(() => {
        setIsVisible(false);
      }, 300);
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Handle clicks outside of the modal
  const handleOutsideClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
      onClose();
    }
  };

  // Handle escape key press
  useEffect(() => {
    const handleEscapeKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscapeKey);
    return () => {
      document.removeEventListener('keydown', handleEscapeKey);
    };
  }, [isOpen, onClose]);

  if (!isVisible) return null;

  return (
    <div
      className={`modal-overlay ${isOpen ? 'show' : 'hide'}`}
      onClick={handleOutsideClick}
      role="presentation"
    >
      <div
        className={`max-w-[600px] w-[90%] box-shadow-lg transform-translate-y-[-20px] transition-transform-normal overflow-hidden border-1 border-surface-medium bg-surface-medium rounded-md ${isOpen ? 'show' : 'hide'} ${className}`}
        ref={modalRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
      >
        {!isLoading && (
          <header className="flex items-center justify-between p-4 border-b border-[#52526F40]">
            <Typography variant="body2" color="text-quaternary" className="p-1 pl-4 font-medium">
              {title}
            </Typography>
            {showCloseButton && (
              <button
                className="modal-close-button mr-3"
                onClick={onClose}
                aria-label="Close modal"
                type="button"
              >
                <span aria-hidden="true">✕</span>
              </button>
            )}
          </header>
        )}
        <div className="modal-content">{children}</div>
      </div>
    </div>
  );
};

export default Modal;
