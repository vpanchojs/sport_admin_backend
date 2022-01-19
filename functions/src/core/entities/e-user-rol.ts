import 'package:sport_admin/core/entities/company/e_company.dart';
import 'package:sport_admin/core/entities/user/e_user.dart';
import 'package:sport_admin/core/entities/roles/e_role.dart';
import { EUser } from './e-user';
import { ERole } from './e-role';
import { ECompany } from './e-company';

export interface EUserRol{
  userRolId?:String;
  created?:Date;
  removed?:Date;
  user?:EUser;
  role?:ERole;
  company?:ECompany;
}