export enum CDay { monday, tuesday, wednesday, thursday, friday, saturday, sunday }


export function cDayFromCode(code: number): CDay {
    switch (code) {
        case 0:
            return CDay.sunday;
        case 1:
            return CDay.monday;
        case 2:
            return CDay.tuesday;
        case 3:
            return CDay.wednesday;
        case 4:
            return CDay.thursday;
        case 5:
            return CDay.friday;
        case 5:
            return CDay.saturday;
        default:
            return CDay.friday
    }
}