import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReservaPreviewDialogComponent } from './reserva-preview-dialog.component';

describe('ReservaPreviewDialogComponent', () => {
  let component: ReservaPreviewDialogComponent;
  let fixture: ComponentFixture<ReservaPreviewDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReservaPreviewDialogComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ReservaPreviewDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
