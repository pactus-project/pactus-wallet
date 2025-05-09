'use client';
import React, { useEffect, useRef, useState, useId } from 'react';
import ReactDOM from 'react-dom';
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

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
      document.body.style.overflow = 'hidden';
      setTimeout(() => {
        const focusableElements = modalRef.current?.querySelectorAll(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        if (focusableElements?.length) {
          (focusableElements[0] as HTMLElement).focus();
        }
      }, 50);
    } else {
      setTimeout(() => setIsVisible(false), 300);
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

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

  const handleOutsideClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
      onClose();
    }
  };

  if (!isVisible) return null;

  let portalRoot = document.getElementById('modal-root');
  if (!portalRoot) {
    portalRoot = document.createElement('div');
    portalRoot.setAttribute('id', 'modal-root');
    document.body.appendChild(portalRoot);
  }

  return ReactDOM.createPortal(
    <div
      className={`modal-overlay fixed inset-0 z-50 ${isOpen ? 'show' : 'hide'}`}
      onClick={handleOutsideClick}
    >
      <div
        ref={modalRef}
        className={`max-w-[600px] w-[90%] mx-auto mt-[10vh]
           box-shadow-lg transform-translate-y-[-20px] 
           transition-transform-normal overflow-hidden border 
           border-surface-medium bg-surface-medium rounded-md ${className} ${isLoading ? '!border-none' : ''}`}
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
    </div>,
    portalRoot
  );
};

export default Modal;
