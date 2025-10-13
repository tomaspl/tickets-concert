import { Component, OnDestroy, OnInit } from '@angular/core'
import { CommonModule } from '@angular/common'
import { FamilyService } from '../../shared/family.service'
import { Subscription, combineLatest, filter, interval, take } from 'rxjs'
import { MapComponent } from '../../theater/map/map.component'
import { sanitizeFamily } from '../../utils/map'
import { Family } from '../../model/Family'
import { environment } from '../../../environments/environment'
import { TailwindClassDirective } from '../../shared/directives/tailwind-class.directive'

@Component({
  selector: 'app-family-list',
  standalone: true,
  imports: [CommonModule, MapComponent, TailwindClassDirective],
  template: ` <div class="grid lg:grid-cols-2 lg:gap-4">
      <div class="flex items-center justify-start">
        <label for="price" class="text-sm font-medium leading-6 text-gray-900"
          >Filtrar por apellido:</label
        >
        <input
          type="text"
          (keyup)="keyUpHandler($event)"
          name="price"
          id="price"
          class="block w-auto ml-2 rounded-md border-0 py-2 px-4 my-2 lg:my-4 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
        />
      </div>
      <div></div>
      <div></div>
      <div></div>
    </div>
    <div class="overflow-x-auto rounded-lg shadow">
      <table class="min-w-full table-fixed bg-white">
        <thead>
          <tr>
            <th
              class="w-1/4 px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Código de Familia
            </th>
            <th
              class="w-1/4 px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Apellido
            </th>
            <th
              class="w-1/4 px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Preventa
            </th>
            <th
              class="w-1/4 px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Acciones
            </th>
          </tr>
        </thead>
        <tbody>
          @for (family of orderedFamilies; track family) {
            <tr class="animated-div odd:bg-gray-100" #rowElement>
              <td
                class="w-1/4 px-6 py-4 whitespace-nowrap text-sm text-gray-900"
              >
                {{ family.familyCode }}
              </td>
              <td
                class="w-1/4 px-6 py-4 whitespace-nowrap text-sm text-gray-900"
              >
                {{ family.lastName }}
              </td>
              <td
                class="w-1/4 px-6 py-4 whitespace-nowrap text-sm text-gray-900"
              >
                {{ family.preventa ? 'Si' : 'No' }}
              </td>
              <td
                class="w-1/4 px-6 py-4 whitespace-nowrap text-sm text-gray-900"
              >
                <div class="flex flex-wrap justify-center gap-2">
                  <p class="hidden lg:block">
                    {{ url + family.familyId }}
                  </p>
                  <button
                    (click)="copyUrl(url + family.familyId, rowElement)"
                    [appTailwindClass]="'btn-small-red'"
                  >
                    Copiar link
                  </button>
                  <button
                    (click)="goTo(url + 'reserva/' + family.familyId)"
                    target="_blank"
                    [appTailwindClass]="'btn-small-red'"
                  >
                    Reservas
                  </button>
                </div>
              </td>
            </tr>
          }
        </tbody>
      </table>
    </div>`,
})
export class FamilyListComponent {
  url: string
  families: Family[] = []
  familiesSearch: Family[] = []

  constructor(private familyService: FamilyService) {
    this.url = environment.url
  }
  ngOnInit(): void {
    this.familyService.fetchFamilies()

    this.familyService.families$
      .pipe(
        filter((response) => Object.keys(response).length > 0), // Ignorar arrays vacíos
        take(1), // Tomar solo la primera emisión con datos
      )
      .subscribe((response) => {
        const families = sanitizeFamily(response)
        this.families = families
        this.familiesSearch = families
      })
  }
  get orderedFamilies() {
    return this.familiesSearch.sort((a, b) => {
      return a.preventa === b.preventa ? 0 : a.preventa ? -1 : 1
    })
  }
  keyUpHandler($event: any) {
    const word = $event?.target.value.toUpperCase()
    this.familiesSearch = this.families.filter(
      (fam) => fam.lastName.indexOf(word) > -1,
    )
  }

  copyUrl(url: string, family: HTMLElement) {
    family.classList.add('animate-bg')
    setTimeout(() => {
      family.classList.remove('animate-bg')
    }, 1000) //
    navigator.clipboard
      .writeText(url)
      .then(() => {})
      .catch((err) => {})
  }

  goTo(url: string) {
    window.open(url)
  }
}
