import admin = require('firebase-admin');
import { EUser } from "../../core/entities/e-user";
import * as functions from "firebase-functions";
import { EUserRol } from '../../core/entities/e-user-rol';
import { ECompany } from '../../core/entities/e-company';
import { ERole } from '../../core/entities/e-role';
import { CollectionsDB } from '../db/collections';
const { getAuth } = require('firebase-admin/auth');
const { getFirestore } = require('firebase-admin/firestore');
const { initializeApp }= require('firebase-admin/app');


initializeApp();

export class UserRepository {

    async createUser(user: EUser): Promise<string> {

        try {
            let accountCreated = await getAuth().createUser({
                email: user.account?.email,
                password: user.account?.password,
                displayName: user.name + ',' + user.lastName
            })

            return accountCreated.uid;
        } catch (e) {
            functions.logger.error("UserRepository - createUser :" + e);
            return Promise.reject("El correo electrónico ya esta en uso");
        }
    }

    async savedUser(user: EUser): Promise<EUser> {
        try {
            let data = {
                "name": user.name,
                "lastName": user.lastName,
                "status": user.status,
                "created": admin.firestore.FieldValue.serverTimestamp(),
            };
            let doc = getFirestore().collection(CollectionsDB.user).doc(user.account!.accountId!);
            await doc.create(data)
            return user;
        } catch (e) {
            functions.logger.error("UserRepository - savedUser :" + e);
            return Promise.reject('No se pudo almacenar la información del usuario, porfavor comuniquese con soporte');
        }
    }

    async getUser(accountId: string): Promise<EUser|null> {
        try {
            const account = await getAuth().getUser(accountId);            
            let doc = await getFirestore().collection("user").doc(accountId).get();
            //Obtener el email de la cuenta de usuario
            let user: EUser;            
            const data = doc.data();
            if (data) {
                user = {
                    name: data.name,
                    account:{
                        accountId:doc.id,
                        email:account.email!,                    
                    },                    
                    status: data.state,
                    lastName: data.lastName,
                    created: data.created,
                }
                return user;
            }
            return null;
        } catch (e) {
            functions.logger.error("UserRepository - getUser:" + e);
            return Promise.reject("Problemas al obtener el usuario");
        }
    }

    async updateUser(user: EUser): Promise<EUser> {
        try {
            let data = {
                "name": user.name,
                'birthday': admin.firestore.Timestamp.fromDate(user.birthday!),
                "gender": user.gender,
            };
            let doc = getFirestore().collection("user").doc(user.userId!);
            await doc.update(data);
            return user;
        } catch (e) {
            functions.logger.error("UserRepository updateUser:" + e);
            return Promise.reject("Problemas al actualizar el usuario");
        }
    }


    async getUserRol(accountId: string): Promise<EUserRol[] | null> {
        try {            
            let snapshot = await getFirestore().collection("user").doc(accountId).collection('user-rol').get();
            let userRoles:EUserRol[] = [];
            if (snapshot.empty) {
                console.log('No matching documents.');
                return null;
            }

            snapshot.forEach((doc: any) => {
                const data = doc.data();
                userRoles.push({
                    created: data.created,
                    role:<ERole>{
                        code: data.role
                    },
                    company:<ECompany>{ 
                        companyId:data.companyId
                    }
                });
            });

            return userRoles;

        } catch (e) {
            functions.logger.error("UserRepository getUserRol:" + e);
            return Promise.reject('Problemas al obtener el rol del usuario');
        }
    }

    async createUserRol(userRol:EUserRol): Promise<EUserRol> {
        try {            
            let data = {
                "companyId": userRol.company?.companyId,
                "role": userRol.role?.code,                
                "created": admin.firestore.FieldValue.serverTimestamp(),
            };
            
            let doc = await getFirestore().collection("user").doc(userRol.user?.account?.accountId).collection('user-rol').doc();
            await doc.create(data)
            userRol.userRolId = doc.id;
            return userRol;
        } catch (e) {
            functions.logger.error("UserRepository createUserRol:" + e);
            return Promise.reject('Problemas al crear el rol al usuario');
        }
    }


}