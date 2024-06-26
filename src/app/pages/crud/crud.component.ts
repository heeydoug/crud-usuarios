import {Component, Inject, ViewChild} from '@angular/core';
import {UsersService} from "../../services/users.service";
import {MatPaginator} from "@angular/material/paginator";
import {MatSort} from "@angular/material/sort";
import {User} from "../../interfaces/user";
import {MatTableDataSource} from "@angular/material/table";
import {MAT_DIALOG_DATA, MatDialog} from "@angular/material/dialog";
import {ModalViewUserComponent} from "./modal-view-user/modal-view-user.component";
import {ModalFormUserComponent} from "./modal-form-user/modal-form-user.component";
import {MatSnackBar} from "@angular/material/snack-bar";

@Component({
  selector: 'app-crud',
  templateUrl: './crud.component.html',
  styleUrl: './crud.component.scss'
})
export class CrudComponent {
  displayedColumns: string[] = ['id', 'name', 'email', 'role', 'benefits', 'action'];
  dataSource: any;
  listUsers: User[] = [];

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(
    private usersService: UsersService,
    public dialog: MatDialog,
    private _snackBar: MatSnackBar
  ) {
    this.dataSource = new MatTableDataSource<any>(this.listUsers);
  }

  ngOnInit(){
    this.getListUsers();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  getListUsers(){
    this.usersService.getAllUsers().subscribe({
      next: (response: any) => {
        this.listUsers = response;
        this.dataSource = new MatTableDataSource<any>(this.listUsers);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.paginator._intl.itemsPerPageLabel="Itens por página";
      },
      error: (error: any) => {
        console.log(error)
      }
    })
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  openModalViewUser(user: User) {
    this.dialog.open(ModalViewUserComponent, {
      width: '700px',
      height: '330px',
      data: user
    })
  }

  openModalAddUser() {
    this.dialog.open(ModalFormUserComponent, {
      width: '700px',
      height: '400px',
    }).afterClosed().subscribe(() => this.getListUsers());
  }

  openModalEditUser(user: User) {
    this.dialog.open(ModalFormUserComponent, {
      width: '700px',
      height: '400px',
      data: user,
    }).afterClosed().subscribe(() => this.getListUsers());
  }

  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action);
  }

  deleteUser(firebaseId: string){
    this.usersService.deleteUser(firebaseId).then(() => {
      this.openSnackBar('Usuário excluído com sucesso!', '')
    })
    .catch(
    err => {
      this.openSnackBar('Erro!', '')
      console.error(err);
    }
  );
  }

}

