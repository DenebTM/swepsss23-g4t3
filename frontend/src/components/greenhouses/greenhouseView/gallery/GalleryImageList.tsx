import React, { Dispatch, SetStateAction, useEffect, useState } from 'react'

import Box from '@mui/material/Box'
import ImageList from '@mui/material/ImageList'
import { useTheme } from '@mui/material/styles'
import Typography from '@mui/material/Typography'
import useMediaQuery from '@mui/material/useMediaQuery'

import { useSensorStations } from '~/hooks/appContext'
import { Photo } from '~/models/photo'
import { SensorStation, SensorStationUuid } from '~/models/sensorStation'

import { ImageListItem } from './ImageListItem/ImageListItem'

interface GalleryImageListProps {
  photos: Photo[]
  setPhotos: Dispatch<SetStateAction<Photo[] | undefined>>
  ssID: SensorStationUuid
}

/**
 * Display a list of images in a grid format.
 * See https://mui.com/material-ui/react-image-list/ for more information.
 * The number of columns is set dynamically according to the current screen width.
 */
export const GalleryImageList: React.FC<GalleryImageListProps> = (props) => {
  const theme = useTheme()

  const sensorStations = useSensorStations()

  const [sensorStation, setSensorStation] = useState<SensorStation>()

  useEffect(() => {
    const foundSensorStation = sensorStations
      ? sensorStations.find((s) => s.ssID === props.ssID)
      : undefined
    setSensorStation(foundSensorStation)
  }, [sensorStations])

  const breakSm = useMediaQuery(theme.breakpoints.down('sm'))
  const breakMd = useMediaQuery(theme.breakpoints.down('md'))

  /** Determine the number of columns in the image grid based on screen width */
  const numImageColumns = (): number => {
    if (breakSm) {
      return 1
    } else if (breakMd) {
      return 2
    } else {
      return 3
    }
  }

  return (
    <Box sx={{ width: '100%', height: '100%' }}>
      {props.photos.length > 0 ? (
        <ImageList variant="masonry" cols={numImageColumns()} gap={4}>
          {props.photos.map((im, idx) => (
            <ImageListItem
              key={`${im.uploaded}-${idx}`}
              alt={`Photograph of a plant for greenhouse ${props.ssID}`}
              photo={im}
              setPhotos={props.setPhotos}
              sensorStation={sensorStation}
            />
          ))}
        </ImageList>
      ) : (
        <Typography
          variant="bodyLarge"
          color="onSurface"
          component="p"
          marginTop={2}
        >
          No photos to display.
        </Typography>
      )}
    </Box>
  )
}
