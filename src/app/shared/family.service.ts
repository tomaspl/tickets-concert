import { Injectable } from '@angular/core';
import {
  getDatabase,
  ref,
  child,
  push,
  update,
  onValue,
  onDisconnect,
  get,
  remove,
} from 'firebase/database';
import app from '../../firebase';
import { BehaviorSubject, Observable } from 'rxjs';
import { SectionStage } from '../model/SectionStage';
import { sanitizeMap } from '../utils/map';
import { Reservation } from '../model/Reservation';
import { Seat } from '../model/Seat';
import { PageType } from '../model/PageType';
import { ActivatedRoute } from '@angular/router';
import { ToasterService } from './toaster.service';
import { messageTicketsPerFamily, seatsPerFamily } from '../constants';
import { AppService } from './app.service';

@Injectable({
  providedIn: 'root',
})
export class FamilyService {
  private rtdb = getDatabase(app);

  private ticketStage: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(
    false
  );
  public ticketStage$: Observable<boolean> = this.ticketStage.asObservable();
  private peopleBeforeMe: BehaviorSubject<number> = new BehaviorSubject<number>(
    0
  );
  public peopleBeforeMe$: Observable<number> =
    this.peopleBeforeMe.asObservable();
  private stageMap: BehaviorSubject<SectionStage[]> = new BehaviorSubject<
    SectionStage[]
  >([]);
  public stageMap$: Observable<SectionStage[]> = this.stageMap.asObservable();

  private families: BehaviorSubject<any> = new BehaviorSubject<any>({});
  public families$: Observable<any> = this.families.asObservable();


  private availableSeats: BehaviorSubject<number> = new BehaviorSubject<number>(
    0
  );
  public availableSeats$: Observable<number> =
    this.availableSeats.asObservable();

  public seatsPerFamily = seatsPerFamily;
  public familyCode!: number;

  private lastName: BehaviorSubject<string> = new BehaviorSubject<string>('');
  public lastName$: Observable<string> = this.lastName.asObservable();

  private preventa: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(
    false
  );
  public preventa$: Observable<boolean> = this.preventa.asObservable();

  private firstKey!: string;
  public selectedSeats = new Set();

  private details: BehaviorSubject<Reservation[] | null> = new BehaviorSubject<
    Reservation[] | null
  >(null);
  public details$: Observable<Reservation[] | null> =
    this.details.asObservable();
  public familyId!: string;
  constructor(
    private route: ActivatedRoute,
    private toasterService: ToasterService,
    private appService: AppService,
  ) {
    this.familyId = this.route.snapshot.paramMap.get('id') || '';
  }

  getCurrentPage() {
    return this.appService.currentPage$;
  }

  setFamilyId(id: string) {
    this.familyId = id;
  }

  listenIfTheatreIsOpen() {
    const queueRef = ref(this.rtdb, `/theatreIsOpen/`);
    onValue(
      queueRef,
      (snapshot) => {
        if (snapshot.exists()) {
          this.appService.theatreIsOpen.next(snapshot.val());
        }
      },
      {
        onlyOnce: false, // Configurar para escuchar cambios en tiempo real
      }
    );
  }

  familyOnSchool(familyId: string) {
    this.setFamilyId(familyId);
    const familiesRef = ref(this.rtdb, 'families/' + familyId);
    return get(familiesRef)
      .then((snapshot: any) => {
        if (snapshot.exists()) {
          this.availableSeats.next(snapshot.val().availableSeats);
          this.familyCode = snapshot.val().familyCode;
          this.lastName.next(snapshot.val().lastName);
          this.preventa.next(snapshot.val().preventa);
          return true;
        } else {
          return false;
        }
      })
      .catch((error) => {
        return false;
      });
  }

  familyOnQueue(familyId: string) {
    const queueRef = ref(this.rtdb, 'queue');
    return get(queueRef)
      .then((snapshot: any) => {
        if (snapshot.exists()) {
          let found = false;
          snapshot.forEach((childSnapshot: any) => {
            const data = childSnapshot.val();
            if (data.hasOwnProperty(familyId)) {
              found = true;
            }
          });
          return found;
        } else {
          return false;
        }
      })
      .catch((error) => {
        return false;
      });
  }

