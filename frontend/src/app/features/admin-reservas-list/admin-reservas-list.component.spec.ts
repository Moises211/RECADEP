import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminReservasListComponent } from './admin-reservas-list.component';

describe('AdminReservasListComponent', () => {
  let component: AdminReservasListComponent;
  let fixture: ComponentFixture<AdminReservasListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminReservasListComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AdminReservasListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
