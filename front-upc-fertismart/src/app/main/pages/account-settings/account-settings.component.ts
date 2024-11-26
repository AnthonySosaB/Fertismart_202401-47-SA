import { Component, OnInit, OnDestroy, ViewEncapsulation } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { AccountSettingsService } from 'app/main/pages/account-settings/account-settings.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IUserProfile } from 'app/shared/interfaces/user-profile.interface';
import { AuthenticationService } from 'app/auth/service';
import { LoadMessageService } from 'app/shared/services/load-message.service';

@Component({
  selector: 'app-account-settings',
  templateUrl: './account-settings.component.html',
  styleUrls: ['./account-settings.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class AccountSettingsComponent implements OnInit, OnDestroy {
  public contentHeader: object;
  public data: any;
  public passwordTextTypeOld = false;
  public passwordTextTypeNew = false;
  public passwordTextTypeRetype = false;
  public accountSettingsForm: FormGroup;
  public changePasswordForm: FormGroup;

  private _unsubscribeAll: Subject<any>;

  constructor(
    private _accountSettingsService: AccountSettingsService,
    private _formBuilder: FormBuilder,
    private _loadMsgService: LoadMessageService
  ) {
    this._unsubscribeAll = new Subject();
  }

  togglePasswordTextTypeOld() {
    this.passwordTextTypeOld = !this.passwordTextTypeOld;
  }

  togglePasswordTextTypeNew() {
    this.passwordTextTypeNew = !this.passwordTextTypeNew;
  }

  togglePasswordTextTypeRetype() {
    this.passwordTextTypeRetype = !this.passwordTextTypeRetype;
  }

  ngOnInit() {
    this._accountSettingsService.onSettingsChanged
      .pipe(takeUntil(this._unsubscribeAll)).subscribe(response => {
        this.data = response;
      });

    this.contentHeader = {
      headerTitle: 'Configuración de perfil',
      actionButton: false,
      breadcrumb: {
        type: '',
        links: [
          {
            name: 'Inicio',
            isLink: true,
            link: '/'
          },
          {
            name: 'Perfil',
            isLink: false
          }
        ]
      }
    };

    this.accountSettingsForm = this._formBuilder.group(
      {
        names: [this.data.profile.names, Validators.required],
        father_last_name: [this.data.profile.father_last_name, Validators.required],
        mother_last_name: [this.data.profile.mother_last_name, Validators.required],
        email: [this.data.email, [Validators.required, Validators.email]],
        username: [this.data.username, Validators.required],
        address: [this.data.profile.address],
        num_document: [this.data.profile.num_document, Validators.required],
        telephone: [this.data.profile.telephone, Validators.required]
      }
    );

    this.changePasswordForm = this._formBuilder.group(
      {
        password: ['', Validators.required],
        new_password: ['', Validators.required],
        new_password_confirm: ['', Validators.required]
      }, { validator: this.passwordMatchValidator }
    );
  }

  ngOnDestroy(): void {
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }

  errorHandlingForm (control: string, groupForm?: string) {
    let validateError: boolean;
    if (groupForm){
      validateError = this.changePasswordForm.controls[groupForm]['controls'][control].errors && 
          this.changePasswordForm.controls[groupForm]['controls'][control].touched;
    } else {
      validateError = this.changePasswordForm.controls[control].errors && 
        this.changePasswordForm.controls[control].touched;
    }
    return validateError;
}

  errorHandlingFormValidator (control: string, validator: string, groupForm?: string) {
    let validateError: boolean;
    if (groupForm){
      validateError = this.changePasswordForm.controls[groupForm]['controls'][control].hasError(validator) && 
          this.changePasswordForm.controls[groupForm]['controls'][control].touched;
    } else {
      validateError = this.changePasswordForm.controls[control].hasError(validator) && 
        this.changePasswordForm.controls[control].touched;
    }
    return validateError
  }

  onSubmitAccountSettings() {
    if(this.accountSettingsForm.invalid) {
      return;
    }

    const rawAccountSettings = this.accountSettingsForm.getRawValue();
    let payloadRegister: IUserProfile = {
      first_name: rawAccountSettings.names,
      last_name: `${rawAccountSettings.father_last_name} ${rawAccountSettings.mother_last_name}`,
      email: rawAccountSettings.email,
      username: rawAccountSettings.username,
      profile: {
        names: rawAccountSettings.names,
        father_last_name: rawAccountSettings.father_last_name,
        mother_last_name: rawAccountSettings.mother_last_name,
        num_document: rawAccountSettings.num_document,
        telephone: rawAccountSettings.telephone,
        address: rawAccountSettings.address,
        birthday: this.data.profile.birthday,
        country: this.data.profile.country,
        type_document: this.data.profile.type_document
      },
      groups: this.data.groups,
      is_active: this.data.is_active
    };
    
    this.onAccountSettings(payloadRegister);
  }

  onAccountSettings(body) {
    this._accountSettingsService.editAccountSettings(body, this.data.id)
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe({
        next: (resp) => {
          this._loadMsgService.showToastMsgSuccess(
            'Se editó el perfil correctamente',
            'Buen trabajo!'
          );
          this._loadMsgService.hideLoadingMsg();
        }
      })
  }

  passwordMatchValidator(form: FormGroup) {
    const newPassword = form.get('new_password')?.value;
    const confirmPassword = form.get('new_password_confirm')?.value;
    return newPassword === confirmPassword ? null : { mismatch: true };
  }

  onSubmitChangePassword() {
    if(this.changePasswordForm.invalid) {
      return;
    }

    const rawChangePassword = this.changePasswordForm.getRawValue();
    let payloadPassword: any = {
      username: rawChangePassword.names,
      password: rawChangePassword.password,
      new_password: rawChangePassword.new_password_confirm,
    };
    
    this.onChangePassword(payloadPassword);
  }

  onChangePassword(body) {
    this._accountSettingsService.editAccountSettings(body, this.data.id)
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe({
        next: (resp) => {
          this._loadMsgService.showToastMsgSuccess(
            'Se editó el perfil correctamente',
            'Buen trabajo!'
          );
          this._loadMsgService.hideLoadingMsg();
        }
      })
  }
}
