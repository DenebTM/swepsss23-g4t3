import React from 'react'

import FileUploadOutlinedIcon from '@mui/icons-material/FileUploadOutlined'
import Button from '@mui/material/Button'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import Box from '@mui/system/Box'

import { asUploadButton, UploadButtonProps } from '@rpldy/upload-button'
import Uploady from '@rpldy/uploady'
import { SensorStation } from '~/models/sensorStation'
import { theme } from '~/styles/theme'

/** Higher-order component to create a clickable upload area */
const UploadArea = asUploadButton((props: UploadButtonProps) => {
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
      <Button variant="contained">Browse Files</Button>
    </Box>
  )
})

interface PhotoUploadBoxProps {
  sensorStation: SensorStation
}

/**
 * Blickable uplod component to upload photos for a single sensor station
 */
export const PhotoUploadBox: React.FC<PhotoUploadBoxProps> = (props) => {
  return (
    <Box sx={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
      <Uploady multiple={false} accept="image/*" destination={{ url: '' }}>
        <UploadArea />
      </Uploady>
    </Box>
  )
}
