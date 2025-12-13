import { ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { X, ArrowLeft } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  actions?: ReactNode;
  showBackButton?: boolean;
  onBack?: () => void;
  className?: string;
}

const Modal = ({
  isOpen,
  onClose,
  title,
  children,
  actions,
  showBackButton = false,
  onBack,
  className = ""
}: ModalProps) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div
        className={`bg-card rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto border border-border shadow-lg ${className}`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sticky top-0 bg-card p-4 border-b border-border flex items-center justify-between z-10">
          <div className="flex items-center space-x-3">
            {/* Mobile Back Button */}
            <button
              onClick={onClose}
              className="lg:hidden p-2 -ml-2 rounded-lg hover:bg-accent transition-colors"
              aria-label="Go back"
            >
              <ArrowLeft className="w-5 h-5 text-foreground" />
            </button>
            <h3 className="text-lg font-semibold text-foreground">{title}</h3>
          </div>
          {/* Desktop Close Button */}
          <button
            onClick={onClose}
            className="hidden lg:flex p-2 rounded-lg hover:bg-accent transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5 text-muted-foreground hover:text-foreground" />
          </button>
        </div>

        <div className="p-4">
          {children}
        </div>

        {actions && (
          <div className="p-4 border-t border-border">
            {actions}
          </div>
        )}
      </div>
    </div>
  );
};

export default Modal;