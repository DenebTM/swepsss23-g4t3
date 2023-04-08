import React from 'react'

import Box from '@mui/material/Box'
import ImageList from '@mui/material/ImageList'
import Typography from '@mui/material/Typography'
import useMediaQuery from '@mui/material/useMediaQuery'

import { Image } from '~/models/image'
import { SensorStationUuid } from '~/models/sensorStation'
import { theme } from '~/styles/theme'

import { ImageListItem } from './ImageListItem/ImageListItem'

interface GalleryImageListProps {
  images: Image[]
  uuid: SensorStationUuid
}

/**
 * Display a list of images in a grid format.
 * See https://mui.com/material-ui/react-image-list/ for more information.
 * The number of columsn is set dynamically according to the current screen width.
 */
export const GalleryImageList: React.FC<GalleryImageListProps> = (props) => {
  const breakSm = useMediaQuery(theme.breakpoints.down('sm'))
  const breakMd = useMediaQuery(theme.breakpoints.down('md'))

  return (
    <Box sx={{ width: '100%', height: '100%' }}>
      {props.images.length > 0 ? (
        <ImageList
          variant="masonry"
          cols={breakSm ? 1 : breakMd ? 2 : 3}
          gap={4}
        >
          {props.images.map((im) => (
            <ImageListItem
              key={im.url}
              image={im}
              alt={`Photograph of a plant for greenhouse ${props.uuid}`}
            />
          ))}
        </ImageList>
      ) : (
        <Typography variant="bodyLarge" color="onSurface" component="p">
          No photos to display.
        </Typography>
      )}
    </Box>
  )
}
