import { Component } from '@angular/core';
import { FamilyService } from '../../shared/family.service';

@Component({
  selector: 'error-page',
  standalone: true,
  imports: [],
  templateUrl: './error-page.component.html',
  styleUrl: './error-page.component.css',
})
export class ErrorPageComponent {
  error!: string;
  currentColor = 'red';
  constructor(private familyService: FamilyService) {}
  ngOnInit() {
    this.error = this.familyService.error;
  }
}
