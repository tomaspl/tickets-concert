import { Component } from '@angular/core'
import { TailwindClassDirective } from '../../shared/directives/tailwind-class.directive'

@Component({
  selector: 'small-resolution-page',
  standalone: true,
  imports: [TailwindClassDirective],
  template: `<div class="flex flex-col place-content-center">
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
          <span class="bg-transparent"
            >La resolucion es demasiado chica para ver el mapa del teatro.<br /><b
              class="bg-transparent"
              >Le recomendamos o bien maximizar su ventana o acceder desde un
              dispositivo de mayor resolucion</b
            ></span
          >
        </span>
      </div>
    </div>
  </div> `,
})
export class SmallResolutionPageComponent {}
