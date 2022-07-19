import 'package:sport_admin/core/entities/company/e_company.dart';
import 'package:sport_admin/core/entities/user/e_user.dart';
import 'package:sport_admin/core/entities/roles/e_role.dart';
import { EUser } from './e-user';
import { ECompany } from './e-company';
import { CRol } from './enum/c-rol';
import { CRoleStatus } from './enum/c-role-status';

export interface EUserRol{
  userRolId?:String;
  created?:number;
  updated?:Date;
  status?: CRoleStatus;
  user?:EUser;
  role?:CRol;
  company?:ECompany;
}