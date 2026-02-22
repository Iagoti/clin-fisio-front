import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-input-email',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
  ],
  templateUrl: './input-email.html',
  styleUrl: './input-email.scss',
})
export class InputEmail {
  @Input({ required: true }) parentFormGroup!: FormGroup;
  @Input() controlName = 'email';
  @Input() label = 'E-mail';  
}
