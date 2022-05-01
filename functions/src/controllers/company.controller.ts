import * as functions from "firebase-functions";
import { CompanyService } from "../application/service/company.service";
import { ECompany } from "../core/entities/e-company";
import { EResponse } from "../core/entities/e-reponse";
import { EUserRol } from "../core/entities/e-user-rol";

export const crearCompany = functions.region('southamerica-east1').https.onCall(async (data, context) => {
    functions.logger.info("controller - crearCompany:" + JSON.stringify(data));
    let company: ECompany;
    const uid = context.auth?.uid;
    company = {
      name:data.name,
      description:data.description,
      admin:{
        account:{
          accountId:uid
        }
      }
    }
  
    const response: EResponse<EUserRol> = await new CompanyService().createCompany(company);
    return response;
  
  });
  