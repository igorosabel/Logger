import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  template: `<router-outlet />`,
  styleUrls: [],
  imports: [RouterOutlet],
})
export default class AppComponent {}
