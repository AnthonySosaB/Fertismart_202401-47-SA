import { Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CoreSidebarService } from '@core/components/core-sidebar/core-sidebar.service';
import { LoadMessageService } from 'app/shared/services/load-message.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ParameterDetailListService } from '../parameter-detail-list.service';

@Component({
  selector: 'app-new-parameter-detail-sidebar',
  templateUrl: './new-parameter-detail-sidebar.component.html'
})
export class NewParameterDetailSidebarComponent implements OnInit, OnDestroy, OnChanges {
  @Input() paramId: number = 0;
  public registerForm: FormGroup;
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
    this.registerForm.patchValue({ parameter: changes.paramId.currentValue });
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
    this.registerForm = this._formBuilder.group(
      {
        parameter: [this.paramId, Validators.required],
        name: ['', Validators.required],
        code: ['', Validators.required],
        numeric_value: ['', Validators.required],
        string_value: [''],
        order: ['', Validators.required],
        long_string_value: [''],
        active: [true, Validators.required]
      }
    );
  }

  get longStringControl(){
    return this.registerForm.controls['long_string_value'];
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
    if(this.registerForm.invalid) { return; }
    
    let payloadAdd = this.registerForm.getRawValue();
    this.onAddNewParameterDetail(payloadAdd);
  }

  onAddNewParameterDetail(body) {
    this._parameterDetailListService.addNewParameterDetail(body)
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe({
        next: (resp) => {
          this._loadMsgService.showToastMsgSuccess(
            'Se agregó el detalle parámetro correctamente',
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
    this.registerForm.reset();
    this.toggleSidebar('new-parameter-detail-sidebar');
  }
}
