import { ECompany } from "../../core/entities/e-company";
import admin = require('firebase-admin');
const { getFirestore } = require('firebase-admin/firestore');
import * as functions from "firebase-functions";


export class CompanyRepository {
    async createCompany(company: ECompany): Promise<ECompany> {
        try {
            let data = {
                "name": company.name,
                "description": company.description,
                "status": company.status,
                "acceptTermsConditions":admin.firestore.FieldValue.serverTimestamp(),
                "created": admin.firestore.FieldValue.serverTimestamp(),
            };
            let doc = getFirestore().collection("company").doc();
            await doc.create(data)
            company.companyId = doc.id;
            return company;
        } catch (e) {
            functions.logger.log("Error:" + e);
            return Promise.reject(e);
        }
    }

    async getCompanyById(companyId: String): Promise<ECompany|null> {
        try {
            functions.logger.log("CompanyRepository - getCompany: uid" + companyId);
         
            let doc = await getFirestore().collection("company").doc(companyId).get();
            //Obtener el email de la cuenta de usuario
            let company: ECompany;            
            const data = doc.data();
            if (data) {
                company = <ECompany>{
                    companyId:companyId,
                    description:data.description,
                    name: data.name,                                        
                    status: data.state,
                    created: data.created,
                }
                return company;
            }
            return null;
        } catch (e) {
            functions.logger.log("CompanyRepository - getCompany:" + e);
            return Promise.reject("Problemas al obtener la compañia");
        }
    }
}