import { UseCase } from "../../../core/base/usecase";
import { EReservation } from "../../../core/entities/e-reservation";
import * as functions from "firebase-functions";
import { CReservationStatus } from "../../../core/entities/enum/c-reservation-status";
import { ReservationRepository } from "../../../infraestructure/reservation.repository";
import { CError } from "../../../core/entities/enum/c-error";
import { Logger } from "../../../utils/logger";

export class CreateReservationUseCase implements UseCase<Array<EReservation>, boolean>{

    async execute(param: Array<EReservation>): Promise<boolean> {
        try {
            if(param.length == 0){
                Promise.reject(CError.BadRequest); 
            }
            let dateNow = new Date().getTime();
            let now = dateNow - ((5 * 60)*60000);
            let spiralReserves=0;
            for (let reservation of param){
                if (now >= reservation.endTime!) {
                    spiralReserves++;
                }else{
                    if (spiralReserves==0) {
                        reservation.status = CReservationStatus.reservated            
                        const dateTemp = new Date(reservation.initTime!);
                        //functions.logger.info("CreateReservationUseCase: ownerDate " + dateTemp.toString()); 
                        dateTemp.setHours(0);
                        dateTemp.setMinutes(0);
                        dateTemp.setSeconds(0);
                        dateTemp.setMilliseconds(0);
                        reservation.ownerDate = dateTemp.getTime();                        
                        reservation.client = param[0].client;
                    }                
                }
            }
            functions.logger.info("CreateReservationUseCase: ownerDate " + param.toString()); 
            // En caso de que no exista reservas expiradas
            if (spiralReserves == 0) {                
                await new ReservationRepository().createReservation(param)
                return true;             
            }
            return Promise.reject(CError.ReservationExpired);                 
        } catch (error) {            
            const e = new Logger().error("CreateReservationUseCase", error);
            return Promise.reject(e);
        }        
    }

}