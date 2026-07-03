import React from 'react';
import Modal from '@/components/modal';
import { motion } from 'framer-motion';
interface LoadingDialogProps {
  message?: string;
}

const LoadingDialog: React.FC<LoadingDialogProps> = () => {
  return (
    <Modal
      isOpen={true}
      onClose={() => {
        /* intentionally empty */
      }}
      title=""
      showCloseButton={false}
      className="!bg-transparent"
      isLoading={true}
    >
      <div className="bg-transparent flex justify-center items-center">
        <motion.div
          className="h-16 w-16 border-4 border-primary border-t-transparent rounded-full"
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
        />
      </div>
    </Modal>
  );
};

export default LoadingDialog;
