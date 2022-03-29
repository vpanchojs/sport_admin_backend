import { UseCase } from "../../../core/base/usecase";
import { EResponse } from "../../../core/entities/e-reponse";
import { EReservation } from "../../../core/entities/e-reservation";
import * as functions from "firebase-functions";
import { CReservationStatus } from "../../../core/entities/enum/c-reservation-status";
import { ReservationRepository } from "../../../infraestructure/reservation.repository";

export class CreateReservationUseCase implements UseCase<EReservation, EResponse<EReservation>>{

    async execute(param: EReservation): Promise<EResponse<EReservation>> {
        let response: EResponse<EReservation>;
        try {  
            param.status = CReservationStatus.confirmated            
            const dateTemp = new Date(param.initTime! - ((5 * 60)* 60000));        
            dateTemp.setHours(0);
            dateTemp.setMinutes(0);
            dateTemp.setSeconds(0);
            dateTemp.setMilliseconds(0);
            param.ownerDate = dateTemp.getTime();
        
            const reservationCreated = await new ReservationRepository().createReservation(param)
            response = {
                data: reservationCreated,
                code: 200,
            }
        } catch (error) {
            functions.logger.error("CreateReservationUseCase: " + error);
            response = {
                code: 400,
                message: "Problemas al crear la reserva"
            }
        }        
        return response;
    }

}