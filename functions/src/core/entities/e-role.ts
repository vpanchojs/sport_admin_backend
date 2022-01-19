import { EPermision } from "./e-permision";
import { CRoleStatus } from "./enum/c-role-status";

export interface ERole{
  roleId?:String;
  code?:String
  description?:String;
  status?:CRoleStatus;
  created?:Date;
  updated?:Date;
  permissions?:EPermision[];
}