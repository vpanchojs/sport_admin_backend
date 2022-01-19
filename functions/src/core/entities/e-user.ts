import 'catalog/e_category.dart';
import 'catalog/e_user_state.dart';
import 'e-account.ts';
import 'e-address.ts';
import 'e-reputation.ts';
import 'e-media.ts';
import { EAddress } from './e-address';
import { EAccount } from './e-account';
import { EMedia } from './e-media';
import { EUserRol } from './e-user-rol';
import { CUserStatus } from './enum/c-user-state';
import { CUserGender } from './enum/c-user-gender';

export interface EUser {
  userId?:string
  name?:string;
  lastName?:string;
  verified?:boolean;
  photo?:EMedia;
  aboutMe?:string;
  created?:Date;
  updated?:Date;
  status?:CUserStatus;
  account?:EAccount;
  contactDetails?:EAddress[];
  gender?:CUserGender;
  birthday?:Date;
  roles?:EUserRol[];
}
