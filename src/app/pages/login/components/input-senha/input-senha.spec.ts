import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InputSenha } from './input-senha';

describe('InputSenha', () => {
  let component: InputSenha;
  let fixture: ComponentFixture<InputSenha>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InputSenha]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InputSenha);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
