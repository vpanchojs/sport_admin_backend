import * as functions from "firebase-functions";
import { ReservationService } from "../application/service/reservation.service";
import { EResponse } from "../core/entities/e-reponse";
import { EReservation } from "../core/entities/e-reservation";
import { ESearchReservation } from "../core/entities/e-search-reservations";
import { CError } from "../core/entities/enum/c-error";
import { Logger } from "../utils/logger";

export const createReservation = functions.region('southamerica-east1').https.onCall(async (data, context) => {  
  new Logger().info("controller - createReservation:", data);
  try {
    const response: boolean = await new ReservationService().createReservation(data);

    return response;    
  } catch (error) {
    new Logger().error("controller - createReservation:", error);
    if (error == CError.NotFound) {
      throw new functions.https.HttpsError('not-found', 'No existe la compañia');
    } else {
      if (error == CError.ReservationExpired) {
        throw new functions.https.HttpsError('invalid-argument', 'Existen reserva/s que expiraron'); 
      } else {
        throw new functions.https.HttpsError('internal', 'Problemas al crear reservación'); 
      }      
    }    
  }
});

export const cancelReservation = functions.region('southamerica-east1').https.onCall(async (data, context) => {
  functions.logger.info("controller - cancelReservation:" + data);

  const response: EResponse<EReservation> = await new ReservationService().cancelReservation(data);
  return response;

});

export const getByDay = functions.region('southamerica-east1').https.onCall(async (data, context) => {
  functions.logger.info("controller - getByDay:" + JSON.stringify(data));

  const response: EResponse<ESearchReservation> = await new ReservationService().getReservationsByDate(data);
  return response;
});

export const playingReservation = functions.region('southamerica-east1').https.onCall(async (data, context) => {
  functions.logger.info("controller - playingReservation:" + JSON.stringify(data));

  const response: EResponse<EReservation> = await new ReservationService().playingReservation(data);
  return response;

});

export const completeReservation = functions.region('southamerica-east1').https.onCall(async (data, context) => {
  functions.logger.info("controller - completeReservation:" + JSON.stringify(data));

  const response: EResponse<EReservation> = await new ReservationService().completeReservation(data);
  return response;

});

