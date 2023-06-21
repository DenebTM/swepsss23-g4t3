import Card from '@mui/material/Card'
import List from '@mui/material/List'
import { useTheme } from '@mui/material/styles'
import Typography from '@mui/material/Typography'

/** Reusable component for body text inside getting started page */
export const GettingStartedBody = (props: {
  children: React.ReactNode
  gutterBottom?: boolean
}) => (
  <Typography
    component="p"
    variant="bodyMedium"
    color="onSurface"
    gutterBottom={props.gutterBottom}
  >
    {props.children}
  </Typography>
)

/** Reusable component for each subsection of the getting started page */
export const GettingStartedSection = (props: {
  children: React.ReactNode
  subheading: string
}) => {
  const theme = useTheme()
  return (
    <Card sx={{ padding: theme.spacing(3) }}>
      <Typography
        component="h6"
        variant="titleLarge"
        color="onSurfaceVariant"
        gutterBottom
      >
        {props.subheading}
      </Typography>
      {props.children}
    </Card>
  )
}

/** Reusable component for ordered lists inside getting started page */
export const GettingStartedOl = (props: { children: React.ReactNode }) => {
  const theme = useTheme()

  return (
    <List
      component="ol"
      sx={{
        lineHeight: 'initial',
        '> li': {
          listStyle: 'auto inside',
          color: theme.onSurface,
        },
      }}
    >
      {props.children}
    </List>
  )
}

/** Reusable component for list elements inside getting started page */
export const GettingStartedLi = (props: { children: React.ReactNode }) => (
  <li style={{ paddingBottom: 6 }}>
    <Typography
      color="onSurface"
      variant="labelLarge"
      sx={{ listStyle: 'auto inside' }}
    >
      {props.children}
    </Typography>
  </li>
)
