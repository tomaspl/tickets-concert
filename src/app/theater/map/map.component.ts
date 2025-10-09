import { Component } from '@angular/core'
import { SectionComponent } from '../section/section.component'
import { FamilyService } from '../../shared/family.service'
import { SectionStage } from '../../model/SectionStage'

@Component({
  selector: 'app-map',
  standalone: true,
  imports: [SectionComponent],
  templateUrl: './map.component.html',
  styleUrl: './map.component.css',
})
export class MapComponent {
  public mapStage: SectionStage[] = []

  constructor(private familyService: FamilyService) {
    this.familyService.stageMap$.subscribe((response) => {
      if (response) {
        this.mapStage = response
      }
    })
  }
}
