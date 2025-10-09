import { ComponentFixture, TestBed } from '@angular/core/testing'
import { ReservationPageComponent } from './reservation.component'

describe('ThanksComponent', () => {
  let component: ReservationPageComponent
  let fixture: ComponentFixture<ReservationPageComponent>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReservationPageComponent],
    }).compileComponents()

    fixture = TestBed.createComponent(ReservationPageComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
