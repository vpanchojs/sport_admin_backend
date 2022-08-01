import { ESportSpace } from './e-sport-space';
import { EUser } from './e-user';
import { EUserRol } from './e-user-rol';
import { CCompanyStatus } from './enum/c-company-status';

export interface ECompany {
  companyId?: string;
  name?: String;
  description?: String;
  verified?: boolean;
  acceptTermsConditions?: Date;
  status?: CCompanyStatus;
  created?: number;
  updated?: number;
  roles?: EUserRol[];
  admin: EUser
  numSportSpaces?:number
  sportSpaces?: ESportSpace[]
}