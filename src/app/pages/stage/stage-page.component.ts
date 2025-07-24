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

  constructor(
    private familyService: FamilyService,
    private cdr: ChangeDetectorRef
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
    this.familyService.available$.subscribe((response) => {
      if (response === false) {
        this.countdownSubscription.unsubscribe();
      }
    });
  }

  // Inicia el temporizador
  startCountdown() {
    this.countdownActive = true;
    this.timeRemaining = 122; // Tiempo en segundos (2 minutos)
    this.updateFormattedTime(); // Actualiza el tiempo formateado inicialmente

    // Configura el observable que cuenta hacia atrás
    this.countdownSubscription = interval(1000)
      .pipe(
        takeWhile(() => this.timeRemaining > 0), // Continuar hasta que el tiempo llegue a 0
        map(() => --this.timeRemaining) // Disminuir el contador en 1 segundo
      )
      .subscribe({
        next: () => {
          this.updateFormattedTime(); // Actualiza el tiempo formateado en cada tick
          if (this.timeRemaining === 0) {
            this.onCountdownFinished(); // Llamar a la acción cuando el temporizador finaliza
          }
        },
      });
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
    // Aquí puedes definir la acción que deseas realizar, por ejemplo:
    this.familyService.removeFromQueue();
    console.log('El temporizador ha finalizado. Acción disparada.');
    this.countdownActive = false; // Reinicia el estado del temporizador
    this.familyService.changePage('expired-time');
  }

  async reserveSeats() {
    //if (this.reservedSeats > 0) {
    try {
      await this.familyService.reservateSeats();
      this.familyService.removeFromQueue();
    } catch (e) {
      console.log('e', e);
    }
    //}
  }

  toggleDetails() {
    if (this.reservedSeats > 0) {
      this.showDetails = !this.showDetails;
    }
  }
  ngOnDestroy() {
    this.countdownSubscription.unsubscribe();
  }
}
