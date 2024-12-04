import { useState, useEffect, FC } from 'react';
import {
  Button,
  TextField,
  Alert,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from '@mui/material';
import { useTranslation } from 'react-i18next';

interface ChangePasswordDialogProps {
  open: boolean;
  onClose: () => void;
  onSave: (oldPassword: string, newPassword: string) => void;
}
const ChangePasswordDialog: FC<ChangePasswordDialogProps> = ({
  open,
  onClose,
  onSave,
}) => {
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const { t } = useTranslation();

  const handleSave = () => {
    if (newPassword !== confirmPassword) {
      setError(t('editProfile.passwordsDoNotMatch'));
      return;
    }
    onSave(oldPassword, newPassword);
  };

  useEffect(() => {
    setError('');
  }, [open]);

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>{t('editProfile.changePassword')}</DialogTitle>
      <DialogContent>
        <TextField
          label={t('editProfile.oldPassword')}
          type="password"
          fullWidth
          margin="normal"
          value={oldPassword}
          onChange={(e) => setOldPassword(e.target.value)}
          autoComplete="current-password" // Correct autocomplete
        />
        <TextField
          label={t('editProfile.newPassword')}
          type="password"
          fullWidth
          margin="normal"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          autoComplete="new-password" // Correct autocomplete
        />
        <TextField
          label={t('editProfile.confirmPassword')}
          type="password"
          fullWidth
          margin="normal"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          autoComplete="new-password" // Correct autocomplete
        />
        {error && <Alert severity="error">{error}</Alert>}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>{t('buttons.cancel')}</Button>
        <Button onClick={handleSave}>{t('buttons.save')}</Button>
      </DialogActions>
    </Dialog>
  );
};

export default ChangePasswordDialog;
