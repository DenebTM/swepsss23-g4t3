import { Timestamp } from './timestamp'

/** The uniquer identifier for a photo */
export type PhotoId = number

/** Type alias for a string path to an photo */
export interface Photo {
  id: PhotoId
  url: string
  uploaded: Timestamp
}
