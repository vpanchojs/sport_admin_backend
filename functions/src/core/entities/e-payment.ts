import 'package:sport_admin/core/catalog/enum/c_payment_status.dart';
import 'package:sport_admin/core/catalog/enum/c_payment_type.dart';

export interface EPayment {
  paymentId?: String;
  // status?: CPaymentStatus ;
  // type?: CPaymentType ;
  created?: Date;
  updated?: Date;
  priceTotal?: number;
}