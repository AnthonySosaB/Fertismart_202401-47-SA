import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CoreSidebarService } from '@core/components/core-sidebar/core-sidebar.service';
import { LoadMessageService } from 'app/shared/services/load-message.service';
import { SharedService } from 'app/shared/services/shared-data.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { UserSharedService } from '../../user-shared.service';
import { UserListService } from '../user-list.service';
import { environment } from 'environments/environment';

@Component({
  selector: 'app-new-user-sidebar',
  templateUrl: './new-user-sidebar.component.html'
})
export class NewUserSidebarComponent implements OnInit, OnDestroy {
  public registerForm: FormGroup;
  public submitted = false;
  public userGroupsList: any;
  public typeDocList: any;
  public countryList: any;

  private _unsubscribeAll: Subject<any>;
  private parameters = {parameters: ['FS_TIP_DOC', 'FS_PAI_AUT']};
  
  constructor(
    private _coreSidebarService: CoreSidebarService,
    private _formBuilder: FormBuilder,
    private _userSharedService: UserSharedService,
    private _sharedService: SharedService,
    private _userListService: UserListService,
    private _loadMsgService: LoadMessageService
  ) {
    this._unsubscribeAll = new Subject();
    this.onGetParameters(this.parameters);
  }
    
  ngOnDestroy(): void {
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }

  toggleSidebar(name): void {
    this._coreSidebarService.getSidebarRegistry(name).toggleOpen();
  }

  ngOnInit(): void {
    this.registerForm = this._formBuilder.group(
      {
        first_name: [''],
        last_name: [''],
        email: ['', [Validators.required, Validators.email]],
        groups: ['', Validators.required],
        is_active: [environment.statusNewUsers, Validators.required],
        username: ['', Validators.required],
        profile: this._formBuilder.group(
          {
            address: [''],
            birthday: [''],
            names: ['', Validators.required],
            father_last_name: ['', Validators.required],
            mother_last_name: ['', Validators.required],
            country: ['', Validators.required],
            type_document: ['', Validators.required],
            num_document: ['', Validators.required],
            telephone: ['', Validators.required]
          }
        )
      }
    );

    this._userSharedService.onUserGroupsChanged
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe(response => {
        this.userGroupsList = response;
      });
  }

  errorHandlingForm (control: string, groupForm?: string) {
    let validateError: boolean;
    if (groupForm){
      validateError = this.registerForm.controls[groupForm]['controls'][control].errors && 
        this.registerForm.controls[groupForm]['controls'][control].touched;
    } else {
      validateError = this.registerForm.controls[control].errors && 
        this.registerForm.controls[control].touched;
    }
    return validateError;
  }

  errorHandlingFormValidator (control: string, validator: string, groupForm?: string) {
    let validateError: boolean;
    if (groupForm){
      validateError = this.registerForm.controls[groupForm]['controls'][control].hasError(validator) && 
        this.registerForm.controls[groupForm]['controls'][control].touched;
    } else {
      validateError = this.registerForm.controls[control].hasError(validator) && 
        this.registerForm.controls[control].touched;
    }
    return validateError
  }

  onSubmitAdd() {
    this.submitted = true;

    if(this.registerForm.invalid) {
      return;
    }

    let bdAddUser = this.registerForm.getRawValue();
    let arrGroup = [];
    arrGroup.push(+(bdAddUser.groups));
    bdAddUser.groups = arrGroup;
    let userBirt = bdAddUser.profile.birthday;
    bdAddUser.profile.birthday = `${userBirt.year}-${userBirt.month}-${userBirt.day}`;
    bdAddUser.first_name = bdAddUser.profile.names.split(' ')[0];
    bdAddUser.last_name = bdAddUser.profile.father_last_name;
    this.onAddNewUser(bdAddUser);
  }

  onAddNewUser(body) {
    this._userListService.addNewUser(body)
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe({
        next: (resp) => {
          this._loadMsgService.showToastMsgSuccess(
            'Se agregó el usuario correctamente',
            'Buen trabajo!'
          );
          this._userListService.getDataUserList();
          this.onReset();
          this._loadMsgService.hideLoadingMsg();
        }
      });
  }

  onGetParameters(body){
    this._sharedService.getParameters(body)
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe({
        next: (resp) => {
          this.typeDocList = resp.data[0]['FS_TIP_DOC'];
          this.countryList = resp.data[0]['FS_PAI_AUT'];
        }
      });
  }

  onReset() {
    this.submitted = false;
    this.registerForm.reset();
    this.toggleSidebar('new-user-sidebar');
  }

  onChangeEmail(value){
    this.registerForm.controls['username'].setValue(value);
  }
}
