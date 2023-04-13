import React, { useEffect, useState } from 'react'
import {
  CartesianGrid,
  Label,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'

import dayjs from 'dayjs'
import { Measurement } from '~/models/measurement'
import { SensorStationUuid } from '~/models/sensorStation'
import { theme } from '~/styles/theme'

interface DataValue {
  name: string // Timestamp
  humidity: number
  soilMoisture: number
}

interface GreenhouseGraphProps {
  measurements: Measurement[]
  uuid: SensorStationUuid
}

/**
 * Graph showing recent greenhouse sensor data
 */
export const GreenhouseGraph: React.FC<GreenhouseGraphProps> = (props) => {
  const [data, setData] = useState<DataValue[]>()

  useEffect(() => {
    const dataVals: DataValue[] = props.measurements
      .map((m) => ({
        name: dayjs(m.timestamp).format('YYYY-MM-DD'),
        humidity: m.data.humidity,
        soilMoisture: m.data.soilMoisture,
      }))
      .sort((a, b) => (a.name > b.name ? 1 : -1))

    setData(dataVals)
  }, [props.measurements])

  return (
    <>
      {data && (
        <ResponsiveContainer width="100%" aspect={3}>
          <LineChart
            width={500}
            height={300}
            data={data}
            margin={{
              top: 5,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis domain={[0, 100]}>
              <Label angle={-90} position="center" fill={theme.outline}>
                Percentile
              </Label>
            </YAxis>
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="humidity" stroke="#8884d8" />
            <Line type="monotone" dataKey="soilMoisture" stroke="#82ca9d" />
          </LineChart>
        </ResponsiveContainer>
      )}
    </>
  )
}
