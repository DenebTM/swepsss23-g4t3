import {
  render,
  /*, screen*/
} from '@testing-library/react'
import { test } from 'vitest'

/*import {
  GREENHOUSE_METRICS,
  GreenhouseMetricRange,
  greenhouseMetricWithUnit,
} from '~/common'*/
import { Dashboard } from '~/components/dashboard/Dashboard'

test('render Dashboard without crashing', async () => {
  render(<Dashboard />)

  // Expect a column for every metric to be visible
  /*GREENHOUSE_METRICS.forEach((metricRange: GreenhouseMetricRange) =>
    expect(
      screen.getByText(greenhouseMetricWithUnit(metricRange))
    ).toBeInTheDocument()
  )*/
})
