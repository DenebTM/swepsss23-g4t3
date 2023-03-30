import '@testing-library/jest-dom'
import { Server } from 'miragejs'
import { vi } from 'vitest'
import { mirageSetup, MOCK_API } from '~/api/mirageSetup'
import { AppRegistry } from '~/api/mirageTypes'

let server: Server<AppRegistry> | undefined

/** Start mirage server to mock the backend before each test */
beforeEach(() => {
  server = mirageSetup(MOCK_API)
})

/** Teardown after each test */
afterEach(() => {
  vi.clearAllMocks()

  if (server) {
    server.shutdown()
  }
})
