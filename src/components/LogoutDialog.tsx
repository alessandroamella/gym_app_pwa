import { FC } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

interface LogoutDialogProps {
  open: boolean;
  setOpen: (open: boolean) => void;
}
const LogoutDialog: FC<LogoutDialogProps> = ({ open, setOpen }) => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const handleLogout = () => {
    navigate('/logout');
  };

  const handleCancel = () => {
    setOpen(false);
  };

  return (
    <Dialog
      open={open}
      onClose={handleCancel}
      aria-labelledby="logout-dialog-title"
      aria-describedby="logout-dialog-description"
    >
      <DialogTitle id="logout-dialog-title">
        {t('logoutDialog.title')}
      </DialogTitle>
      <DialogContent>
        <DialogContentText id="logout-dialog-description">
          {t('logoutDialog.text')}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleCancel} color="primary">
          {t('buttons.cancel')}
        </Button>
        <Button onClick={handleLogout} color="error" autoFocus>
          {t('buttons.confirm')}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default LogoutDialog;
