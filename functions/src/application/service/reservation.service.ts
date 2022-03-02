import { EResponse } from "../../core/entities/e-reponse";
import { EReservation } from "../../core/entities/e-reservation";
import { ESearchReservation } from "../../core/entities/e-search-reservations";
import { CancelReservationUseCase } from "../usecase/reservation/cancel-reservation.usecase";
import { CompleteReservationUseCase } from "../usecase/reservation/complete-reservation.usecase";
import { CreateReservationUseCase } from "../usecase/reservation/create-reservation.usecase";
import { GetReservationsByDateUseCase } from "../usecase/reservation/get-reservations-by-date.usecase";
import { PlayingReservationUseCase } from "../usecase/reservation/playing-reservation.usecase";
import { GenerateCalendarReservationUseCase } from "../usecase/schedule/generate-calendar-reservations.usecase";
import { GetAllScheduleBySportSpaceUseCase } from "../usecase/sport-space/get-all-schedule-by-sport-space.usecase";
import * as functions from "firebase-functions";
import { DeleteReservationUseCase } from "../usecase/reservation/delete-reservation.usecase";

export class ReservationService {

    async createReservation(reservation: EReservation): Promise<EResponse<EReservation>> {
        let response: EResponse<EReservation>;
        // Crear la compañia,         
        const companyCreated = await new CreateReservationUseCase().execute(reservation);

        if (companyCreated.data == null) {
            response = {
                code: 400,
                message: companyCreated.message
            }
        } else {
            return companyCreated;
        }
        return response;

    }

    async cancelReservation(reservation: EReservation): Promise<EResponse<EReservation>> {
        let response: EResponse<EReservation>;

        let dateNow = new Date().getTime();
        let now = dateNow - ((5 * 60)*60000);
        let reservationProcess;

        if (now >= reservation.endTime!) {
            reservationProcess = await new CancelReservationUseCase().execute(reservation);
        } else {
            reservationProcess = await new  DeleteReservationUseCase().execute(reservation);
        }

        if (reservationProcess.data == null) {
            response = {
                code: 400,
                message: reservationProcess.message
            }
        } else {
            return reservationProcess;
        }
        return response;

    }

    async getReservationsByDate(search: ESearchReservation): Promise<EResponse<ESearchReservation>> {        
        const schedulesReponse = await new GetAllScheduleBySportSpaceUseCase().execute(search.sportSpace!);

        if (schedulesReponse.code != 200) {
            return {
                code: 400,
                message: schedulesReponse.message
            }
        }

        // Generar los items para reservar
        search.schedules = schedulesReponse.data;
        const reservationsGenerated  =  await new GenerateCalendarReservationUseCase().execute(search);

        if(reservationsGenerated.code != 200){
            return {
                code: 400,
                message: reservationsGenerated.message
            }

        }

        const reservationsRegistered = await new GetReservationsByDateUseCase().execute(search);

        if (reservationsRegistered.code != 200) {
            return {
                code: 400,
                message: reservationsRegistered.message
            }
        }
            
        // Hacer cordinar los horarios utilizados.
        for (let reservationCreated of reservationsRegistered.data?.reservations!) {
            functions.logger.info("GetReservationsByDateUseCase: " + reservationCreated.initTime);
            let reservation = reservationsGenerated.data!.find(item => reservationCreated.initTime == item.initTime && reservationCreated.endTime == item.endTime) as EReservation;    
            if(reservation != null){
                reservation.reservationId = reservationCreated.reservationId;
                reservation.status = reservationCreated.status;
                reservation.client = reservationCreated.client;
                reservation.observation = reservationCreated.observation;
                reservation.updated = reservationCreated.updated;
            }
            
        }
        search.reservations = reservationsGenerated.data!;
        
        return {
            code: 200,
            data: search
        }

    }

    async playingReservation(reservation: EReservation): Promise<EResponse<EReservation>> {
        let response: EResponse<EReservation>;
        const playingReservation = await new PlayingReservationUseCase().execute(reservation);

        if (playingReservation.data == null) {
            response = {
                code: 400,
                message: playingReservation.message
            }
        } else {
            return playingReservation;
        }
        return response;

    }

    async completeReservation(reservation: EReservation): Promise<EResponse<EReservation>> {
        let response: EResponse<EReservation>;
        const completedReservation = await new CompleteReservationUseCase().execute(reservation);

        if (completedReservation.data == null) {
            response = {
                code: 400,
                message: completedReservation.message
            }
        } else {
            return completedReservation;
        }
        return response;

    }

}