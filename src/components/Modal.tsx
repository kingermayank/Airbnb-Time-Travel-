import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import './Modal.css';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

export function Modal({ isOpen, onClose, children }: ModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);
  const backdropRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      // Trigger animation by adding class after mount
      requestAnimationFrame(() => {
        if (modalRef.current) {
          modalRef.current.classList.add('modal-enter-active');
        }
        if (backdropRef.current) {
          backdropRef.current.classList.add('backdrop-enter-active');
        }
      });
    } else {
      // Remove active classes when closing
      if (modalRef.current) {
        modalRef.current.classList.remove('modal-enter-active');
      }
      if (backdropRef.current) {
        backdropRef.current.classList.remove('backdrop-enter-active');
      }
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const modalNode = (
    <div
      ref={backdropRef}
      className="modal-backdrop"
      onClick={onClose}
    >
      <div
        ref={modalRef}
        className="modal-content"
        onClick={(e) => e.stopPropagation()}
        style={{
          backgroundColor: 'rgb(255, 255, 255)',
          background: 'rgb(255, 255, 255)'
        }}
      >
        {children}
      </div>
    </div>
  );

  return createPortal(modalNode, document.body);
}

