import { Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CoreSidebarService } from '@core/components/core-sidebar/core-sidebar.service';
import { IParameterDetail } from 'app/shared/interfaces/parameter-detail.interface';
import { LoadMessageService } from 'app/shared/services/load-message.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ParameterDetailListService } from '../parameter-detail-list.service';

@Component({
  selector: 'app-edit-parameter-detail-sidebar',
  templateUrl: './edit-parameter-detail-sidebar.component.html'
})
export class EditParameterDetailSidebarComponent implements OnInit, OnDestroy, OnChanges {
  @Input() rowEdit?: IParameterDetail = {} as IParameterDetail;
  public editForm: FormGroup;
  public submitted = false;
  private _unsubscribeAll: Subject<any>;
  
  constructor(
    private _coreSidebarService: CoreSidebarService,
    private _formBuilder: FormBuilder,
    private _parameterDetailListService: ParameterDetailListService,
    private _loadMsgService: LoadMessageService
  ) {
    this._unsubscribeAll = new Subject();
  }
  
  ngOnChanges(changes: SimpleChanges): void {
    this.editForm.patchValue({
      name: changes.rowEdit.currentValue.name, 
      code: changes.rowEdit.currentValue.code,
      numeric_value: changes.rowEdit.currentValue.numeric_value,
      string_value: changes.rowEdit.currentValue.string_value,
      order: changes.rowEdit.currentValue.order,
      long_string_value: changes.rowEdit.currentValue.long_string_value,
      active: changes.rowEdit.currentValue.active
    });
  }
    
  ngOnDestroy(): void {
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }

  toggleSidebar(name): void {
    this._coreSidebarService.getSidebarRegistry(name).toggleOpen();
  }

  ngOnInit(): void {
    this.initializeEditForm();
  }

  initializeEditForm(){
    this.editForm = this._formBuilder.group(
      {
        name: [this.rowEdit.name, Validators.required],
        code: [{ value: this.rowEdit.code, disabled: true }, Validators.required],
        numeric_value: [this.rowEdit.numeric_value, Validators.required],
        string_value: [this.rowEdit.string_value],
        order: [this.rowEdit.order, Validators.required],
        long_string_value: [this.rowEdit.long_string_value],
        active: [this.rowEdit.active, Validators.required]
      }
    );
  }

  get longStringControl(){
    return this.editForm.controls['long_string_value'];
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

  onSubmitEdit() {
    this.submitted = true;
    if(this.editForm.invalid) { return; }

    let payloadAdd = this.editForm.getRawValue();
    this.onEditParameter(payloadAdd);
  }

  onEditParameter(body) {
    this._parameterDetailListService.editParameterDetail(body, this.rowEdit.id)
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe({
        next: (resp) => {
          this._loadMsgService.showToastMsgSuccess(
            'Se editó el parámetro correctamente',
            'Buen trabajo!'
          );
          this._parameterDetailListService.getDataParameterDetailList(resp.parameter);
          this.onReset();
          this._loadMsgService.hideLoadingMsg();
        }
      });
  }

  onReset() {
    this.submitted = false;
    this.toggleSidebar('edit-parameter-detail-sidebar');
  }
}
