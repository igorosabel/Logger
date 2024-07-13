import { OCalendarMonthInterface } from './ocalendar-interfaces';

export default class OCalendarMonth {
  constructor(public month: number = 1, public year: number = 2023) {}

  fromInterface(ocd: OCalendarMonthInterface): OCalendarMonth {
    this.month = ocd.month;
    this.year = ocd.year;

    return this;
  }

  toInterface(): OCalendarMonthInterface {
    return {
      month: this.month,
      year: this.year,
    };
  }
}
