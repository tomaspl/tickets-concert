import { Component } from '@angular/core'
import { AppService } from '../../shared/app.service'
import { TailwindClassDirective } from '../../shared/directives/tailwind-class.directive'

@Component({
  selector: 'error-page',
  standalone: true,
  imports: [TailwindClassDirective],
  templateUrl: './error-page.component.html',
  styleUrl: './error-page.component.css',
})
export class ErrorPageComponent {
  error!: string
  currentColor = 'red'
  constructor(private appService: AppService) {}
  ngOnInit() {
    this.error = this.appService.error
  }
}
