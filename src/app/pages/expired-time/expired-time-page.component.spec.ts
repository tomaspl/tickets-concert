import { ComponentFixture, TestBed } from '@angular/core/testing'

import { ExpiredTimeComponent } from './expired-time-page.component'

describe('ExpiredTimeComponent', () => {
  let component: ExpiredTimeComponent
  let fixture: ComponentFixture<ExpiredTimeComponent>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExpiredTimeComponent],
    }).compileComponents()

    fixture = TestBed.createComponent(ExpiredTimeComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
