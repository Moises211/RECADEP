import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReservaConfirmDialogComponent } from './reserva-confirm-dialog.component';

describe('ReservaConfirmDialogComponent', () => {
  let component: ReservaConfirmDialogComponent;
  let fixture: ComponentFixture<ReservaConfirmDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReservaConfirmDialogComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ReservaConfirmDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
