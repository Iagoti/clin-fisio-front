import { Component, Input, signal } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { SHARED_INPUT_IMPORTS } from '../../../../shared/input-modules';

@Component({
  selector: 'app-input-senha',
  imports: [...SHARED_INPUT_IMPORTS, MatButtonModule],
  templateUrl: './input-senha.html',
  styleUrl: './input-senha.scss',
})
export class InputSenha {
  @Input({ required: true }) parentFormGroup!: FormGroup;
  @Input() controlName = 'senha';
  @Input() label = 'Senha';

  hide = signal(true);

  toggle() {
    this.hide.update(v => !v);
  }
}