  registerFamily() {
    const connectedRef = ref(this.rtdb, '.info/connected');

    onValue(
      connectedRef,
      (snapshot) => {
        if (snapshot.val() === false) {
          return; 
        }

        // Cliente conectado; configurar acción onDisconnect
        const postData = { [this.familyId]: true, enteredAt: Date.now() };
        const newPostKey = push(child(ref(this.rtdb), 'queue')).key;
        const userStatusDatabaseRef = ref(this.rtdb, `/queue/${newPostKey}`);

        // Actualizar el estado de conexión del usuario
        update(userStatusDatabaseRef, postData)
          .then(() => {
            // Configura la eliminación en caso de desconexión
            onDisconnect(userStatusDatabaseRef)
              .remove()
              .then(() => {
              })
              .catch((error) => {
                console.error('Error al configurar onDisconnect:', error);
              });
          })
          .catch((error) => {
            console.error('Error al actualizar la base de datos:', error);
          });
      },
      {
        onlyOnce: false, // Escuchar cambios en tiempo real
      }
    );
  }

  detectChangeOnQueue() {
    const queueRef = ref(this.rtdb, `/queue/`);
    onValue(
      queueRef,
      (snapshot) => {
        if (snapshot.exists()) {
          const toJSON = snapshot.toJSON() as any;
          if (toJSON) {
            this.firstKey = Object.keys(toJSON)[0];
            const isItFirst = !!toJSON[this.firstKey][this.familyId];
            if (!isItFirst) {
              Object.keys(toJSON).forEach((item, index) => {
                if (toJSON[item][this.familyId]) {
                  this.peopleBeforeMe.next(index);
                }
              });
            }
            this.ticketStage.next(isItFirst);
          }
        }
      },
      {
        onlyOnce: false, // Configurar para escuchar cambios en tiempo real
      }
    );
  }

  removeFromSelectionDetail(sectionName: string, seat: Seat | null) {
    if (!seat) return;
    if (!this.details.value) return;
    this.details.next(
      this.details.value.filter((item) => {
        return !(
          item.sectionName === sectionName &&
          item.seat === seat.seat &&
          item.row === seat.row
        );
      })
    );
  }
  addToSelectionDetail(sectionName: string, seat: Seat | null) {
    if (!this.details.value) return;
    if (seat) {
      this.details.next([
        ...this.details.value,
        {
          sectionName: sectionName,
          seat: seat.seat,
          row: seat.row,
        },
      ]);
    }
  }

  fetchStageMap(id?: string) {
    const seatsRef = ref(this.rtdb, `/seats/`);

    // Listener para cambios en la referencia /queue/
    onValue(
      seatsRef,
      (snapshot) => {
        if (id) this.familyId = id;
        if (snapshot.exists()) {
          const toJSON = snapshot.toJSON() as any;
          const sanitizeMaptoJSON = sanitizeMap(toJSON);
          this.stageMap.next(sanitizeMaptoJSON);
          const details = [] as any;
          sanitizeMaptoJSON.forEach((stage) => {
            stage.seats?.forEach((row) => {
              row.forEach((seat) => {
                if (seat.familyId === this.familyId) {
                  details.push({
                    sectionName: stage.sectionName,
                    seat: seat.seat,
                    row: seat.row,
                  });
                }
              });
            });
          });
          this.details.next(details);
        } 
      },
      {
        onlyOnce: false, // Configurar para escuchar cambios en tiempo real
      }
    );
  }

  downloadReport(filename: string, type: string) {
    const seatsRef = ref(this.rtdb, `/`);

    onValue(
      seatsRef,
      (snapshot) => {
        if (snapshot.exists()) {
          const main = snapshot.val();
          const sections = Object.keys(main.seats);
          let data: any[] = [];
          sections.forEach((section) => {
            main.seats[section].forEach((seat: any) => {
              data.push({
                familyCode: seat.familyCode,
                lastName: seat.lastName,
                section,
                row: seat.row ? seat.row : '',
                seat: seat.seat,
              });
            });
          });
          data = data
            .filter((elem) => elem.familyCode)
            .sort((a, b) => {
              if (a.familyCode > b.familyCode) return 1;
              if (a.familyCode < b.familyCode) return -1;
              return 0;
            });

          const headers = 'Codigo de familia,Apellido,Seccion,Fila,Asiento';
          const rows = data.map(
            (row) =>
              `${row.familyCode},${row.lastName},${row.section},${row.row},${row.seat}`
          );
          const csvContent = [headers, ...rows].join('\n');
          const blob = new Blob([csvContent], { type });
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = filename;
          a.click();
          window.URL.revokeObjectURL(url);
        }
      },
      {
        onlyOnce: true, // Configurar para escuchar cambios en tiempo real
      }
    );
  }

