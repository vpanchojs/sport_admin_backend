import 'package:sport_admin/core/entities/company/e_sport_space.dart';
import 'package:sport_admin/core/entities/reservation/e_reservation.dart';
import { EReservation } from './e-reservation';
import { ESchedule } from './e-schedule';
import { ESportSpace } from './e-sport-space';

export interface ESearchReservation{
  date?: number;
  sportSpace?: ESportSpace;
  reservations?: EReservation[];
  schedules? : ESchedule []
}