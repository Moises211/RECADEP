import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReservaValidacionFormComponent } from './reserva-validacion-form.component';

describe('ReservaValidacionFormComponent', () => {
  let component: ReservaValidacionFormComponent;
  let fixture: ComponentFixture<ReservaValidacionFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReservaValidacionFormComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ReservaValidacionFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
