import { ComponentFixture, TestBed } from '@angular/core/testing';
import { InputNmUsuario } from './input-nm-usuario';

describe('InputNmUsuario', () => {
  let component: InputNmUsuario;
  let fixture: ComponentFixture<InputNmUsuario>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InputNmUsuario]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InputNmUsuario);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
