import { ESchedule } from "../core/entities/e-schedule";
import admin = require('firebase-admin');
const { getFirestore } = require('firebase-admin/firestore');
import * as functions from "firebase-functions";
import { CollectionsDB } from "./db/collections";
import { ESportSpace } from "../core/entities/e-sport-space";
import { CScheduleStatus } from "../core/entities/enum/c-schedule-status";

export class ScheduleRepository {
    async createSchedule(schedule: ESchedule): Promise<ESchedule> {
        try {
            let data = {
                "category": schedule.category,
                "days": schedule.days,
                'status': schedule.status,
                "initHour": schedule.initHour,
                "endHour": schedule.endHour,
                'unitTimeUse':schedule.unitTimeUse,
                "created": admin.firestore.FieldValue.serverTimestamp(),
                "sportSpaceId": schedule.sportSpace?.sportSpaceId
            };
            let doc = getFirestore().collection(CollectionsDB.company).doc(schedule.sportSpace!.company?.companyId).collection(CollectionsDB.sportspace).doc(schedule.sportSpace?.sportSpaceId).collection(CollectionsDB.schedule).doc();
            await doc.create(data)
            schedule.scheduleId = doc.id;
            return schedule;
        } catch (e) {
            functions.logger.error("ScheduleRepository - createSchedule :" + e);
            return Promise.reject('Problema al crear el horario');
        }
    }

    async getAllSchedulesBySportSpace(sportSpace: ESportSpace): Promise<ESchedule[]> {
        try {
            let snapshot = await getFirestore()
            .collection(CollectionsDB.company).doc(sportSpace.company!.companyId)
            .collection(CollectionsDB.sportspace).doc(sportSpace.sportSpaceId)
            .collection(CollectionsDB.schedule)
            .where("status",'==', CScheduleStatus.enable)
            .orderBy('initHour')
            .get();

            let schedules: ESchedule[] = [];
            if (snapshot.empty) {
                console.log('No matching documents.');
                return schedules;
            }

            snapshot.forEach((doc: any) => {
                const data = doc.data();
                schedules.push(<ESchedule>{
                    scheduleId: doc.id,
                    category:data.category,
                    days:data.days,
                    initHour:data.initHour,
                    endHour:data.endHour,
                    unitTimeUse:data.unitTimeUse,
                    status: data.status,
                    created: data.created,
                });
            });

            return schedules;
        } catch (e) {
            functions.logger.error("ScheduleRepository - getAllSchedulesBySportSpace :" + e);
            return Promise.reject('Problemas al obtener los horarios');
        }
    }

    async removeSchedule(schedule: ESchedule): Promise<ESchedule> {
        try {
            let data = {
                'status': schedule.status,
                'updated': admin.firestore.FieldValue.serverTimestamp()
            };
            let doc = getFirestore().collection(CollectionsDB.company).doc(schedule.sportSpace!.company!.companyId)
            .collection(CollectionsDB.sportspace).doc(schedule.sportSpace!.sportSpaceId)
            .collection(CollectionsDB.schedule).doc(schedule.scheduleId!);
            
            await doc.update(data)
            schedule.updated = new Date();            
            return schedule;
        } catch (e) {
            functions.logger.error("ScheduleRepository - removeSchedule :" + e);
            return Promise.reject('Problemas al remover el horario');
        }
    }

}