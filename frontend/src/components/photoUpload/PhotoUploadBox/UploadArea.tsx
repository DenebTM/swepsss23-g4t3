import { Dispatch, SetStateAction, useState } from 'react'

import FileUploadOutlinedIcon from '@mui/icons-material/FileUploadOutlined'
import LoadingButton from '@mui/lab/LoadingButton'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import Box from '@mui/system/Box'

import { asUploadButton, UploadButtonProps } from '@rpldy/upload-button'
import {
  useBatchAddListener,
  useItemErrorListener,
  useItemFinishListener,
} from '@rpldy/uploady'
import { MessageType } from '~/contexts/SnackbarContext/types'
import { useAddSnackbarMessage } from '~/hooks/snackbar'
import { theme } from '~/styles/theme'

/**
 * Current state of photo upload
 */
export enum UploadStatus {
  READY = 'READY',
  UPLOADING = 'UPLOADING',
  FINISHED = 'FINISHED',
  FAILED = 'FAILED',
}

/** Higher-order component to create a clickable upload area */
export const getUploadArea = (
  setUploadStatus: Dispatch<SetStateAction<UploadStatus>>
): React.FC<UploadButtonProps> =>
  asUploadButton((props: UploadButtonProps) => {
    const [uploading, setUploading] = useState(false)

    const addSnackbarMessage = useAddSnackbarMessage()

    /** Callback on upload finish */
    useItemFinishListener((item) => {
      addSnackbarMessage({
        header: 'Upload complete',
        body: `Your photo has been added to the greenhouse gallery`,
        type: MessageType.CONFIRM,
      })
      setUploading(false)
      setUploadStatus(UploadStatus.FINISHED)
    })

    /** Callback on upload failure */
    useItemErrorListener((item) => {
      addSnackbarMessage({
        header: 'Upload error',
        body: item.uploadResponse.data ?? 'Unable to process photo',
        type: MessageType.ERROR,
      })
      setUploadStatus(UploadStatus.FAILED)
    })

    /** Callback when a new upload is added */
    useBatchAddListener((batch, options) => {
      setUploading(true)
      setUploadStatus(UploadStatus.UPLOADING)
    })

    return (
      <Box
        {...props}
        sx={{
          padding: theme.spacing(6, 4),
          cursor: 'pointer',
          background: theme.surfaceBright,
          border: `2px dashed ${theme.outlineVariant}`,
          borderRadius: 2,
          display: 'flex',
          flexDirection: 'column',
          width: '90%',
          maxWidth: '430px',
          '&:hover': {
            borderColor: theme.outline,
          },
        }}
      >
        <Stack
          spacing={1}
          direction="column"
          sx={{ padding: 2, alignItems: 'center', marginBottom: 2 }}
        >
          <FileUploadOutlinedIcon
            fontSize="large"
            sx={{ color: theme.outline }}
          />
          <Typography color="onSurface" variant="titleMedium" align="center">
            Select photo to upload
          </Typography>
        </Stack>
        <LoadingButton
          variant="contained"
          fullWidth
          size="large"
          loading={uploading}
          loadingPosition="center"
          color="primary"
          sx={{
            '&.MuiLoadingButton-loading': {
              background: theme.primary,
            },
          }}
        >
          Browse Files
        </LoadingButton>
      </Box>
    )
  })
