import 'e-qualification.ts';
import { EQualification } from './e-qualification';

export interface EReputation {
  score:number 
  qualifications:Array<EQualification>
}
