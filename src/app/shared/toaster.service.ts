import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ToasterService {
  private toasters = new BehaviorSubject<string>('');
  toasters$ = this.toasters.asObservable();

  showToaster(message: string) {
    this.toasters.next(message);
  }
}
