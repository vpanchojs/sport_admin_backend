import { EFileState } from "./catalog/e-file-state";
import { EFileType } from "./catalog/e-file-type";

export interface EFile {
  fileId?: string
  state?: EFileState
  created?: Date
  updated?: Date
  url?: string
  path?: string
  type?: EFileType
  weight?: number
  aspectRatio?: number
}
