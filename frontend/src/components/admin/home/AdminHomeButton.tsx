import Typography from '@mui/material/Typography'
import Grid from '@mui/material/Unstable_Grid2'
import Box from '@mui/system/Box'

import { theme } from '~/styles/theme'

export interface AdminHomeButtonProps {
  icon: React.ReactNode
  onClick: React.MouseEventHandler<HTMLButtonElement>
  description: string
  title: string
}
/**
 * Button component for the admin home. Displays an icon, title, and description.
 */
export const AdminHomeButton: React.FC<AdminHomeButtonProps> = (props) => {
  return (
    <Grid
      container
      spacing={1}
      alignItems="center"
      padding={2}
      component="button"
      height="100%"
      width="100%"
      sx={{
        cursor: 'pointer',
        borderRadius: 4,
        border: 'none',
        background: 'transparent',
        '&:hover': {
          background: theme.inverseOnSurface,
          transition: theme.transitions.create('background'),
        },
      }}
      onClick={props.onClick}
    >
      <Grid xs={12} md={3} textAlign="center" color={theme.primary}>
        {props.icon}
      </Grid>
      <Grid xs={12} md={9} height="100%">
        <Box
          component="div"
          sx={{
            display: 'flex',
            flexDirection: 'column',
            height: '100%',
          }}
        >
          <Typography color={theme.onSurface} variant="body1">
            {props.title}
          </Typography>
          <Typography color={theme.onSurfaceVariant} variant="body2">
            {props.description}
          </Typography>
        </Box>
      </Grid>
    </Grid>
  )
}
