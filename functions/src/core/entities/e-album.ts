import { EAlbumState } from "./catalog/e-album-state";
import { EAlbumType } from "./catalog/e-album-type";
import { EMedia } from "./e-media";

export interface EAlbum {
  albumId: string
  created: Date
  updated: Date
  name: string
  state: EAlbumState
  type: EAlbumType
  cover: EMedia
  items: Array<EMedia>
}