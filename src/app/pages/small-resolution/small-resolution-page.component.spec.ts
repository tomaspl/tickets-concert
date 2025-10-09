import { ComponentFixture, TestBed } from '@angular/core/testing'

import { SmallResolutionPageComponent } from './small-resolution-page.component'

describe('SmallResolutionPageComponent', () => {
  let component: SmallResolutionPageComponent
  let fixture: ComponentFixture<SmallResolutionPageComponent>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SmallResolutionPageComponent],
    }).compileComponents()

    fixture = TestBed.createComponent(SmallResolutionPageComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
