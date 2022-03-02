import { ECompany } from "./e-company";
import { ESportSpace } from "./e-sport-space";
import { CSportSpaceStatus } from "./enum/c-sport-space-status";

export interface ESearchSportSpace{
    company : ECompany;
    sportSpace: ESportSpace;
    status?: CSportSpaceStatus;
}