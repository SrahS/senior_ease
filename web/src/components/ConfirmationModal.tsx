import { useEffect, useId, useRef } from 'react';

type ConfirmationModalProps = {
  visible: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  confirmVariant?: 'primary' | 'danger';
  isConfirming?: boolean;
  onConfirm: () => void | Promise<void>;
  onCancel: () => void;
};

export function ConfirmationModal({
  visible,
  title,
  message,
  confirmLabel = 'Sim, confirmar',
  confirmVariant = 'primary',
  isConfirming = false,
  onConfirm,
  onCancel,
}: ConfirmationModalProps) {
  const titleId = useId();
  const messageId = useId();
  const confirmButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!visible) {
      return;
    }

    confirmButtonRef.current?.focus();
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && !isConfirming) {
        onCancel();
      }
    };
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [visible, isConfirming, onCancel]);

  if (!visible) {
    return null;
  }

  return (
    <div className="confirmation-overlay">
      <div
        className="confirmation-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={messageId}
      >
        <h2 id={titleId}>{title}</h2>
        <p id={messageId}>{message}</p>
        <div className="confirmation-actions">
          <button
            ref={confirmButtonRef}
            className={confirmVariant === 'danger' ? 'danger-btn' : 'primary-btn'}
            type="button"
            disabled={isConfirming}
            onClick={onConfirm}
          >
            {isConfirming ? 'Excluindo...' : confirmLabel}
          </button>
          <button
            className="secondary-btn"
            type="button"
            disabled={isConfirming}
            onClick={onCancel}
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
}
