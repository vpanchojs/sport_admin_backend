import 'e_catalog.ts';
import { ECatalog } from './e-catalog';

export interface EItemCatalog {  
  code:string 
  created?:Date
  expired?:Date
  name ?:string 
  description?:string 
  catalog?:ECatalog
  parent?:EItemCatalog
}