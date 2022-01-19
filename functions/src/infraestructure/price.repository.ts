import admin = require('firebase-admin');
const { getFirestore } = require('firebase-admin/firestore');
import * as functions from "firebase-functions";
import { EPrice } from "../core/entities/e-price";
import { ESchedule } from '../core/entities/e-schedule';
import { CollectionsDB } from "./db/collections";


export class PriceRepository {
    async createPrice(eprice: EPrice): Promise<EPrice> {
        try {
            let data = {
                "value": eprice.value,
                "currency": eprice.currency,
                "created": admin.firestore.FieldValue.serverTimestamp(),
                "status": eprice.status,
                "scheduleId": eprice.schedule?.scheduleId,
            };
            console.log('by created price', data);
            let doc = getFirestore()
                .collection(CollectionsDB.company).doc(eprice.schedule!.sportSpace!.company?.companyId)
                .collection(CollectionsDB.sportspace).doc(eprice.schedule?.sportSpace?.sportSpaceId)
                .collection(CollectionsDB.schedule).doc(eprice.schedule?.scheduleId)
                .collection(CollectionsDB.price).doc();
           
                await doc.create(data)
            eprice.priceId = doc.id;
            console.log('Se creo el precio');
            return eprice;
        } catch (e) {
            functions.logger.log("Error al PriceRepository - createPrice :" + e);
            return Promise.reject(e);
        }
    }

    async getAllPriceBySchedule(schedule: ESchedule): Promise<EPrice[]> {
        try {
            let snapshot = await getFirestore()
                .collection(CollectionsDB.company).doc(schedule!.sportSpace!.company!.companyId)
                .collection(CollectionsDB.sportspace).doc(schedule!.sportSpace!.sportSpaceId)
                .collection(CollectionsDB.schedule).doc(schedule!.scheduleId)
                .collection(CollectionsDB.price)
                .get();

                let prices: EPrice[] = [];
                if (snapshot.empty) {
                    console.log('No matching documents.');
                    return prices;
                }
    
                snapshot.forEach((doc: any) => {
                    const data = doc.data();
                    prices.push(<EPrice>{
                        priceId:doc.id,
                        value:data.value,
                        currency:data.currency,
                        status: data.status,
                        created: data.created,
                    });
                });
    
                return prices;
        } catch (e) {
            functions.logger.log("Error al PriceRepository - getAllPriceBySchedule :" + e);
            return Promise.reject(e);
        }
    }

}