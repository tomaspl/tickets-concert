import { Seat } from './Seat'

export interface SectionStage {
  sectionName: string
  seats: Seat[][] | undefined
}
