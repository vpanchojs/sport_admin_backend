import * as functions from "firebase-functions";
import { CompanyService } from "../application/service/company.service";
import { UserService } from "../application/service/user.service";
import { ECompany } from "../core/entities/e-company";
import { EResponse } from "../core/entities/e-reponse";
import { EUser } from "../core/entities/e-user";
import { EUserRol } from "../core/entities/e-user-rol";

export const updateUser = functions.https.onCall(async (data, context) => {
  let user: EUser;
  user = {
    userId: context.auth?.uid,
    name: data.fullName,
    birthday: new Date(data.birthday),
    gender:  data.gender.code
  }
  const response: EResponse<EUser> = await new UserService().createUser(user)
  return response
});


export const createUser = functions.https.onCall(async (data, context) => {
  let user: EUser;
  user = {
    userId: context.auth?.uid,
    lastName: data.lastName,
    name: data.name,
    account: {
      email: data.account.email,
      password: data.account.password
    }
  }
  const response: EResponse<EUser> = await new UserService().createUser(user)
  return response
});


export const getUser = functions.https.onCall(async (data, context) => {
  const uid = context.auth?.uid;
  functions.logger.log("Data uid:" + uid);
  const response: EResponse<EUser> = await new UserService().getUserById(uid!);
  return response;
});

export const crearCompany = functions.https.onCall(async (data, context) => {
  let company:ECompany;
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
