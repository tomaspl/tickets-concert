import { Component } from '@angular/core';
import { FamilyService } from '../../shared/family.service';
import { Observable } from 'rxjs';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'welcome-page',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './welcome-page.component.html',
  styleUrl: './welcome-page.component.css',
})
export class WelcomePageComponent {
  lastName!: string;
  availableSeats$!: Observable<number>;
  constructor(private familyService: FamilyService) {}
  ngOnInit() {
    this.familyService.lastName$.subscribe((response) => {
      this.lastName = response;
    });

    this.availableSeats$ = this.familyService.availableSeats$;
  }
  goToWaitingRoom() {
    this.familyService.changePage('waiting');
  }
}
