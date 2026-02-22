import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { InputNmUsuario } from './components/input-nm-usuario/input-nm-usuario';
import { SHARED_INPUT_IMPORTS } from '../../shared/input-modules';

@Component({
  selector: 'app-usuarios',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatIconModule, InputNmUsuario, SHARED_INPUT_IMPORTS],
  templateUrl: './usuarios.html',
  styleUrl: './usuarios.scss',
})
export class UsuariosComponent {
  form: FormGroup;

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      credentials: this.fb.group({
        nmUsuario: ['', [Validators.required]],
      }),
    });
  }

  get credentialsGroup(): FormGroup {
    return this.form.get('credentials') as FormGroup;
  }
}
