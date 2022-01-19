import { EMediaState } from "./catalog/e-media-state";
import { EMediaType } from "./catalog/e-media-type";
import { EFile } from "./e-file";

export interface EMedia{
  id?: string
  state?: EMediaState
  createdDate?: Date
  updatedDate?: Date
  description?: string
  main?: EFile
  type?: EMediaType
  thumbnail?: EFile
  others?: Array<EFile>
}
