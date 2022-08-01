import { EAddress } from "./e-address";
import { EAlbum } from "./e-album";
import { ECompany } from "./e-company";
import { ESchedule } from "./e-schedule";
import { CSportSpaceMaterial } from "./enum/c-sport-space-material";
import { CSportSpaceStatus } from "./enum/c-sport-space-status";
import { CSportSpaceType } from "./enum/c-sport-space-type";

export interface ESportSpace {
    sportSpaceId?:string;
    name?:String;
    description?:String;
    maxTeams?:number;
    maxPlayersTeam?:number;
    album?: EAlbum;
    material?:CSportSpaceMaterial;
    status?:CSportSpaceStatus;
    created?:number;
    updated?:number;
    company?:ECompany;
    sportType?:CSportSpaceType;
    address?:EAddress; 
    schedules?:ESchedule[];
    
  }