import React, { Dispatch, SetStateAction } from 'react'

import { AccessPointId } from '~/models/accessPoint'

interface AccessPointSelectProps {
  accessPoint: AccessPointId | undefined
  setAccessPoint: Dispatch<SetStateAction<AccessPointId | undefined>>
}

/**
 * Select for the chosen access point to pair a new sensor station with
 */
export const AccessPointSelect: React.FC<AccessPointSelectProps> = (
  props
): JSX.Element => {
  return <div>ap select</div>
}
