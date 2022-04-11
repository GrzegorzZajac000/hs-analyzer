import { toast } from 'react-toastify';

const sendErrorToast = message => {
  toast.error(
    message,
    {
      theme: 'dark',
      closeOnClick: true,
      onClose: () => window.location.reload(true)
    });
};

export default sendErrorToast;
