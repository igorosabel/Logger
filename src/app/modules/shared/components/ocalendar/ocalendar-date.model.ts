import { OCalendarDateInterface } from './ocalendar-interfaces';

export default class OCalendarDate {
  constructor(
    public day: number = 1,
    public month: number = 1,
    public year: number = 2023,
    public isMarked: boolean = false
  ) {}

  fromInterface(ocd: OCalendarDateInterface): OCalendarDate {
    this.day = ocd.day;
    this.month = ocd.month;
    this.year = ocd.year;
    this.isMarked = ocd.isMarked;

    return this;
  }

  toInterface(): OCalendarDateInterface {
    return {
      day: this.day,
      month: this.month,
      year: this.year,
      isMarked: this.isMarked,
    };
  }
}
