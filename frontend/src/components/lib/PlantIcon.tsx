import Box, { BoxTypeMap } from '@mui/system/Box'

interface PlantIconProps extends Partial<BoxTypeMap['props']> {
  /** Hex colour of the SVG icon */
  color?: string
  height?: string
  width?: string
}

/**
 * Icon component for the PlantHealth logo
 * TODO add attribution
 */
export const PlantIcon: React.FC<PlantIconProps> = (props) => {
  const { color, ...spanProps } = props

  return (
    <Box
      component="span"
      sx={{
        userSelect: 'none',
        display: 'inline-flex',
        fontSize: '1.5rem',
      }}
      {...spanProps}
    >
      <svg
        id="svg"
        xmlns="http://www.w3.org/2000/svg"
        xmlnsXlink="http://www.w3.org/1999/xlink"
        width={props.width ?? '1em'}
        height={props.height ?? '1em'}
        viewBox="0, 0, 400,400"
      >
        <g id="svgg">
          <path
            id="path0"
            d="M97.752 76.042 C 30.196 144.951,11.943 239.227,56.236 290.466 L 69.779 306.132 58.955 328.202 C 46.417 353.765,49.236 363.791,69.535 365.838 C 81.097 367.005,82.935 365.152,95.464 339.702 C 128.612 272.369,223.539 208.885,228.380 250.812 C 229.522 260.706,227.758 262.558,213.550 266.384 C 182.304 274.798,129.167 321.134,129.167 339.967 C 129.167 356.343,241.168 352.802,276.473 335.309 C 304.409 321.469,346.853 278.469,362.816 247.837 L 372.917 228.455 354.243 212.241 C 291.188 157.491,206.915 150.756,149.904 195.910 L 133.803 208.661 132.527 188.706 C 131.307 169.638,130.660 168.693,117.985 167.465 C 100.564 165.777,97.582 172.165,94.521 217.717 C 91.403 264.132,87.230 272.877,77.742 252.883 C 61.170 217.960,75.010 161.687,110.962 117.812 C 129.471 95.225,130.544 95.384,143.435 122.632 C 157.486 152.334,179.841 159.116,185.774 135.475 C 190.142 118.074,148.664 45.833,134.305 45.833 C 130.489 45.833,114.040 59.427,97.752 76.042 "
            stroke="none"
            fill={color ?? '#000000'}
            fillRule="evenodd"
          ></path>
        </g>
      </svg>
    </Box>
  )
}
