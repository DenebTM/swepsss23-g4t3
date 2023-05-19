import { render, screen, waitFor } from '@testing-library/react'
import { test } from 'vitest'
import {
  GREENHOUSE_METRICS,
  GreenhouseMetricRange,
  greenhouseMetricWithUnit,
} from '~/common'
import { Dashboard } from '~/components/dashboard/Dashboard'

test('render Dashboard without crashing', async () => {
  render(<Dashboard />)

  // Expect a column for every metric to be visible once the measurements are fetched from the API
  Object.values(GREENHOUSE_METRICS).forEach(
    (metricRange: GreenhouseMetricRange) =>
      waitFor(
        () =>
          expect(
            screen.getByText(greenhouseMetricWithUnit(metricRange))
          ).toBeInTheDocument(),
        { timeout: 10000 }
      )
  )
})
