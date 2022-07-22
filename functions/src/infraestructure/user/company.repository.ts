import { ECompany } from "../../core/entities/e-company";
import admin = require('firebase-admin');
const { getFirestore } = require('firebase-admin/firestore');
import { CollectionsDB } from "../db/collections";
import { EUserRol } from "../../core/entities/e-user-rol";
import { Logger } from "../../utils/logger";
import { dateTimeGmT } from "../../utils/datetime-gmt";
import { CError } from "../../core/entities/enum/c-error";
import { CRoleStatus } from "../../core/entities/enum/c-role-status";


export class CompanyRepository {

    async getCompanyRoles(param: ECompany): Promise<EUserRol[]>  {
        try {            
            let snapshot = await getFirestore().collection(CollectionsDB.company).doc(param.companyId).collection(CollectionsDB.userRole).where("status",'==', CRoleStatus.enable).get();
            let userRoles: EUserRol[] = [];
            if (snapshot.empty) {
                console.log('No matching documents.');
                return userRoles;
            }

            snapshot.forEach((doc: any) => {
                const data = doc.data();
                userRoles.push({
                    userRolId: doc.id,
                    created: dateTimeGmT(data.created.toDate().getTime()),
                    role: data.role,                
                    company:<ECompany>{ 
                        companyId: param.companyId
                    },
                    user: {                        
                        userId: data.userId
                    }
                });
            });
            return userRoles;
        } catch (e) {            
            new Logger().error("CompanyRepository getCompanyRoles:", e)
            return Promise.reject(CError.Unknown);
        }
        
    }

    async createCompany(company: ECompany): Promise<ECompany> {
        try {
            let data = {
                "name": company.name,
                "description": company.description,
                "status": company.status,
                "acceptTermsConditions":admin.firestore.FieldValue.serverTimestamp(),
                "numSportSpaces": 0,
                "created": admin.firestore.FieldValue.serverTimestamp(),
            };
            let doc = getFirestore().collection(CollectionsDB.company).doc();
            await doc.create(data)
            company.companyId = doc.id;
            return company;
        } catch (e) {            
            new Logger().error("CompanyRepository - createCompany:", e)            
            return Promise.reject(CError.Unknown);
        }
    }

    async getCompanyById(companyId: String): Promise<ECompany> {
        try {
         
            let doc = await getFirestore().collection(CollectionsDB.company).doc(companyId).get();
            let company: ECompany;            
            const data = doc.data();
            if (data) {
                company = <ECompany>{
                    companyId: companyId,
                    description:data.description,
                    name: data.name,                                        
                    status: data.status,
                    created: dateTimeGmT(data.created.toDate().getTime()),
                    updated: data.updated != null ? (dateTimeGmT(data.updated.toDate().getTime())) : null,
                    numSportSpaces: data.numSportSpaces,                    
                }
                return company;
            }
            return Promise.reject(CError.NotFound);
        } catch (e) {
            new Logger().error("CompanyRepository - getCompany:", e)            
            return Promise.reject(CError.Unknown);
        }
    }

    async createCompanyRol(userRol:EUserRol): Promise<EUserRol> {
        try {            
            let data = {                
                "role": userRol.role,                
                "created": admin.firestore.FieldValue.serverTimestamp(),                                 
                "userId": userRol.user?.account?.accountId,
                "status": userRol.status,
                "companyId": userRol.company?.companyId       
            };
            
            let doc = getFirestore().collection(CollectionsDB.company).doc(userRol.company?.companyId).collection(CollectionsDB.userRole).doc();
            await doc.create(data)
            userRol.userRolId = doc.id;
            return userRol;
        } catch (e) {
            new Logger().error("CompanyRepository - createCompanyRol:", e)            
            return Promise.reject(CError.Unknown);
        }
        
    }

    async incrementeSportSpacesInCompany(companyId:String): Promise<void> {        
        try {            
            let data = {                
                "numSportSpaces": admin.firestore.FieldValue.increment(1),
                "updated": admin.firestore.FieldValue.serverTimestamp(),                
            };
            
            let doc = getFirestore().collection(CollectionsDB.company).doc(companyId);
            await doc.update(data)            
            return ;
        } catch (e) {
            new Logger().error("CompanyRepository - incrementeSportSpacesInCompany:", e)            
            return Promise.reject(CError.Unknown);
        }
    }

    async removeCompanyRole(userRol:EUserRol): Promise<boolean> {
        try {                     
            let doc = getFirestore().collection(CollectionsDB.company).doc(userRol.company?.companyId).collection(CollectionsDB.userRole).doc(userRol.userRolId);
            await doc.update({
                updated:  admin.firestore.FieldValue.serverTimestamp(),
                status: userRol.status
            })            
            return true;
        } catch (e) {
            new Logger().error("CompanyRepository - removeCompanyRole:", e)            
            return Promise.reject(CError.Unknown);
        }
        
    }

    async getUserRoleCompany(userRole: EUserRol): Promise<EUserRol> {
        try {
         
            let snapshot = await getFirestore().collection(CollectionsDB.company).doc(userRole.company!.companyId!).collection(CollectionsDB.userRole).where('userId','==', userRole.user!.account!.accountId)
                            .where('status', '==', 'E') 
                            .get();            
            let userRoles: EUserRol[] = [];
            if (snapshot.empty) {
                console.log('No matching documents.');
                return Promise.reject(CError.NotFound);
            }

            snapshot.forEach((doc: any) => {
                const data = doc.data();
                userRoles.push({
                    userRolId: doc.id,
                    created: dateTimeGmT(data.created.toDate().getTime()),
                    role: data.role,                
                    company:<ECompany>{ 
                        companyId: data.companyId
                    },
                    user: {                        
                        userId: data.userId
                    }
                });
            });
            return userRoles[0];
        } catch (e) {
            new Logger().error("CompanyRepository - getUserRoleCompany:", e)            
            return Promise.reject(CError.Unknown);
        }
    }
}