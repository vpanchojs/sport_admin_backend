import { ECompany } from "../../core/entities/e-company";
import { EUserRol } from "../../core/entities/e-user-rol";
import { CRol } from "../../core/entities/enum/c-rol";
import { Logger } from "../../utils/logger";
import { CreateCompanyUseCase } from "../usecase/company/create-company.usecase";
import { GetCompanyRolesUseCase } from "../usecase/company/get-company-roles.usecase";
import { GetCompanyByIdUseCase } from "../usecase/company/get-company.usecase";
import { CreateRoleCompanyUseCase } from "../usecase/company/create-role-company.usecase";
import { GetUserByIdUseCase } from "../usecase/user/get-user.usecase";
import { RemoveRoleCompanyUseCase } from "../usecase/company/remove-role-company.usecase";
import { GetAccountByEmailUseCase } from "../usecase/user/get-account-email-usecase";
import { GetUserRolCompanyUseCase } from "../usecase/company/get-user-role-company.usecase";
import { CError } from "../../core/entities/enum/c-error";

export class CompanyService {

    async getCompanyById(data: ECompany): Promise<ECompany> {
        try {            
            const company = await new GetCompanyByIdUseCase().execute(data.companyId!);
            return company;
        } catch (error) {
            const e = new Logger().error("CompanyService - getCompanyById", error);
            return Promise.reject(e);
        }
    }

    async getCompanyByIdWithRoles(data: ECompany): Promise<ECompany> {
        try {            
            const company = await new GetCompanyByIdUseCase().execute(data.companyId!);
            const roles: EUserRol[] = await new GetCompanyRolesUseCase().execute(company);
            for (const userRol of roles) {
                if(userRol.user?.userId != null){
                    try{
                        const user = await new GetUserByIdUseCase().execute(userRol.user.userId!);
                        userRol.user = user;
                    }finally{}                    
                }
            }
            company.roles = roles;
            return company;             
        } catch (error) {
            const e = new Logger().error("CompanyService - getCompanyById", error);
            return Promise.reject(e);
        }
    }

    async createCompany(company:ECompany): Promise<EUserRol> {        
        try {
            const companyCreated = await new CreateCompanyUseCase().execute(company);
            let userRole: EUserRol = {
                company: companyCreated,
                role:  CRol.companyAdmin,
                user: company.admin
            }
            const userRolCreated = await new CreateRoleCompanyUseCase().execute(userRole);
            return userRolCreated;
            
        } catch (error) {
            const e = new Logger().error("CompanyService - createCompany", error);
            return Promise.reject(e);
        }
    }

    async createUserRole(userRole: EUserRol): Promise<EUserRol> {        
        try {
            const account = await new GetAccountByEmailUseCase().execute(userRole.user!.account!.email!);
            userRole.user!.account = account;
            let isExist = false;
            try{
                 await new GetUserRolCompanyUseCase().execute(userRole);
                 isExist = true;
            }catch(e){
                if (e == CError.NotFound) {
                    isExist = false;    
                }else{
                    return Promise.reject(e);        
                }                
            }
            if(isExist == true){
                return Promise.reject(CError.AlreadyExists);    
            }
            const userRolCreated = await new CreateRoleCompanyUseCase().execute(userRole);
            return userRolCreated;
        } catch (error) {
            const e = new Logger().error("CompanyService - createUserRole", error);
            return Promise.reject(e);
        }
    }

    async removeUserRole(userRole: EUserRol): Promise<boolean> {        
        try {            
            const removed= await new RemoveRoleCompanyUseCase().execute(userRole);
            return removed;
        } catch (error) {
            const e = new Logger().error("CompanyService - removeUserRole", error);
            return Promise.reject(e);
        }
    }
}