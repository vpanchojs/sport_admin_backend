import { EReservation } from "../core/entities/e-reservation";
import admin = require('firebase-admin');
const { getFirestore } = require('firebase-admin/firestore');
import * as functions from "firebase-functions";
import { CollectionsDB } from "./db/collections";

export class ReservationRepository {
    async createReservation(reservation: EReservation): Promise<EReservation> {
        try {
            let data = {
                'status': reservation.status,
                "scheduleId": reservation.schedule?.scheduleId,
                "initTime": reservation.initTime,
                "endTime": reservation.endTime,
                'observation': reservation.observation,
                'created': admin.firestore.FieldValue.serverTimestamp(),
                "priceId": reservation.price.priceId,
                "sportSpaceId": reservation.schedule?.sportSpace?.sportSpaceId
            };
            let doc = getFirestore().collection(CollectionsDB.company).doc(reservation.schedule?.sportSpace!.company?.companyId)
                                    .collection(CollectionsDB.sportspace).doc(reservation.schedule?.sportSpace?.sportSpaceId)
                                    .collection(CollectionsDB.reservation).doc();
            await doc.create(data)
            reservation.reservationId = doc.id;
            return reservation;
        } catch (e) {
            functions.logger.log("Error al ReservationRepository - createReservation :" + e);
            return Promise.reject(e);
        }
    }

    async cancelReservation(reservation: EReservation): Promise<EReservation> {
        try {
            let data = {
                'status': reservation.status,
                'updated': admin.firestore.FieldValue.serverTimestamp()
            };
            let doc = getFirestore().collection(CollectionsDB.company).doc(reservation.schedule?.sportSpace!.company?.companyId)
                                    .collection(CollectionsDB.sportspace).doc(reservation.schedule?.sportSpace?.sportSpaceId)
                                    .collection(CollectionsDB.reservation).doc(reservation.reservationId);
            await doc.update(data)
            reservation.reservationId = doc.id;
            return reservation;
        } catch (e) {
            functions.logger.log("Error al ReservationRepository - cancelReservation :" + e);
            return Promise.reject(e);
        }
    }
}