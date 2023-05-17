import FileUploadOutlinedIcon from '@mui/icons-material/FileUploadOutlined'
import LoadingButton from '@mui/lab/LoadingButton'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import Box from '@mui/system/Box'

import { theme } from '~/styles/theme'

import { UploadComponentProps } from './getUploadArea'

/** Clcikable upload area with hover effects. Opens file manager to upload photos on click. */
export const ClickableUploadArea: React.FC<UploadComponentProps> = (props) => {
  const { uploading, ...uploadyProps } = props

  return (
    <Box
      {...uploadyProps}
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
}
