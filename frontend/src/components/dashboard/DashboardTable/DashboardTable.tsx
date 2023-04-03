import React from 'react'

import { SensorStation } from '~/models/sensorStation'

interface DashboardTableProps {
  /** The fetched sensor stations */
  sensorStations: SensorStation[]
}

/**
 * Table showing the most recent sensor station data in the dashboard
 */
export const DashboardTable: React.FC<DashboardTableProps> = (props) => {
  return (
    <div>
      Dashboard graph
      {props.sensorStations.map((s: SensorStation) => (
        <li key={s.uuid}>
          {'Sensor station ' +
            s.uuid +
            ' has last measurement: "' +
            JSON.stringify(s.measurements[s.measurements.length - 1])}
        </li>
      ))}
    </div>
  )
}
