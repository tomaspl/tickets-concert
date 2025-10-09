import { Component } from '@angular/core'
import { TailwindClassDirective } from '../../shared/directives/tailwind-class.directive'

@Component({
  selector: 'small-resolution-page',
  standalone: true,
  imports: [TailwindClassDirective],
  templateUrl: './small-resolution-page.component.html',
  styleUrl: './small-resolution-page.component.css',
})
export class SmallResolutionPageComponent {}
