import React from 'react'

import FileUploadOutlinedIcon from '@mui/icons-material/FileUploadOutlined'
import LoadingButton from '@mui/lab/LoadingButton'
import Box from '@mui/system/Box'

import { UploadComponentProps } from './getUploadArea'

/**
 * Button to upload further files once at least one photo has been uploaded
 */
export const UploadMorePhotosButton: React.FC<UploadComponentProps> = (
  props
) => {
  const { uploading, ...uploadyProps } = props

  return (
    <Box {...uploadyProps}>
      <LoadingButton
        variant="outlined"
        fullWidth
        size="large"
        loading={uploading}
        loadingPosition="center"
        color="primary"
        endIcon={<FileUploadOutlinedIcon />}
        sx={{
          '&.MuiLoadingButton-loading': {},
        }}
      >
        Upload Another Photo
      </LoadingButton>
    </Box>
  )
}
