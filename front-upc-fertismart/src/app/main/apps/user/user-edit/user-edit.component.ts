import { Component, OnInit, OnDestroy, ViewEncapsulation, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';

import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { FlatpickrOptions } from 'ng2-flatpickr';
import { cloneDeep } from 'lodash';

import { UserEditService } from 'app/main/apps/user/user-edit/user-edit.service';
import { UserSharedService } from '../user-shared.service';
import { SharedService } from 'app/shared/services/shared-data.service';
import Spain from 'flatpickr/dist/l10n/es.js';
import { DatePipe } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { LoadMessageService } from 'app/shared/services/load-message.service';
import { User } from 'app/auth/models';
import { AuthenticationService } from 'app/auth/service';

@Component({
  selector: 'app-user-edit',
  templateUrl: './user-edit.component.html',
  styleUrls: ['./user-edit.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class UserEditComponent implements OnInit, OnDestroy {
  public editForm: FormGroup;
  public url = this.router.url;
  public urlLastValue;
  public currentUser;
  public tempRow;
  public avatarImage: string;
  public userGroupsList: any;
  public typeDocList: any;
  public countryList: any;
  public userSession: User;
  public validateUserSession: boolean;

  @ViewChild('accountForm') accountForm: NgForm;

  public birthDateOptions: FlatpickrOptions = {
    altInput: true,
    locale: Spain.es
  };

  private _unsubscribeAll: Subject<any>;
  private parameters = {parameters: ['FS_TIP_DOC', 'FS_PAI_AUT']};

  constructor(
    private router: Router, 
    private _userEditService: UserEditService,
    private _formBuilder: FormBuilder,
    private _userSharedService: UserSharedService,
    private _sharedService: SharedService,
    private _datePipe: DatePipe,
    private _loadMsgService: LoadMessageService,
    private _authenticationService: AuthenticationService
  ) {
    this._authenticationService.currentUser.subscribe(x => (this.userSession = x));
    this._unsubscribeAll = new Subject();
    this.urlLastValue = this.url.substr(this.url.lastIndexOf('/') + 1);

    this.onGetParameters(this.parameters);

    this._userSharedService.onUserGroupsChanged.pipe(
      takeUntil(this._unsubscribeAll)).subscribe(response => {
      this.userGroupsList = response;
    });
  }

  ngOnDestroy(): void {
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }

  resetFormWithDefaultValues() {
    this.accountForm.resetForm(this.tempRow);
  }

  uploadImage(event: any) {
    if (event.target.files && event.target.files[0]) {
      let reader = new FileReader();

      reader.onload = (event: any) => {
        this.avatarImage = event.target.result;
      };

      reader.readAsDataURL(event.target.files[0]);
    }
  }

  onSubmitEdit() {
    if(this.editForm.invalid) {
      return;
    }

    let bdEditUser = this.editForm.getRawValue();
    let arrGroup = [];
    arrGroup.push(+(bdEditUser.groups));
    bdEditUser.groups = arrGroup;
    let userBirt = bdEditUser.profile.birthday;
    bdEditUser.profile.birthday = `${userBirt.year}-${userBirt.month}-${userBirt.day}`;
    bdEditUser.first_name = bdEditUser.profile.names.split(' ')[0];
    bdEditUser.last_name = bdEditUser.profile.father_last_name;
    
    this.onEditUser(bdEditUser);
  }

  onEditUser(body) {
    this._userEditService.editUser(body, this.currentUser.id)
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe({
        next: (resp) => {
          this._loadMsgService.showToastMsgSuccess(
            'Se editó el usuario correctamente',
            'Buen trabajo!'
          );
          this.router.navigateByUrl('apps/user/user-list');
          this._loadMsgService.hideLoadingMsg();
        }
      })
  }

  ngOnInit(): void {
    this._userEditService.onUserEditChanged
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe(response => {
        this.currentUser = response;
        if (this.currentUser.id == this.urlLastValue) {
          this.tempRow = cloneDeep(response);
        }
        this.validateUserSession = (this.userSession.id === this.currentUser.id)
    });

    this.editForm = this._formBuilder.group(
      {
        first_name: [this.currentUser.first_name],
        last_name: [this.currentUser.last_name],
        email: [this.currentUser.email, [Validators.required, Validators.email]],
        groups: [this.currentUser.groups[0], Validators.required],
        is_active: [this.currentUser.is_active, Validators.required],
        username: [this.currentUser.username, Validators.required],
        profile: this._formBuilder.group(
          {
            address: [this.currentUser.profile.address],
            birthday: [this.currentUser.profile.birthday],
            names: [this.currentUser.profile.names, Validators.required],
            father_last_name: [this.currentUser.profile.father_last_name, Validators.required],
            mother_last_name: [this.currentUser.profile.mother_last_name, Validators.required],
            country: [this.currentUser.profile.country, Validators.required],
            type_document: [this.currentUser.profile.type_document, Validators.required],
            num_document: [this.currentUser.profile.num_document, Validators.required],
            telephone: [this.currentUser.profile.telephone, Validators.required]
          }
        )
      }
    );

    const iniYear =  Number(this._datePipe.transform(this.currentUser.profile.birthday, 'yyyy'));
    const iniMonth =  Number(this._datePipe.transform(this.currentUser.profile.birthday, 'MM'));
    const iniDay =  Number(this._datePipe.transform(this.currentUser.profile.birthday, 'dd'));
    this.editForm.controls['profile']['controls'].birthday.setValue({
      year: iniYear ,
      month: iniMonth ,
      day: iniDay
    });
  }

  errorHandlingForm (control: string, groupForm?: string) {
    let validateError: boolean;
    if (groupForm){
      validateError = this.editForm.controls[groupForm]['controls'][control].errors && 
        this.editForm.controls[groupForm]['controls'][control].touched;
    } else {
      validateError = this.editForm.controls[control].errors && 
        this.editForm.controls[control].touched;
    }
    return validateError;
  }

  errorHandlingFormValidator (control: string, validator: string, groupForm?: string) {
    let validateError: boolean;
    if (groupForm){
      validateError = this.editForm.controls[groupForm]['controls'][control].hasError(validator) && 
        this.editForm.controls[groupForm]['controls'][control].touched;
    } else {
      validateError = this.editForm.controls[control].hasError(validator) && 
        this.editForm.controls[control].touched;
    }
    return validateError
  }

  onGetParameters(body){
    this._sharedService.getParameters(body)
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe({
        next: (resp) => {
          this.typeDocList = resp.data[0]['FS_TIP_DOC'];
          this.countryList = resp.data[0]['FS_PAI_AUT'];
        }
    })
  }

  onActivateUser(userId) {
    this._userSharedService.activateUser({user: userId})
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe(resp => {
        this._loadMsgService.showToastMsgSuccess(
          'Se activó el usuario correctamente',
          'Buen trabajo!',
        );
        this._userEditService.getDetailUser(userId);
        this._loadMsgService.hideLoadingMsg();
      });;
  }

  onDeactivateUser(userId) {
    this._userSharedService.deactivateUser({user: userId})
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe(resp => {
        this._loadMsgService.showToastMsgSuccess(
          'Se desactivó el usuario correctamente',
          'Buen trabajo!',
        );
        this._userEditService.getDetailUser(userId);
        this._loadMsgService.hideLoadingMsg();
      });
  }

  onResetPasswordUser(userId) {
    this._userSharedService.resetPasswordUser({user: userId})
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe(resp => {
        this._loadMsgService.showToastMsgSuccess(
          'Se reseteo el password correctamente',
          'Buen trabajo!',
        );
        this._loadMsgService.hideLoadingMsg();
      });
  }
}
