import React, { Dispatch, SetStateAction } from 'react'

import Box from '@mui/material/Box'
import ImageList from '@mui/material/ImageList'
import Typography from '@mui/material/Typography'
import useMediaQuery from '@mui/material/useMediaQuery'

import { Photo } from '~/models/photo'
import { SensorStationUuid } from '~/models/sensorStation'
import { theme } from '~/styles/theme'

import { ImageListItem } from './ImageListItem/ImageListItem'

interface GalleryImageListProps {
  photos: Photo[]
  setPhotos: Dispatch<SetStateAction<Photo[] | undefined>>
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
      {props.photos.length > 0 ? (
        <ImageList
          variant="masonry"
          cols={breakSm ? 1 : breakMd ? 2 : 3}
          gap={4}
        >
          {props.photos.map((im) => (
            <ImageListItem
              key={im.url}
              alt={`Photograph of a plant for greenhouse ${props.uuid}`}
              photo={im}
              setPhotos={props.setPhotos}
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
