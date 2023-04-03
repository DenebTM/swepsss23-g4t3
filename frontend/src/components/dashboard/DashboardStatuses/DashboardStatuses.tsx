import React from 'react'

import { SensorStation } from '~/models/sensorStation'

interface DashboardStatusesProps {
  /** The fetched sensor stations to display */
  sensorStations: SensorStation[]
}

/**
 * Component showing the statuses of access points and sensor stations in the dashboard
 */
export const DashboardStatuses: React.FC<DashboardStatusesProps> = (props) => {
  return (
    <div>
      {props.sensorStations.map((s: SensorStation) => (
        <li key={s.uuid}>
          {'Sensor station ' + s.uuid + ' has status "' + s.status + '"'}
        </li>
      ))}
    </div>
  )
}
