import { UseCase } from "../../../core/base/usecase";
import { EResponse } from "../../../core/entities/e-reponse";
import * as functions from "firebase-functions";
import { ESearchReservation } from "../../../core/entities/e-search-reservations";
import { ReservationRepository } from "../../../infraestructure/reservation.repository";

export class GetReservationsByDateUseCase implements UseCase<ESearchReservation, EResponse<ESearchReservation>>{

    async execute(param: ESearchReservation): Promise<EResponse<ESearchReservation>> {
        let response: EResponse<ESearchReservation>;
        try {
            const dateTemp = new Date(param.date! - ((5 * 60)* 60000));        
            dateTemp.setHours(0);
            dateTemp.setMinutes(0);
            dateTemp.setSeconds(0);
            dateTemp.setMilliseconds(0);
            param.date = dateTemp.getTime();
            
            const eSearchReservation = await new ReservationRepository().getReservationsByDate(param)
            response = {
                data: eSearchReservation,
                code: 200,
            }            
        } catch (error) {
            functions.logger.error("GetReservationsByDateUseCase: " + error);
            response = {
                code: 400,
                message: "Problemas al obtener las reservaciones"
            }
        }        
        return response;
    }

}