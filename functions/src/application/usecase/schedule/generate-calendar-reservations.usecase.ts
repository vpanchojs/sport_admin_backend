import { UseCase } from "../../../core/base/usecase";
import { EResponse } from "../../../core/entities/e-reponse";
import * as functions from "firebase-functions";
import { ESchedule, getOnlyHour, getOnlyMinute } from "../../../core/entities/e-schedule";
import { EReservation } from "../../../core/entities/e-reservation";
import { CReservationStatus } from "../../../core/entities/enum/c-reservation-status";
import { ESearchReservation } from "../../../core/entities/e-search-reservations";
import {CDay, cDayFromCode } from "../../../core/entities/enum/c-day";

export class GenerateCalendarReservationUseCase implements UseCase<ESearchReservation, EResponse<EReservation[]>>{

    async execute(param: ESearchReservation): Promise<EResponse<EReservation[]>> {
        let response: EResponse<EReservation[]>;
        try {
            let reservations: EReservation[] = [];
            let dateNow = new Date().getTime();
            let now = dateNow - ((5 * 60)*60000);
            let paramDate = new Date(param.date! - ((5 * 60)*60000));
            

            

            for (let schedule of param.schedules!) {                
                const day: CDay = cDayFromCode(paramDate.getDay());                
                if (schedule.days?.includes(CDay[day])) {
                    //Se generan los espacios de reserva de acuerdo a cada horario
                    for (let hour = schedule.initHour!; hour < schedule.endHour!; hour += schedule.unitTimeUse!) {
                        const initTime = Date.UTC(paramDate.getFullYear(), paramDate.getMonth(), paramDate.getDate(), getOnlyHour(hour), getOnlyMinute(hour));
                        const endTime = Date.UTC(paramDate.getFullYear(), paramDate.getMonth(), paramDate.getDate(), getOnlyHour(hour + schedule.unitTimeUse!), getOnlyMinute(hour + schedule.unitTimeUse!))

                        let reservation = <EReservation>{
                            status: (endTime < now) ? CReservationStatus.unutilized : CReservationStatus.available,                            
                            schedule: <ESchedule>{
                                scheduleId: schedule.scheduleId,
                                sportSpace: param.sportSpace
                            },
                            price: schedule.prices![0],
                            initTime: initTime,
                            endTime: endTime
                        };
                        reservations.push(reservation);
                    }
                }
            }
            response = {
                data: reservations,
                code: 200,
            }
        } catch (error) {
            functions.logger.error("GenerateCalendarReservationUseCase: " + error);
            response = {
                code: 400,
                message: "Problemas al generar los horarios"
            }
        }
        return response;
    }

}