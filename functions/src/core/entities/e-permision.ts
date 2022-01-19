import 'package:sport_admin/core/catalog/enum/c_actions.dart';
import 'package:sport_admin/core/catalog/enum/c_entities.dart';
import 'package:sport_admin/core/catalog/enum/c_permission_status.dart';

export interface EPermision{
  permissionId?:String;
  actions?:CActions[];
  entities?:CEntities;
  status?:CPermissionStatus;
  created?:Date;
  updated?:Date;
}