import { ECompany } from "./e-company";
import { CSportSpaceStatus } from "./enum/c-sport-space-status";

export interface ESearchSportSpace{
    company : ECompany;
    status?: CSportSpaceStatus;
}