import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
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
export class UsuariosComponent implements OnInit {
  form: FormGroup;
  usuarios: UsuarioResponse[] = [];

  constructor(
    private fb: FormBuilder,
    private usuarioService: UsuarioService
  ) {
    this.form = this.fb.group({
      credentials: this.fb.group({
        nmUsuario: ['', [Validators.required]],
      }),
    });
  }

  ngOnInit(): void {
    this.usuarioService.listar().subscribe({
      next: (lista) => setTimeout(() => (this.usuarios = lista), 0),
      error: () => setTimeout(() => (this.usuarios = []), 0),
    });
  }

  get credentialsGroup(): FormGroup {
    return this.form.get('credentials') as FormGroup;
  }
}