  fetchFamilies() {
    const seatsRef = ref(this.rtdb, `/families/`);
    // Listener para cambios en la referencia /queue/
    onValue(
      seatsRef,
      (snapshot) => {
        if (snapshot.exists()) {
          const toJSON = snapshot.toJSON() as any;
          //const sanitizeMaptoJSON = sanitizeMap(toJSON);
          this.families.next(toJSON);
        } 
      },
      {
        onlyOnce: false, // Configurar para escuchar cambios en tiempo real
      }
    );
  }

  removeFromQueue() {
    const userStatusDatabaseRef = ref(this.rtdb, `/queue/${this.firstKey}`);

    // Llamada a remove() con manejo de promesas
    remove(userStatusDatabaseRef)
      .then(() => {
      })
      .catch((error) => {
        console.error('Error al eliminar la referencia:', error);
      });
  }

  reservateSeats() {
    const updates = {} as any;
    updates['/families/' + this.familyId + '/availableSeats'] =
      this.availableSeats.value;
    this.selectedSeats.forEach((seat: any) => {
      updates['/seats/' + seat.sectionName + '/' + seat.id + '/familyCode'] =
        this.familyCode;
      updates['/seats/' + seat.sectionName + '/' + seat.id + '/familyId'] =
        this.familyId;
      updates['/seats/' + seat.sectionName + '/' + seat.id + '/lastName'] =
        this.lastName.value;
    });
    this.appService.currentPage.next('thanks');
    return update(ref(this.rtdb), updates);
  }





  selectSeat(seat: Seat | null, sectionName: string) {
    if (this.hasById(this.selectedSeats, seat?.id)) {
      this.removeFromSelectionDetail(sectionName, seat);
      this.deleteById(this.selectedSeats, seat?.id);
      this.availableSeats.next(this.availableSeats.value + 1);
      return false;
    }
    if (
      !this.selectedSeats.has({ id: seat?.id, sectionName }) &&
      this.availableSeats.value > 0
    ) {
      this.selectedSeats.add({ id: seat?.id, sectionName });
      this.addToSelectionDetail(sectionName, seat);
      this.availableSeats.next(this.availableSeats.value - 1);
      return true;
    }
    this.toasterService.showToaster(messageTicketsPerFamily);

    return false;
  }

  selectBox(seat: Seat | null, sectionName: string) {
    if (this.hasById(this.selectedSeats, seat?.id)) {
      this.removeFromSelectionDetail(sectionName, seat);
      this.deleteById(this.selectedSeats, seat?.id);
      this.availableSeats.next(this.availableSeats.value + 4);
      return false;
    }
    if (
      !this.selectedSeats.has({ id: seat?.id, sectionName }) &&
      this.availableSeats.value > 3
    ) {
      this.selectedSeats.add({ id: seat?.id, sectionName });
      this.addToSelectionDetail(sectionName, seat);

      this.availableSeats.next(this.availableSeats.value - 4);
      return true;
    }
    this.toasterService.showToaster(messageTicketsPerFamily);
    return false;
  }

  hasById(set: any, id: any) {
    for (let item of set) {
      if (item.id === id) {
        return true;
      }
    }
    return false;
  }

  deleteById(set: any, id: any) {
    for (let item of set) {
      if (item.id === id) {
        set.delete(item);
        return true;
      }
    }
    return false;
  }


  /*openPreventa() {
    const userStatusDatabaseRef = ref(this.rtdb, `/seats/`);

    update(userStatusDatabaseRef, stagePreventa).then(() => {
      console.log(
        'Actualización en base de datos completada, configurando onDisconnect...'
      );
    });
  }*/


}
