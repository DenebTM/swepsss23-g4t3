import React, { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'

import CircularProgress from '@mui/material/CircularProgress'

import { decryptSensorStationUuid, PAGE_URL, SS_UUID_PARAM } from '~/common'
import { Error } from '~/components/page/error/Error'
import { PageWrapper } from '~/components/page/PageWrapper'
import { SensorStationUuid } from '~/models/sensorStation'

import { UploadPageContents } from './UploadPageContents'

const INVALID_UUID = null

/**
 * Page for uploading photos for a given sensor station
 */
export const PhotoUpload: React.FC = () => {
  const [search] = useSearchParams()

  const [sensorStationUuid, setSensorStationUuid] = useState<
    SensorStationUuid | typeof INVALID_UUID
  >()

  /** Read sensor station UUID from search params and set in state */
  useEffect(() => {
    const encryptedUuid = search.get(SS_UUID_PARAM)

    setSensorStationUuid(
      encryptedUuid === null
        ? INVALID_UUID
        : decryptSensorStationUuid(encryptedUuid) ?? INVALID_UUID
    )
  }, [search])

  return (
    <PageWrapper permittedRoles={PAGE_URL.photoUpload.permittedRoles}>
      {sensorStationUuid === INVALID_UUID ? (
        <Error message="Unable to parse greenhouse UUID" />
      ) : typeof sensorStationUuid === 'undefined' ? (
        <CircularProgress
          color="primary"
          sx={{ placeSelf: 'center', marginTop: 8 }}
        />
      ) : (
        <UploadPageContents ssID={sensorStationUuid} />
      )}
    </PageWrapper>
  )
}
