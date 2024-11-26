import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';

import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

import { CoreConfigService } from '@core/services/config.service';
import { IUserProfile } from 'app/shared/interfaces/user-profile.interface';
import { LoadMessageService } from 'app/shared/services/load-message.service';
import { Router } from '@angular/router';
import { AuthenticationService } from 'app/auth/service';

@Component({
  selector: 'app-auth-register',
  templateUrl: './auth-register.component.html',
  styleUrls: ['./auth-register.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class AuthRegisterComponent implements OnInit {
  public coreConfig: any;
  public passwordTextType: boolean;
  public registerForm: UntypedFormGroup;
  public submitted = false;

  private _unsubscribeAll: Subject<any>;

  constructor(
    private _coreConfigService: CoreConfigService, 
    private _formBuilder: UntypedFormBuilder,
    private _authService: AuthenticationService,
    private _loadMsgService: LoadMessageService,
    private _router: Router
  ) {
    this._unsubscribeAll = new Subject();

    // Configure the layout
    this._coreConfigService.config = {
      layout: {
        navbar: {
          hidden: true
        },
        menu: {
          hidden: true
        },
        footer: {
          hidden: true
        },
        customizer: false,
        enableLocalStorage: false
      }
    };
  }

  get f() {
    return this.registerForm.controls;
  }

  ngOnInit(): void {
    this.registerForm = this._formBuilder.group({
      names: ['', Validators.required],
      father_last_name: ['', Validators.required],
      mother_last_name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      username: ['', Validators.required],
      num_document: ['', Validators.required],
      telephone: ['', Validators.required]
    });

    this.registerForm.get('email')?.valueChanges.subscribe(value => {
      this.registerForm.get('username')?.setValue(value, { emitEvent: false });
    });

    this._coreConfigService.config.pipe(takeUntil(this._unsubscribeAll)).subscribe(config => {
      this.coreConfig = config;
    });
  }

  ngOnDestroy(): void {
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }

  togglePasswordTextType() {
    this.passwordTextType = !this.passwordTextType;
  }

  onSubmit() {
    this.submitted = true;

    if (this.registerForm.invalid) {
      return;
    }

    const rawRegister = this.registerForm.getRawValue();
    let payloadRegister: IUserProfile = {
      first_name: rawRegister.names,
      last_name: `${rawRegister.father_last_name} ${rawRegister.mother_last_name}`,
      email: rawRegister.email,
      groups: [2],
      is_active: true,
      username: rawRegister.username,
      profile: {
        address: '',
        birthday: '',
        names: rawRegister.names,
        father_last_name: rawRegister.father_last_name,
        mother_last_name: rawRegister.mother_last_name,
        country: null,
        type_document: 1,
        num_document: rawRegister.num_document,
        telephone: rawRegister.telephone
      }
    };
    this.onAddNewUser(payloadRegister);
  }

  onAddNewUser(body: IUserProfile) {
    this._loadMsgService.showLoadingMsg('Registrando agricultor');
    this._authService.registerNewFarmer(body)
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe({
        next: (resp) => {
          this._loadMsgService.showToastMsgSuccess(
            'Se registró el usuario correctamente',
            'Buen trabajo!'
          );
          this.registerForm.reset();
          this._router.navigate(['/pages/authentication/confirm'])
          this._loadMsgService.hideLoadingMsg();
        },
        error: () => {
          this._loadMsgService.showToastMsgError(
            'No se pudo registrar el usuario',
            'Ocurrio un error!'
          );
          this._loadMsgService.hideLoadingMsg();
        }
      });
  }
}
