import { FC, FormEvent, useCallback, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  Button,
  TextField,
  Typography,
  CircularProgress,
  Snackbar,
  Alert,
  useTheme,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Card,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useDropzone } from 'react-dropzone';
import axios, { isAxiosError } from 'axios';
import { useAuthStore } from '../store/authStore';
import { useTranslation } from 'react-i18next';
import _ from 'lodash';
import { PostData } from '../types/post';

const ConfirmDialog: FC<{
  isConfirmDialogOpen: boolean;
  setIsConfirmDialogOpen: (open: boolean) => void;
  pendingSubmission: PostData | null;
  submitPost: (data: PostData) => void;
}> = ({
  isConfirmDialogOpen,
  pendingSubmission,
  setIsConfirmDialogOpen,
  submitPost,
}) => {
  const { t } = useTranslation();

  return (
    <Dialog
      open={isConfirmDialogOpen}
      onClose={() => setIsConfirmDialogOpen(false)}
      aria-labelledby="before-post-dialog-title"
      aria-describedby="before-post-dialog-description"
    >
      <DialogTitle id="before-post-dialog-title">
        {t('post.beforePostingDialog.title')}
      </DialogTitle>
      <DialogContent>
        <DialogContentText id="before-post-dialog-description">
          {t('post.beforePostingDialog.text')}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setIsConfirmDialogOpen(false)} color="primary">
          {t('buttons.cancel')}
        </Button>
        <Button
          onClick={() => {
            if (pendingSubmission) {
              submitPost(pendingSubmission);
              setIsConfirmDialogOpen(false);
            }
          }}
          color="primary"
          autoFocus
          variant="contained"
        >
          {t('buttons.confirm')}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

const AddPostScreen = () => {
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
  const [pendingSubmission, setPendingSubmission] = useState<PostData | null>(
    null,
  );
  const [text, setText] = useState('');
  const [files, setFiles] = useState<File[] | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [alert, setAlert] = useState<string | null>(null);
  const navigate = useNavigate();
  const { token } = useAuthStore();
  const { t } = useTranslation();
  const theme = useTheme();

  const handleDrop = (acceptedFiles: File[]) => {
    if (acceptedFiles?.length > 0) {
      setFiles(acceptedFiles);
    } else {
      setAlert(t('addContent.max5Files'));
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: handleDrop,
    accept: { 'image/*': [], 'video/*': [] },
    maxFiles: 5,
  });

  const handleSubmit = async (event?: FormEvent<HTMLFormElement>) => {
    event?.preventDefault();

    if (!files) {
      setAlert(t('addContent.addAtLeastOne'));
      return;
    }

    setPendingSubmission({ text });
    setIsConfirmDialogOpen(true);
  };

  const submitPost = async ({ text }: PostData) => {
    setIsUploading(true);

    try {
      const { data } = await axios.post(
        '/v1/post',
        { text },
        { headers: { Authorization: `Bearer ${token}` } },
      );

      if (files) {
        try {
          for (const file of files) {
            const mediaFormData = new FormData();
            mediaFormData.append('file', file);
            await axios.post(`/v1/media/post/${data.id}`, mediaFormData, {
              headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'multipart/form-data',
              },
            });
          }
        } catch (error) {
          console.error('Error uploading media:', error);
          await axios.delete(`/v1/post/${data.id}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          setAlert(
            t('addContent.errorUploadingMedia', {
              error: isAxiosError(error)
                ? error?.response?.data?.message
                : error,
            }),
          );
          setIsUploading(false);
          return;
        }
      }
      navigate('/motivation', { replace: true });
    } catch (error) {
      console.error('Error adding post:', error);
      setAlert(
        t('post.errorAdding', {
          error: isAxiosError(error) ? error?.response?.data?.message : error,
        }),
      );
    } finally {
      setIsUploading(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.3 },
    },
  };

  const [placeholder, setPlaceholder] = useState<string>('--');

  const changePlaceholder = useCallback(
    (_e: unknown, noDelay = false, oldOne = '') => {
      setTimeout(
        () => {
          const placeholders = t('post.placeholders', {
            returnObjects: true,
          }) as string[];
          const placeholder = _.sample(_.omit(placeholders, oldOne))!;
          setPlaceholder(placeholder);
        },
        noDelay ? 0 : 300,
      );
    },
    [t],
  );

  useEffect(() => {
    changePlaceholder(undefined, true);
  }, [changePlaceholder]);

  return (
    <>
      <ConfirmDialog
        isConfirmDialogOpen={isConfirmDialogOpen}
        setIsConfirmDialogOpen={setIsConfirmDialogOpen}
        pendingSubmission={pendingSubmission}
        submitPost={submitPost}
      />
      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        style={{
          background: theme.palette.background.default,
          padding: '24px',
        }}
      >
        <Card
          component={motion.form}
          variants={containerVariants}
          noValidate
          onSubmit={handleSubmit}
          sx={{
            margin: '0 auto',
            borderRadius: 2,
            boxShadow: 3,
            padding: 4,
          }}
        >
          <motion.div variants={itemVariants}>
            <Typography
              variant="h4"
              align="center"
              sx={{
                fontWeight: 'bold',
                marginBottom: 2,
                background: `linear-gradient(to right, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              {t('post.addPost')}
            </Typography>
          </motion.div>

          <motion.div variants={itemVariants}>
            <TextField
              margin="normal"
              fullWidth
              name="text"
              label={t('post.text')}
              id="text"
              multiline
              placeholder={placeholder}
              onBlur={changePlaceholder}
              rows={4}
              onChange={(e) => setText(e.target.value)}
              sx={{ marginBottom: 2 }}
              onKeyDown={(e) => {
                // on ctrl+enter submit
                if (e.key === 'Enter' && e.ctrlKey) {
                  handleSubmit();
                }
              }}
            />
          </motion.div>

          <motion.div variants={itemVariants}>
            <div
              {...getRootProps()}
              style={{
                padding: '16px',
                border: `2px dashed ${
                  isDragActive
                    ? theme.palette.primary.main
                    : theme.palette.divider
                }`,
                borderRadius: '8px',
                textAlign: 'center',
                cursor: 'pointer',
                transition: 'border-color 0.2s ease-in-out',
                backgroundColor: isDragActive
                  ? theme.palette.action.hover
                  : theme.palette.background.default,
              }}
            >
              <input {...getInputProps()} />
              {files ? (
                <Typography variant="body2" color="textSecondary">
                  {files.map((file) => file.name).join(', ')}
                </Typography>
              ) : (
                <motion.div
                  animate={isDragActive ? { scale: 1.1 } : { scale: 1 }}
                  transition={{ duration: 0.2 }}
                >
                  <Typography variant="body2" color="textSecondary">
                    {t('addContent.dragAndDrop')}
                  </Typography>
                </motion.div>
              )}
            </div>
          </motion.div>

          <motion.div variants={itemVariants}>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="error"
              disabled={isUploading}
              sx={{
                marginTop: 2,
                paddingY: 1.5,
                borderRadius: 2,
              }}
            >
              {isUploading ? (
                <CircularProgress size={24} sx={{ color: 'white' }} />
              ) : (
                t('post.addPost')
              )}
            </Button>
          </motion.div>
        </Card>

        <Snackbar
          open={!!alert}
          autoHideDuration={3000}
          onClose={() => setAlert(null)}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        >
          <Alert
            onClose={() => setAlert(null)}
            severity="warning"
            variant="filled"
          >
            {alert}
          </Alert>
        </Snackbar>
      </motion.div>
    </>
  );
};

export default AddPostScreen;
