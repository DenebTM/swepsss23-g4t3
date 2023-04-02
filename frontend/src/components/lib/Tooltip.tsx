import { SxProps } from '@mui/material/styles'
import MuiTooltip, {
  TooltipProps as MuiTooltipProps,
} from '@mui/material/Tooltip'
import Box from '@mui/system/Box'

interface TooltipProps extends MuiTooltipProps {
  spanSx?: SxProps // Styles for the wrapper span
}
/**
 * Custom wrapper for MUI Tooltip component
 * Wraps children in a `<span>` so that the hover event is also triggered
 * on disabled buttons (see here: https://mui.com/material-ui/react-tooltip/).
 * Pass prop title='' to avoid showing the tooltip.
 */
export const Tooltip: React.FC<TooltipProps> = (props) => {
  const { children, spanSx, ...tooltipProps } = { ...props }

  return (
    <MuiTooltip {...tooltipProps}>
      <Box component="span" sx={{ display: 'inline-block', ...spanSx }}>
        {children}
      </Box>
    </MuiTooltip>
  )
}
