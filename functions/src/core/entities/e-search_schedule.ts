import { ESportSpace } from "./e-sport-space";
import { ESchedule } from "./e-schedule";
import { CScheduleStatus } from "./enum/c-schedule-status";

export interface ESearchSchedule{
    status: CScheduleStatus
    sportSpace?: ESportSpace;
    schedules? : ESchedule[];
}