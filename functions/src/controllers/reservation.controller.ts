import * as functions from "firebase-functions";
import { ReservationService } from "../application/service/reservation.service";
import { EResponse } from "../core/entities/e-reponse";
import { EReservation } from "../core/entities/e-reservation";
import { ESearchReservation } from "../core/entities/e-search-reservations";

export const createReservation = functions.region('southamerica-east1').https.onCall(async (data, context) => {
  functions.logger.info("controller - createReservation:" + JSON.stringify(data));
  
  const response: EResponse<EReservation> = await new ReservationService().createReservation(data);

  return response;

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

