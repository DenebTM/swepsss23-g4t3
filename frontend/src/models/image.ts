import { Timestamp } from './timestamp'

/** Type alias for a string path to an image */
export interface Image {
  url: string
  uploaded: Timestamp
}
