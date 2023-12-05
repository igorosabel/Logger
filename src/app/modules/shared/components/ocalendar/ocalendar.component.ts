import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { OCalendarDate } from "./ocalendar-date.model";
import { OCalendarMonthItemInterface } from "./ocalendar-interfaces";
import { OCalendarMonth } from "./ocalendar-month.model";

@Component({
  selector: "ocalendar",
  standalone: true,
  imports: [FormsModule],
  templateUrl: "./ocalendar.component.html",
  styleUrls: ["./ocalendar.component.scss"],
})
export class OcalendarComponent implements OnInit {
  @Input() initialMonth: number;
  @Input() initialYear: number;
  @Input() markedDays: string[];
  @Output() calendarChanged: EventEmitter<OCalendarMonth> = new EventEmitter();
  @Output() daySelectedChanged: EventEmitter<OCalendarDate> =
    new EventEmitter();

  months: OCalendarMonthItemInterface[] = [
    { month: 1, name: "Enero" },
    { month: 2, name: "Febrero" },
    { month: 3, name: "Marzo" },
    { month: 4, name: "Abril" },
    { month: 5, name: "Mayo" },
    { month: 6, name: "Junio" },
    { month: 7, name: "Julio" },
    { month: 8, name: "Agosto" },
    { month: 9, name: "Septiembre" },
    { month: 10, name: "Octubre" },
    { month: 11, name: "Noviembre" },
    { month: 12, name: "Diciembre" },
  ];
  years: number[] = [];

  currentMonth: number;
  currentYear: number;
  weeks: OCalendarDate[][] = [];

  ngOnInit(): void {
    this.currentMonth = this.initialMonth || new Date().getMonth() + 1;
    this.currentYear = this.initialYear || new Date().getFullYear();
    this.generateCalendar([]);
  }

  updateYearList(): void {
    this.years = [];
    for (let y: number = this.currentYear - 5; y <= this.currentYear + 5; y++) {
      this.years.push(y);
    }
  }

  generateCalendar(markedDays: string[]): void {
    this.weeks = [];
    this.markedDays = markedDays;
    const firstDay = new Date(this.currentYear, this.currentMonth - 1, 1);
    const startingDay: number = (firstDay.getDay() - 1 + 7) % 7; // Ajustar para iniciar en lunes
    const lastDay = new Date(this.currentYear, this.currentMonth, 0);
    let startDate: Date = new Date(firstDay);
    startDate.setDate(startDate.getDate() - startingDay);

    while (startDate <= lastDay) {
      const week: OCalendarDate[] = [];
      for (let i: number = 0; i < 7; i++) {
        if (startDate.getMonth() === firstDay.getMonth()) {
          week.push(
            new OCalendarDate(
              startDate.getDate(),
              startDate.getMonth() + 1,
              startDate.getFullYear(),
              this.isDateMarked(startDate)
            )
          );
        } else {
          week.push(null);
        }
        startDate.setDate(startDate.getDate() + 1);
      }
      this.weeks.push(week);
    }
    this.updateYearList();
  }

  changeMonth(change: number = null): void {
    if (change !== null) {
      this.currentMonth += change;
      if (this.currentMonth < 1) {
        this.currentMonth = 12;
        this.currentYear -= 1;
      } else if (this.currentMonth > 12) {
        this.currentMonth = 1;
        this.currentYear += 1;
      }
    }
    this.generateCalendar([]);
    this.calendarChanged.emit(
      new OCalendarMonth(this.currentMonth, this.currentYear)
    );
  }

  changeYear(change: number): void {
    this.currentYear += change;
    this.generateCalendar([]);
    this.calendarChanged.emit(
      new OCalendarMonth(this.currentMonth, this.currentYear)
    );
  }

  private isDateMarked(date: Date): boolean {
    const formattedDate = `${date.getDate() < 10 ? "0" : ""}${date.getDate()}-${
      date.getMonth() + 1 < 10 ? "0" : ""
    }${date.getMonth() + 1}`;
    return this.markedDays && this.markedDays.includes(formattedDate);
  }

  selectDay(day: OCalendarDate): void {
    this.daySelectedChanged.emit(day);
  }
}
