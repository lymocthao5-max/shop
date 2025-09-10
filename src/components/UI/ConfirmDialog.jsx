import React from 'react';
import Modal from './Modal';
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline';

const ConfirmDialog = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title = 'Xác nhận', 
  message = 'Bạn có chắc chắn muốn thực hiện hành động này?',
  confirmText = 'Xác nhận',
  cancelText = 'Hủy',
  type = 'danger'
}) => {
  const typeClasses = {
    danger: 'bg-red-600 hover:bg-red-700 focus:ring-red-500',
    warning: 'bg-yellow-600 hover:bg-yellow-700 focus:ring-yellow-500',
    info: 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-500'
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} size="sm">
      <div className="flex items-center space-x-3 mb-4">
        <ExclamationTriangleIcon className="h-6 w-6 text-red-600" />
        <p className="text-gray-700">{message}</p>
      </div>
      
      <div className="flex justify-end space-x-3">
        <button
          type="button"
          className="btn-secondary"
          onClick={onClose}
        >
          {cancelText}
        </button>
        <button
          type="button"
          className={`btn text-white focus:outline-none focus:ring-2 focus:ring-offset-2 ${typeClasses[type]}`}
          onClick={() => {
            onConfirm();
            onClose();
          }}
        >
          {confirmText}
        </button>
      </div>
    </Modal>
  );
};

export default ConfirmDialog;