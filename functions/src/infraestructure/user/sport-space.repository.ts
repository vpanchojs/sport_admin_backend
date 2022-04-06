import { ESportSpace } from "../../core/entities/e-sport-space";
import admin = require('firebase-admin');
const { getFirestore } = require('firebase-admin/firestore');
import * as functions from "firebase-functions";
import { ECompany } from "../../core/entities/e-company";
import { CollectionsDB } from "../db/collections";
import { ESearchSportSpace } from "../../core/entities/e-search-sportspace";

export class SportSpaceRepository {
    async createSportSpace(sportSpace: ESportSpace): Promise<ESportSpace> {
        try {
            let data = {
                "name": sportSpace.name,
                "description": sportSpace.description,
                "maxTeams": sportSpace.maxTeams,
                "maxPlayersTeam": sportSpace.maxPlayersTeam,
                "material": sportSpace.material,
                "status": sportSpace.status,
                "created": admin.firestore.FieldValue.serverTimestamp(),
                "sportType": sportSpace.sportType,
                "companyId": sportSpace.company?.companyId
            };
            let doc = getFirestore().collection(CollectionsDB.company).doc(sportSpace.company?.companyId).collection(CollectionsDB.sportspace).doc();
            await doc.create(data)
            sportSpace.sportSpaceId = doc.id;
            return sportSpace;
        } catch (e) {
            functions.logger.error("SportSpaceRepository - createSportSpace :" + e);
            return Promise.reject('Problemas al crear el centro deportivo');
        }
    }

    async getAllSportSpacesByCompany(search: ESearchSportSpace): Promise<ESportSpace[]> {        
        try {
            let snapshotRef = getFirestore()
                .collection(CollectionsDB.company).doc(search.company.companyId)
                .collection(CollectionsDB.sportspace);

            let snapshot 
            if(search.status != null){
                snapshot = await snapshotRef.where("status",'==', search.status).get();
            }else{
                snapshot = await snapshotRef.get();
            }                                
            let sportSpaces: ESportSpace[] = [];
            if (snapshot.empty) {
                console.log('No matching documents');
                return sportSpaces;
            }

            snapshot.forEach((doc: any) => {
                const data = doc.data();
                sportSpaces.push(<ESportSpace>{
                    sportSpaceId: doc.id,
                    name: data.name,
                    description: data.description,
                    maxTeams: data.maxTeams,
                    maxPlayersTeam: data.maxPlayersTeam,
                    material: data.material,
                    status: data.status,
                    created: data.created.toDate().getTime() - ((5 * 60)* 60000),
                    sportType: data.sportType,
                    company: <ECompany>{
                        companyId: data.companyId
                    }
                });
            });

            return sportSpaces;
        } catch (e) {
            functions.logger.error("SportSpaceRepository - getAllSportSpacesByCompany :" + e);
            return Promise.reject("No se pueden obtener los centros deportivos");
        }
    }

    async enableSportSpace(sportSpace: ESportSpace): Promise<ESportSpace> {
        try {
            let data = {
                'status': sportSpace.status,
                'updated': admin.firestore.FieldValue.serverTimestamp()
            };
            let doc = getFirestore().collection(CollectionsDB.company).doc(sportSpace!.company?.companyId)
                                    .collection(CollectionsDB.sportspace).doc(sportSpace?.sportSpaceId);
            await doc.update(data)
            sportSpace.updated = new Date().getTime()  - ((5 * 60)* 60000);            
            return sportSpace;
        } catch (e) {
            functions.logger.error("SportSpaceRepository - enableSportSpace :" + e);
            return Promise.reject('Problemas al activar el espacio deportivo');
        }
    }

    async disableSportSpace(sportSpace: ESportSpace): Promise<ESportSpace> {
        try {
            let data = {
                'status': sportSpace.status,
                'updated': admin.firestore.FieldValue.serverTimestamp()
            };
            let doc = getFirestore().collection(CollectionsDB.company).doc(sportSpace!.company!.companyId)
                                    .collection(CollectionsDB.sportspace).doc(sportSpace!.sportSpaceId);
            await doc.update(data)
            sportSpace.updated = new Date().getTime() - ((5 * 60)* 60000);            
            return sportSpace;
        } catch (e) {
            functions.logger.error("SportSpaceRepository - disableSportSpace :" + e);
            return Promise.reject('Problemas al desactivar el espacio deportivo');
        }
    }

}