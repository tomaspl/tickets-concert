import { Injectable } from '@angular/core'
import { BehaviorSubject, Subject } from 'rxjs'

@Injectable({
  providedIn: 'root',
})
export class ToasterService {
  private toasters = new BehaviorSubject<string>('')
  toasters$ = this.toasters.asObservable()
  private toastersSeats = new BehaviorSubject<string>('')
  toastersSeats$ = this.toastersSeats.asObservable()

  showToaster(message: string) {
    this.toasters.next(message)
  }

  showToasterSeats(message: string) {
    this.toastersSeats.next(message)
  }
}
