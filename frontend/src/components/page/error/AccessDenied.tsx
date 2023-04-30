import { Error } from './Error'

/**
 * Simple "access denied" page to display if a non-admin user tried to view a
 * restricted page.
 */
export const AccessDenied: React.FC = () => {
  return <Error message="Insufficient permissions to view this page." />
}
