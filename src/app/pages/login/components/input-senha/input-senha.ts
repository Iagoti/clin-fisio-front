import { Component, Input, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-input-senha',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
  ],
  templateUrl: './input-senha.html',
  styleUrl: './input-senha.scss',
})
export class InputSenha {
  @Input({ required: true }) parentFormGroup!: FormGroup;
  @Input() controlName = 'password';
  @Input() label = 'Senha';

  hide = signal(true);

  toggle() {
    this.hide.update(v => !v);
  }
}
