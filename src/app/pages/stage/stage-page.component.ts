import {
  AfterViewChecked,
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
} from '@angular/core';
import { SectionStage } from '../../model/SectionStage';
import { FamilyService } from '../../shared/family.service';
import { CommonModule } from '@angular/common';
import { SectionComponent } from '../../theater/section/section.component';
import { Reservation } from '../../model/Reservation';
import { interval, Subscription, Observable } from 'rxjs';
import { takeWhile, map } from 'rxjs/operators';
import { ToasterComponent } from '../../shared/components/toaster.component';
import { MapComponent } from '../../theater/map/map.component';
import { AppService } from '../../shared/app.service';

@Component({
  selector: 'stage-page',
  standalone: true,
  imports: [SectionComponent, CommonModule, ToasterComponent, MapComponent],
  templateUrl: './stage-page.component.html',
  styleUrl: './stage-page.component.css',
})
export class StagePageComponent implements OnInit {
  public showStage = false;
  public showWaitingRoom = true;
  public mapStage: SectionStage[] = [];
  public thanksPage = false;
  public loading = true;
  public showDetails = false;
  public availableSeats!: number;
  public reservedSeats!: number;
  public details$: Observable<Reservation[] | null>;

  public timeRemaining!: number;
  public countdownSubscription!: Subscription;
  public countdownActive = false;
  public formattedTime!: string;
  private queueUnsubscribe: any;

  constructor(
    private familyService: FamilyService,
    private appService: AppService,
  ) {
    this.familyService.stageMap$.subscribe((response) => {
      if (response) {
        this.mapStage = response;
      }
    });

    this.familyService.availableSeats$.subscribe((response) => {
      this.availableSeats = response;
      this.reservedSeats =
        this.familyService.seatsPerFamily - response > 0
          ? this.familyService.seatsPerFamily - response
          : (this.familyService.seatsPerFamily - response) * -1 +
            this.familyService.seatsPerFamily;
      // se reservan 7
      // (6 - 7) = se reservaron 2
    });
    this.details$ = this.familyService.details$;
  }

  ngOnInit() {
    this.startCountdown();
    this.queueUnsubscribe = this.familyService.watchQueueEntry((snap: any) => {
      if (!snap.exists()) {
        // Fui expulsado en el servidor
        this.stopCountdown();
        this.appService.changePage('expired-time');
        return;
      }
      const val = snap.val();
      const onStageAt = val.onStageAt || val.enteredAt;
      if (onStageAt) {
        this.recalculateFromServer(onStageAt);
      }
    });
    this.appService.theatreIsOpen$.subscribe((response) => {
      if (response === false) {
        this.stopCountdown();
      }
    });
    document.addEventListener('visibilitychange', this.handleVisibilityChange);
  }

  handleVisibilityChange = () => {
    if (!document.hidden) {
      // re-sincronizar
      this.familyService.getQueueOnStageAt().then((onStageAt) => {
        if (onStageAt) this.recalculateFromServer(onStageAt);
      });
    }
  };

  // Inicia el temporizador
  startCountdown() {
    this.countdownActive = true;
    // Intentar leer onStageAt desde la base de datos; fallback a enteredAt
    Promise.all([
      this.familyService.getQueueOnStageAt(),
      this.familyService.getQueueEnteredAt(),
    ]).then(([onStageAt, enteredAt]) => {
      const now = Math.floor(Date.now());
      const totalAllowed = 2 * 60 * 1000; // 2 minutos en ms
      let base = onStageAt || enteredAt;
      if (base) {
        const elapsed = now - base;
        const remainingMs = Math.max(0, totalAllowed - elapsed);
        this.timeRemaining = Math.ceil(remainingMs / 1000);
      } else {
        this.timeRemaining = 122; // Fallback por si no hay timestamps
      }
      this.updateFormattedTime(); // Actualiza el tiempo formateado inicialmente

      // Configura el observable que cuenta hacia atrás usando tiempo del servidor
      this.countdownSubscription = interval(1000)
        .pipe(takeWhile(() => this.timeRemaining > 0))
        .subscribe(() => {
          // recalcular cada tick con server time
          const serverNow = this.familyService.getServerNow();
          const totalAllowed = 2 * 60 * 1000;
          const base = onStageAt || enteredAt || null;
          if (base) {
            const remainingMs = Math.max(0, totalAllowed - (serverNow - base));
            this.timeRemaining = Math.ceil(remainingMs / 1000);
            this.updateFormattedTime();
            if (this.timeRemaining === 0) this.onCountdownFinished();
          }
        });
    });
  }

  recalculateFromServer(baseTs: number) {
    const now = this.familyService.getServerNow();
    const totalAllowed = 2 * 60 * 1000;
    const remainingMs = Math.max(0, totalAllowed - (now - baseTs));
    this.timeRemaining = Math.ceil(remainingMs / 1000);
    this.updateFormattedTime();
    if (this.timeRemaining === 0) this.onCountdownFinished();
  }

  // Actualiza el tiempo formateado como mm:ss
  updateFormattedTime() {
    const minutes = Math.floor(this.timeRemaining / 60);
    const seconds = this.timeRemaining % 60;
    this.formattedTime = `${this.padZero(minutes)}:${this.padZero(seconds)}`;
  }

  // Asegura que los minutos y segundos tengan 2 dígitos
  padZero(num: number): string {
    return num < 10 ? '0' + num : num.toString();
  }

  // Acción que se dispara cuando el temporizador llega a 0
  onCountdownFinished() {
  // Solo cambiar de página, la expulsión la maneja el backend
  this.countdownActive = false; // Reinicia el estado del temporizador
  this.appService.changePage('expired-time');
  }

  async reserveSeats() {
    try {
      await this.familyService.reservateSeats();
      this.familyService.removeFromQueue();
    } catch (e) {
    }
  }

  toggleDetails() {
    if (this.reservedSeats > 0) {
      this.showDetails = !this.showDetails;
    }
  }
  ngOnDestroy() {
    if (this.countdownSubscription) this.countdownSubscription.unsubscribe();
    if (this.queueUnsubscribe) this.queueUnsubscribe();
    document.removeEventListener('visibilitychange', this.handleVisibilityChange);
  }

  stopCountdown() {
    if (this.countdownSubscription) {
      this.countdownSubscription.unsubscribe();
    }
    this.countdownActive = false;
  }
}
