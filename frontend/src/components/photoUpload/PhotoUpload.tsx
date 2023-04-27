import React, { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'

import { decryptSensorStationUuid, PAGE_URL, SS_UUID_PARAM } from '~/common'
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
    <PageWrapper
      hideSidebar
      permittedRoles={PAGE_URL.photoUpload.permittedRoles}
    >
      {sensorStationUuid === INVALID_UUID ? (
        'TODO qqjf: invalid uuid error'
      ) : typeof sensorStationUuid === 'undefined' ? (
        'TODO qqjf: loading'
      ) : (
        <UploadPageContents uuid={sensorStationUuid} />
      )}
    </PageWrapper>
  )
}
