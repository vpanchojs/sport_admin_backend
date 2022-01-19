import 'catalog/e_qualification_state.dart';
import 'e-post.ts';
import { EQualificationState } from './catalog/e-qualification-state';
import { EUser } from './e-user';

export interface EQualification {
  qualificationId:string
  value:number
  created:Date
  state:EQualificationState
  owner:EUser
}
