import { Component, OnInit } from '@angular/core'
import { ToasterService } from '../toaster.service'
import { CommonModule } from '@angular/common'
import { BrPipe } from '../pipes/br.pipe'

@Component({
  selector: 'app-toaster',
  standalone: true,
  imports: [CommonModule, BrPipe],
  templateUrl: './toaster.component.html',
  styleUrl: './toaster.component.css',
})
export class ToasterComponent implements OnInit {
  toasters: { message: string; visible: boolean }[] = []
  toastersSeats: { message: string; visible: boolean }[] = []

  constructor(private toasterService: ToasterService) {}

  ngOnInit() {
    this.toasterService.toasters$.subscribe((message) => {
      if (message === '') return
      const toaster = { message, visible: true }
      this.toasters.push(toaster)
      setTimeout(() => (toaster.visible = false), 2000) // Fade out after 2 seconds
      setTimeout(() => {
        this.toasters = this.toasters.filter((t) => t !== toaster) // Remove toaster after fade out
      }, 2500)
    })

    this.toasterService.toastersSeats$.subscribe((message) => {
      if (message === '') {
        this.toastersSeats = []
        return
      }
      const toaster = { message, visible: true }
      this.toastersSeats = [toaster]
    })
  }
}
