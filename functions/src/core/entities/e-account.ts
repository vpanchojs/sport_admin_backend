import { EDevice } from "./e-device";

export interface EAccount {
  accountId?: string
  email?: string
  password?: string
  sessions?: Array<EDevice>
  verified?: boolean
  disabled?: boolean
}
