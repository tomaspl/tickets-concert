import { Component, OnInit } from '@angular/core';
import { FamilyService } from '../../shared/family.service';
import { AppService } from '../../shared/app.service';

@Component({
  selector: 'waiting-room-page',
  standalone: true,
  imports: [],
  templateUrl: './waiting-room-page.component.html',
  styleUrl: './waiting-room-page.component.css',
})
export class WaitingRoomPageComponent implements OnInit {
  public amountOfPeople = 0;
  constructor(private familyService: FamilyService, private appService: AppService) {}
  ngOnInit() {
    this.familyService.peopleBeforeMe$.subscribe((response) => {
      this.amountOfPeople = response;
    });

    this.familyService.ticketStage$.subscribe((response) => {
      if (response) {
        this.appService.changePage('stage');
      }
    });

    this.putFamilyInQueue();
  }

  async checkFamilyAtQueue() {
    const isAtQueue = await this.familyService.familyOnQueue(
      this.familyService.familyId
    );
    return isAtQueue;
  }

  async putFamilyInQueue() {
    const wasOnQueue = await this.checkFamilyAtQueue();
    if (!wasOnQueue) {
      this.familyService.registerFamily();
      this.familyService.detectChangeOnQueue();
    } else {
      this.appService.setError(
        'Esta familia ya se encuentra en la cola de espera en otra sesión'
      );
      this.appService.changePage('error');
    }
  }
}
