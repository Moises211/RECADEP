import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReservaEditDialogComponent } from './reserva-edit-dialog.component';

describe('ReservaEditDialogComponent', () => {
  let component: ReservaEditDialogComponent;
  let fixture: ComponentFixture<ReservaEditDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReservaEditDialogComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ReservaEditDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
