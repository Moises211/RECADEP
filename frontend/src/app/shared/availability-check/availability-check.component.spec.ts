import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AvailabilityCheckComponent } from './availability-check.component';

describe('AvailabilityCheckComponent', () => {
  let component: AvailabilityCheckComponent;
  let fixture: ComponentFixture<AvailabilityCheckComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AvailabilityCheckComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AvailabilityCheckComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
