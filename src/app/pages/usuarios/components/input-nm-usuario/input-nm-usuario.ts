import { Component, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { SHARED_INPUT_IMPORTS } from '../../../../shared/input-modules';

@Component({
  selector: 'app-input-nm-usuario',
  standalone: true,
  imports: [...SHARED_INPUT_IMPORTS],
  templateUrl: './input-nm-usuario.html',
  styleUrl: './input-nm-usuario.scss',
})
export class InputNmUsuario {
  @Input({ required: true }) parentFormGroup!: FormGroup;
  @Input() controlName = 'nmUsuario';
  @Input() label = 'Nome do usuário';
}
