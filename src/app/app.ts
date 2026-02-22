import { Component, HostBinding } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ThemeService } from './core/theme/theme.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  constructor(public theme: ThemeService) {}

  @HostBinding('class.dark') get isDark(): boolean {
    return this.theme.theme() === 'dark';
  }
}
