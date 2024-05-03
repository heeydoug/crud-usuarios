import {Component, Inject} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {UsersService} from "../../../services/users.service";
import {User} from "../../../interfaces/user";
import {MatSnackBar} from "@angular/material/snack-bar";

@Component({
  selector: 'app-modal-form-user',
  templateUrl: './modal-form-user.component.html',
  styleUrl: './modal-form-user.component.scss'
})
export class ModalFormUserComponent {

  listPlanosSaude = [
    {
      id: 1,
      descricao: 'Plano 300 Enfermaria'
    },
    {
      id: 2,
      descricao: 'Plano 400 Enfermaria'
    },
    {
      id: 3,
      descricao: 'Plano 500 Plus'
    },
  ]

  listPlanosOdonto = [
    {
      id: 1,
      descricao: 'Plano Basic'
    },
    {
      id: 2,
      descricao: 'Plano Medium'
    },
    {
      id: 3,
      descricao: 'Plano Plus'
    },
  ]

  formUser: FormGroup;
  editUser: boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<ModalFormUserComponent>,
    private userService: UsersService,
    private _snackBar: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {}

  ngOnInit(){
    this.buildForm();
    if(this.data && this.data.name){
      this.editUser = true;
    }

  }

  saveUser() {
    const objUserForm: User = this.formUser.getRawValue();

    if(this.data && this.data.name){
      this.editUser = true;
      this.userService.updateUser(this.data.firebaseId, objUserForm).then(() => {
        this.closeModal();
        this.openSnackBar('Usuário editado com sucesso!', '')
      })
      .catch(
        err => {
          this.openSnackBar('Erro!', '')
          console.error(err);
        }
      );

    }else{
      this.userService.addUser(objUserForm).then(() => {
        this.closeModal();
        this.openSnackBar('Usuário criado com sucesso!', '')
      })
        .catch(
          err => {
            this.openSnackBar('Erro!', '')
            console.error(err);
          }
        );
    }
  }

  buildForm(){
    this.formUser = this.formBuilder.group({
      name: [null, [Validators.required, Validators.minLength(3)]],
      email: [null, [Validators.required, Validators.email]],
      sector: [null, [Validators.required, Validators.minLength(2)]],
      role: [null, [Validators.required, Validators.minLength(3)]],
      healthPlan: [''],
      dentalPlan: [''],
    })
    if(this.data && this.data.name){
      this.fillForm();
    }
  }

  fillForm(){
    this.formUser.patchValue({
      name: this.data.name,
      email: this.data.email,
      sector: this.data.sector,
      role: this.data.role,
      healthPlan: this.data.healthPlan,
      dentalPlan: this.data.dentalPlan,
    });
  }

  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action);
  }

  closeModal(){
    this.dialogRef.close();
  }

}
