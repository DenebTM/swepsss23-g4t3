import React, { useState } from 'react'

import AddIcon from '@mui/icons-material/Add'
import Button from '@mui/material/Button'

import { Tooltip } from '@component-lib/Tooltip'
import {
  ADD_GREENHOUSE_DESCRIPTION,
  ADD_GREENHOUSE_TEXT,
  PAGE_URL,
} from '~/common'
import { PageHeader } from '~/components/page/PageHeader'
import { PageWrapper } from '~/components/page/PageWrapper'
import { useLoadSensorStations } from '~/hooks/appContext'

import { AddSensorStationDialog } from '../AddSensorStationDialog/AddSensorStationDialog'
import { AdminBreadcrumbs } from '../AdminBreadcrumbs'
import { SensorStationsTable } from './SensorStationsTable/SensorStationsTable'

/**
 * Sensor station management page for admins
 */
export const ManageGreenhouses: React.FC = () => {
  const loadSensorStations = useLoadSensorStations()
  const [addSsDialogOpen, setAddSsDialogOpen] = useState(false)

  /** Handle closing the dialog to add a sensor station */
  const handleCloseSsDialog = () => {
    setAddSsDialogOpen(false)
    loadSensorStations() // Reload sensor stations
  }

  return (
    <PageWrapper permittedRoles={PAGE_URL.manageGreenhouses.permittedRoles}>
      <PageHeader
        left={<AdminBreadcrumbs currentPageName="Manage Greenhouses" />}
        right={
          <Tooltip arrow title={ADD_GREENHOUSE_DESCRIPTION}>
            <Button
              variant="outlined"
              size="small"
              color="primary"
              startIcon={<AddIcon />}
              onClick={() => setAddSsDialogOpen(true)}
            >
              {ADD_GREENHOUSE_TEXT}
            </Button>
          </Tooltip>
        }
      />
      <SensorStationsTable />
      <AddSensorStationDialog
        open={addSsDialogOpen}
        onClose={handleCloseSsDialog}
      />
    </PageWrapper>
  )
}
