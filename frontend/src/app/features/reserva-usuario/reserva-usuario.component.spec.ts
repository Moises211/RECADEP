import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReservaUsuarioComponent } from './reserva-usuario.component';

describe('ReservaUsuarioComponent', () => {
  let component: ReservaUsuarioComponent;
  let fixture: ComponentFixture<ReservaUsuarioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReservaUsuarioComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ReservaUsuarioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
