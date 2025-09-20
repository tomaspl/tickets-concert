import { Component } from '@angular/core';
import { AppService } from '../../shared/app.service';

@Component({
  selector: 'error-page',
  standalone: true,
  imports: [],
  templateUrl: './error-page.component.html',
  styleUrl: './error-page.component.css',
})
export class ErrorPageComponent {
  error!: string;
  currentColor = 'red';
  constructor(private appService: AppService) {}
  ngOnInit() {
    this.error = this.appService.error;
  }
}
