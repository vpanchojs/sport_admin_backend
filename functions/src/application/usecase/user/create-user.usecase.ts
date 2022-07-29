import { UseCase } from "../../../core/base/usecase";
import { EUser } from "../../../core/entities/e-user";
import { CUserStatus } from "../../../core/entities/enum/c-user-state";
import { UserRepository } from "../../../infraestructure/user/user.repository";
import { CError } from "../../../core/entities/enum/c-error";
import { Logger } from "../../../utils/logger";


export class CreateUserUseCase implements UseCase<EUser, EUser>{

    async execute(param: EUser): Promise<EUser> {
        try {
            if (param.gender != null && param.name != null && param.lastName != null && param.dni != null) {
                return Promise.reject(CError.BadRequest);
            }
            param.account?.email?.trim(); 
            var user: EUser = {};
            try {
                user = await new UserRepository().searchUserByDni(param.dni!);                         
            } catch (error){               
                new Logger().info("=====No existe user2", param.dni);                                            
            }                                                            
            if(user.status == CUserStatus.ELIMINADO || user.status == CUserStatus.INACTIVO){
                return Promise.reject(CError.FailedPrecondition);
            }            
            //CUserStatus.ACTIVO si es creado desde el regitro de cuenta normal            
            if(param.status == CUserStatus.ACTIVO){                                                           
                //Si el usuario tiene usuario y cuenta
                if(user != null && user.status == CUserStatus.ACTIVO){   
                    return Promise.reject(CError.AlreadyExists);                  
                }            
                param.account!.accountId=user?.account?.accountId;           
                const accountId: string = await new UserRepository().createUser(param);                                
                if(user?.status == CUserStatus.REGISTRO_PENDIENTE){          
                    const updateUser: EUser = await new UserRepository().updateUser(param);
                    if (updateUser) {
                        return updateUser;
                    } 
                    return Promise.reject(CError.Unknown);                    
                }

                param.account!.accountId = accountId;

            }      
            // En caso de que se envie del crear reserva un usuario que esta creado pero no realizo busqueda      
            let userCreated;
            if(user.dni){
                userCreated = user;
            }else{
                userCreated = await new UserRepository().savedUser(param)
            }
            return userCreated;
        } catch (error) {
            const e = new Logger().error("CreateRoleUserUseCase", error);
            return Promise.reject(e);
        }
    }

}