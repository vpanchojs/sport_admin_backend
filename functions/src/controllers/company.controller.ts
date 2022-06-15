import * as functions from "firebase-functions";
import { CompanyService } from "../application/service/company.service";
import { ECompany } from "../core/entities/e-company";
import { EUserRol } from "../core/entities/e-user-rol";
import { CError } from "../core/entities/enum/c-error";
import { Logger } from "../utils/logger";

export const crearCompany = functions.region('southamerica-east1').https.onCall(async (data, context) => {
  new Logger().info("controller - crearCompany:", data)
  
  try {
    let company: ECompany;
    const uid = context.auth?.uid;
    company = {
      name: data.name,
      description: data.description,
      admin: {
        account: {
          accountId: uid
        }
      }
    }

    const response: EUserRol = await new CompanyService().createCompany(company);
    return response;
  } catch (error) {    
    new Logger().error("Controller - crearCompany", error);
    if (error == CError.NotFound) {
      throw new functions.https.HttpsError('not-found', 'No existe la compañia');
    } else {
      throw new functions.https.HttpsError('internal', 'Problemas al obtener la compañia');
    }
  }

});

export const getCompanyById = functions.region('southamerica-east1').https.onCall(async (data, context) => {
  new Logger().info("controller - getCompanyById:", data)
  try {
    const response: ECompany = await new CompanyService().getCompanyByIdWithRoles(data);
    return response;
  } catch (error) {
    new Logger().error("Controller - getCompanyById", error);
    if (error == CError.NotFound) {
      throw new functions.https.HttpsError('not-found', 'No existe la compañia');
    } else {
      throw new functions.https.HttpsError('internal', 'Problemas al obtener la compañia');
    }
  }
});


