import { Component } from '@angular/core'
import { AppService } from '../../shared/app.service'
import { TailwindClassDirective } from '../../shared/directives/tailwind-class.directive'

@Component({
  selector: 'error-page',
  standalone: true,
  imports: [TailwindClassDirective],
  template: `<div class="flex flex-col place-content-center">
    <div class="max-w-lg mx-auto mt-4">
      <div [appTailwindClass]="'card-alert'">
        <div class="flex flex-col items-center bg-transparent text-center">
          <svg
            class="w-14 h-14 bg-transparent"
            fill="currentColor"
            viewBox="0 0 22.4 22.4"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M10 2a8 8 0 100 16 8 8 0 000-16zm-1 12h2v2h-2v-2zm0-10h2v8h-2V4z"
            />
          </svg>

          <span class="bg-transparent mt-2">
            <b class="bg-transparent">{{ error }}</b>
          </span>
        </div>
      </div>
    </div>
  </div> `,
})
export class ErrorPageComponent {
  error!: string
  currentColor = 'red'
  constructor(private appService: AppService) {}
  ngOnInit() {
    this.error = this.appService.error
  }
}
