import { Component, OnInit } from '@angular/core';
import { FamilyService } from '../shared/family.service';
import { Family } from '../model/Family';
import { sanitizeFamily } from '../utils/map';
import { environment } from '../../environments/environment';
import { filter, take } from 'rxjs/operators';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';
import { MapComponent } from '../theater/map/map.component';
import { preventaAvailable } from '../constants';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [FormsModule, CommonModule, MapComponent],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.css',
})
export class AdminComponent implements OnInit {
  families: Family[] = [];
  familiesSearch: Family[] = [];
  url: string;
  isChecked: boolean | null = null;
  showMap = false;
  public available$!: Observable<boolean | null>;
  preventa = preventaAvailable;
  constructor(private familyService: FamilyService) {
    this.url = environment.url;
    this.familyService.fetchStageMap();
  } // Inyección de dependencias en el constructor

  async toggleChange() {
    await this.familyService.changeAvailability();
    //this.isChecked = !this.isChecked;
  }

  toggleMap() {
    this.showMap = !this.showMap;
  }

  ngOnInit(): void {
    this.familyService.syncAvailability();
    this.familyService.fetchFamilies();
    this.familyService.available$.subscribe((response) => {
      console.log('response', response);
      if (response !== null) {
        this.isChecked = !!response;
      }
    });
    this.familyService.families$
      .pipe(
        filter((response) => Object.keys(response).length > 0), // Ignorar arrays vacíos
        take(1) // Tomar solo la primera emisión con datos
      )
      .subscribe((response) => {
        const families = sanitizeFamily(response);
        this.families = families;
        this.familiesSearch = families;
      });
  }
  get orderedFamilies() {
    return this.familiesSearch.sort((a, b) => {
      return a.preventa === b.preventa ? 0 : a.preventa ? -1 : 1;
    });
  }
  keyUpHandler($event: any) {
    const word = $event?.target.value.toUpperCase();
    this.familiesSearch = this.families.filter(
      (fam) => fam.lastName.indexOf(word) > -1
    );
  }

  resetApp() {
    this.familyService.resetApp();
  }

  downloadReport() {
    this.familyService.downloadReport('reporte.csv', 'text/plain');
  }

  copyUrl(url: string, family: HTMLElement) {
    //this.animate = true;
    family.classList.add('animate-bg');

    // Después de 2 segundos, volver al color original
    setTimeout(() => {
      family.classList.remove('animate-bg');
    }, 1000); //
    navigator.clipboard
      .writeText(url)
      .then(() => {
        console.log('Texto copiado al portapapeles');
        // Puedes agregar un mensaje para el usuario, como una alerta o un snackbar.
      })
      .catch((err) => {
        console.error('Error al copiar el texto: ', err);
      });
  }

  goTo(url: string) {
    window.open(url);
  }
}
