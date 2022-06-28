import * as admin from 'firebase-admin';
import { EUser } from "../../core/entities/e-user";
import * as functions from "firebase-functions";
import { EUserRol } from '../../core/entities/e-user-rol';
import { ECompany } from '../../core/entities/e-company';
import { ERole } from '../../core/entities/e-role';
import { CollectionsDB } from '../db/collections';
import { getAuth,  } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';
import { initializeApp } from 'firebase-admin/app';
//import { FirebaseError } from '@firebase/util';
import { FirebaseError } from 'firebase-admin';
import { EAccount } from '../../core/entities/e-account';
import { Logger } from '../../utils/logger';
import { CError } from '../../core/entities/enum/c-error';


initializeApp();

export class UserRepository {

    async createUser(user: EUser): Promise<string> {

        try {
            let userCreate = {  
                uid: user.account?.accountId,              
                email: user.account!.email,
                password: user.account!.password,
                displayName: user.name + ', ' + user.lastName
            }                                            
            let accountCreated = await getAuth().createUser(userCreate)

            return accountCreated.uid;
        } catch (e) {            
            new Logger().error("UserRepository - createUser:", e)                        
            if(isFirebaseError(e)){      
                new Logger().error("UserRepository - createUser:", e.stack)
                if(e.code == 'auth/email-already-exists'){
                    return Promise.reject(CError.AlreadyExists);
                }   
            }
            return Promise.reject(CError.Unknown);
            //return Promise.reject("Verifique sus datos e intentelo nuevamente");
        }

    }

    async savedUser(user: EUser): Promise<EUser> {
        try {
            let data = {
                "name": user.name,
                "lastName": user.lastName,
                "status": user.status,
                "created": admin.firestore.FieldValue.serverTimestamp(),
                "dni":user.dni
            };            
            let doc;
            if(user.account?.accountId){
                doc = getFirestore().collection(CollectionsDB.user).doc(user.account!.accountId!);
            }else{                
                doc = getFirestore().collection(CollectionsDB.user).doc();
            }                                     
            await doc.create(data)
            user.account!.accountId = doc.id;
            return user;
        } catch (e) {
            //return Promise.reject('No se pudo almacenar la información del usuario, porfavor comuniquese con soporte');
            new Logger().error("UserRepository - savedUser :", e)            
            return Promise.reject(CError.Unknown);                
        }
    }

    async getUser(accountId: string): Promise<EUser> {
        try {
            const account = await getAuth().getUser(accountId);            
            let doc = await getFirestore().collection("user").doc(accountId).get();
            let user: EUser;            
            const data = doc.data();
            if (data) {
                user = {
                    name: data.name,
                    account:{
                        accountId:doc.id,
                        email:account.email!,
                        verified: account.emailVerified!                    
                    },                    
                    status: data.state,
                    lastName: data.lastName,
                    created: data.created,
                }
                return user;
            }
            return Promise.reject(CError.NotFound);
        } catch (error) {
            const e = new Logger().error("UserRepository - getUser:", error)
            return Promise.reject(e);    
                    
        }
    }

    async searchUserByDni(dni: string): Promise<EUser> {
        try {                      
            let doc = await getFirestore().collection("user").where('dni','==',dni).get();
            //Obtener el email de la cuenta de usuario
            let users: EUser[]=[];                       
            if (doc.empty) {                                
                return Promise.reject(CError.NotFound);   
            }
            doc.forEach((user: any) => {
                const data = user.data();
                users.push(<EUser>{
                    dni:data.dni,
                    lastName:data.lastName,
                    name:data.name,
                    account:<EAccount>{
                        accountId:user.id,
                        email:data.email
                    },
                    status:data.status
                });
            });            
            return users[0];
        } catch (e) {            
            new Logger().error("UserRepository - searchUserByDni:", e)            
            return Promise.reject(CError.Unknown);            
        }
    }

    async updateUser(user: EUser): Promise<EUser> {
        try {
            let data = {
                "name": user.name,
                "lastName": user.lastName,
                "status": user.status,
                //'birthday': admin.firestore.Timestamp.fromDate(user.birthday!),
                //"gender": user.gender,
            };
            let doc = getFirestore().collection("user").doc(user.account?.accountId!);
            await doc.update(data);
            return user;
        } catch (e) {            
            new Logger().error("UserRepository updateUser:", e)            
            return Promise.reject(CError.Unknown);   
        }
    }


    async getUserRol(accountId: string): Promise<EUserRol[]> {
        try {            
            let snapshot = await getFirestore().collectionGroup(CollectionsDB.userRole).where('userId', '==', accountId).get();
            let userRoles:EUserRol[] = [];
            if (snapshot.empty) {
                console.log('No matching documents.');
                return userRoles;
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
            new Logger().error("UserRepository getUserRol:", e)
            return Promise.reject(CError.Unknown);        
        }
    }

    async verifyEmail(uid: string): Promise<boolean> {

        try {
            let accountCreated = await getAuth().updateUser(uid,{
                emailVerified: true
            })

            return accountCreated.emailVerified;
        } catch (e) {
            functions.logger.error("UserRepository - verifyEmail :" + e );   
            return Promise.reject("No se pudo validar el correo");
        }

    }


}

export default function isFirebaseError(error: unknown): error is FirebaseError {
    return (error as FirebaseError).code !== undefined;
  }