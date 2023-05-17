import { Dispatch, SetStateAction, useState } from 'react'

import { asUploadButton, UploadButtonProps } from '@rpldy/upload-button'
import {
  useBatchAddListener,
  useItemErrorListener,
  useItemFinishListener,
} from '@rpldy/uploady'
import { MessageType } from '~/contexts/SnackbarContext/types'
import { useAddSnackbarMessage } from '~/hooks/snackbar'

/**
 * Current state of photo upload
 */
export enum UploadStatus {
  READY = 'READY',
  UPLOADING = 'UPLOADING',
  FINISHED = 'FINISHED',
  FAILED = 'FAILED',
}

export interface UploadComponentProps extends UploadButtonProps {
  uploading: boolean
}

/** Higher-order component to create a clickable upload area */
export const getUploadArea = (
  UploadComponent: React.FC<UploadComponentProps>,
  uploadStatus: UploadStatus,
  setUploadStatus: Dispatch<SetStateAction<UploadStatus>>
): React.FC<UploadButtonProps> =>
  asUploadButton((props: UploadButtonProps) => {
    const [uploading, setUploading] = useState(
      uploadStatus === UploadStatus.UPLOADING
    )

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
      setUploading(false)
      setUploadStatus(UploadStatus.FAILED)
    })

    /** Callback when a new upload is added */
    useBatchAddListener((batch, options) => {
      setUploading(true)
      setUploadStatus(UploadStatus.UPLOADING)
    })

    return <UploadComponent {...props} uploading={uploading} />
  })
