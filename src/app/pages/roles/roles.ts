import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { RoleService } from '../../core/role/role.service';
import { RoleResponse } from '../../models/role/RoleResponse';
import { AtivoInativoEnum } from '../../models/enums/ativo-inativo.enum';

@Component({
  selector: 'app-roles',
  standalone: true,
  imports: [CommonModule, RouterModule, MatIconModule, MatButtonModule, MatTableModule],
  templateUrl: './roles.html',
  styleUrl: './roles.scss',
})
export class RolesComponent {
  readonly statusAtivo = AtivoInativoEnum.ATIVO;

  private roleService = inject(RoleService);
  private router = inject(Router);

  dataSource = new MatTableDataSource<RoleResponse>([]);
  displayedColumns: string[] = ['nmRole', 'dsRole', 'stRole', 'flSistema', 'qtdPermissoes'];

  constructor() {
    this.carregar();
  }

  private carregar(): void {
    this.roleService
      .listar()
      .pipe(catchError(() => of([])))
      .subscribe((roles) => {
        this.dataSource.data = roles ?? [];
      });
  }

  onRowClick(row: RoleResponse): void {
    if (row.cdRole != null) {
      this.router.navigate(['/dashboard/roles', row.cdRole]);
    }
  }
}
