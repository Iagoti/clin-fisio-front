import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { Observable, of } from 'rxjs';
import { catchError, delay, startWith } from 'rxjs/operators';
import { InputNmUsuario } from './components/input-nm-usuario/input-nm-usuario';
import { TableUsuario } from './components/table-usuario/table-usuario';
import { SHARED_INPUT_IMPORTS } from '../../shared/input-modules';
import { UsuarioResponse } from '../../models/usuario/UsuarioResponse';
import { UsuarioService } from '../../core/usuario/usuario.service';

@Component({
  selector: 'app-usuarios',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatIconModule,
    InputNmUsuario,
    TableUsuario,
    SHARED_INPUT_IMPORTS,
  ],
  templateUrl: './usuarios.html',
  styleUrl: './usuarios.scss',
})
export class UsuariosComponent {
  form: FormGroup;
  usuarios: Observable<UsuarioResponse[]>;

  constructor(
    private fb: FormBuilder,
    private usuarioService: UsuarioService
  ) {
    this.form = this.fb.group({
      credentials: this.fb.group({
        nmUsuario: ['', [Validators.required]],
      }),
    });
   
    this.usuarios = this.usuarioService.listar().pipe(
      catchError(() => of([])),
      delay(0),
      startWith([])
    );
  }

  get credentialsGroup(): FormGroup {
    return this.form.get('credentials') as FormGroup;
  }
}
