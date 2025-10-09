// src/app/utils/tailwind-class.directive.ts

import {
  Directive,
  ElementRef,
  Input,
  Renderer2,
  OnChanges,
} from '@angular/core'
import {
  TOOLTIP,
  TOOLTIP_24,
  TOOLTIP_36,
  TOOLTIP_ADMIN,
  TOOLTIP_ARROW,
  BTN_PRIMARY,
  BTN_SMALL_RED,
  CARD_ALERT,
  FOOTER_FIXED,
  FIXED_BOTTOM_BAR,
  BTN_CUMBRES,
} from '../../tailwind-classes'

@Directive({
  selector: '[appTailwindClass]',
  standalone: true,
})
export class TailwindClassDirective implements OnChanges {
  @Input('appTailwindClass') className!: string

  constructor(
    private el: ElementRef,
    private renderer: Renderer2,
  ) {}

  ngOnChanges() {
    let classToAdd = ''

    switch (this.className) {
      case 'tooltip-arrow':
        classToAdd = TOOLTIP_ARROW
        break
      case 'tooltip':
        classToAdd = TOOLTIP
        break
      case 'tooltip-24':
        classToAdd = TOOLTIP_24
        break
      case 'tooltip-36':
        classToAdd = TOOLTIP_36
        break
      case 'tooltip-admin':
        classToAdd = TOOLTIP_ADMIN
        break
      case 'btn-primary':
        classToAdd = BTN_PRIMARY
        break
      case 'btn-small-red':
        classToAdd = BTN_SMALL_RED
        break
      case 'card-alert':
        classToAdd = CARD_ALERT
        break
      case 'footer-fixed':
        classToAdd = FOOTER_FIXED
        break
      case 'fixed-bottom-bar':
        classToAdd = FIXED_BOTTOM_BAR
        break
      case 'btn-cumbres':
        classToAdd = BTN_CUMBRES
        break
      default:
        classToAdd = ''
    }

    if (classToAdd) {
      // Convertir las clases en un array, usando split() por los espacios
      const classesArray = classToAdd.split(' ')

      // Agregar cada clase individualmente
      classesArray.forEach((classItem) => {
        this.renderer.addClass(this.el.nativeElement, classItem)
      })
    }
  }
}
