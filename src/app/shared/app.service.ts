import {
  getDatabase,
  ref,
  update,
  remove,
} from 'firebase/database';
import { Injectable } from '@angular/core';
import app from '../../firebase';
import { familiesData } from '../data/families';
import { stagePreventa } from '../data/stage';
import { PageType } from '../model/PageType';
import { BehaviorSubject, Observable } from 'rxjs';
@Injectable({
  providedIn: 'root',
})
export class AppService {

  private rtdb = getDatabase(app);
  public currentPage: BehaviorSubject<PageType> =
    new BehaviorSubject<PageType>('loading');
  public currentPage$: Observable<PageType> = this.currentPage.asObservable();
  public theatreIsOpen: BehaviorSubject<boolean | null> = new BehaviorSubject<
    boolean | null
  >(null);
  public theatreIsOpen$: Observable<boolean | null> = this.theatreIsOpen.asObservable();
  public error!: string;

  changePage(page: PageType) {
    if (this.theatreIsOpen.value) {
      this.currentPage.next(page);
    } else {
      this.setError('La boleteria se encuentra cerrada.');
      this.currentPage.next('error');
    }
  }

    changeAvailability() {
      const updates = {} as any;
      const newValue = !this.theatreIsOpen.value;
      updates['/theatreIsOpen'] = newValue;
      if (!newValue) {
        this.setError('La boleteria se encuentra cerrada');
        this.currentPage.next('error');
      }
      this.theatreIsOpen.next(newValue);
  
      return update(ref(this.rtdb), updates);
    }

  resetApp() {
    this.removeQueue();
    this.removeFamilies();
    this.removeStage();
    this.resetFamilies();
    this.resetStage();
  }
  removeQueue() {
    const userStatusDatabaseRef = ref(this.rtdb, `/queue/`);

    // Llamada a remove() con manejo de promesas
    remove(userStatusDatabaseRef)
      .then(() => {
      })
      .catch((error) => {
        console.error('Error al eliminar la referencia:', error);
      });
  }

  removeFamilies() {
    const userStatusDatabaseRef = ref(this.rtdb, `/families/`);

    // Llamada a remove() con manejo de promesas
    remove(userStatusDatabaseRef)
      .then(() => {
      })
      .catch((error) => {
        console.error('Error al eliminar la referencia:', error);
      });
  }

  removeStage() {
    const userStatusDatabaseRef = ref(this.rtdb, `/seats/`);

    // Llamada a remove() con manejo de promesas
    remove(userStatusDatabaseRef)
      .then(() => {
      })
      .catch((error) => {
        console.error('Error al eliminar la referencia:', error);
      });
  }

  resetFamilies() {
    const userStatusDatabaseRef = ref(this.rtdb, `/families/`);
    update(userStatusDatabaseRef, familiesData).then(() => {

    });
  }

  resetStage() {
    const userStatusDatabaseRef = ref(this.rtdb, `/seats/`);

    update(userStatusDatabaseRef, stagePreventa).then(() => {

    });
  }

  setError(error: string) {
    this.error = error;
  }
