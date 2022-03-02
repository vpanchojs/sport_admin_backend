import 'package:sport_admin/core/catalog/enum/c_reservation_status.dart';
import 'package:sport_admin/core/entities/company/e_price.dart';
import 'package:sport_admin/core/entities/company/e_schedule.dart';
import 'package:sport_admin/core/entities/user/e_user.dart';

import 'e_payment.dart';
import { ESchedule } from './e-schedule';
import { EUser } from './e-user';
import { EPrice } from './e-price';
import { CReservationStatus } from './enum/c-reservation-status';
import { EPayment } from './e-payment';

export interface EReservation {
  reservationId?: String;
  schedule?: ESchedule;
  initTime?: Date;
  endTime?: Date;
  created?: Date;
  updated?: Date;
  status?: CReservationStatus;
  client?: EUser;
  observation?: String;
  payment?: EPayment;
  price: EPrice;
}