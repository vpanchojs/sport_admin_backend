import { ERole } from './e-role';
import { EUser } from './e-user';
import { CCompanyStatus } from './enum/c-company-status';

export interface ECompany {
  companyId?:String;
  name?:String;
  description?:String;
  verified?:boolean;
  acceptTermsConditions?:Date;
  status?:CCompanyStatus;
  created?:Date;
  updated?:Date;
  roles?:ERole[];
  admin:EUser
}