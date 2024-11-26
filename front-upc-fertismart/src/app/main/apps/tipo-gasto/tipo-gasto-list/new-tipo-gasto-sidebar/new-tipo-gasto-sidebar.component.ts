import { Component, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CoreSidebarService } from '@core/components/core-sidebar/core-sidebar.service';
import { LoadMessageService } from 'app/shared/services/load-message.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { TipoGastoListService } from '../tipo-gasto-list.service';

@Component({
  selector: 'app-new-tipo-gasto-sidebar',
  templateUrl: './new-tipo-gasto-sidebar.component.html'
})
export class NewTipoGastoSidebarComponent implements OnInit, OnDestroy {
  public registerForm: FormGroup;
  public submitted = false;

  private _unsubscribeAll: Subject<any>;
  
  constructor(
    private _coreSidebarService: CoreSidebarService,
    private _formBuilder: FormBuilder,
    private _tipoGastoListService: TipoGastoListService,
    private _loadMsgService: LoadMessageService
  ) {
    this._unsubscribeAll = new Subject();
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
        nombre_tipo_gasto: ['', Validators.required],
        siglas_tipo_gasto: ['', Validators.required]
      }
    );
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
    this.onAddNewTipoGasto(payloadAdd);
  }

  onAddNewTipoGasto(body) {
    this._tipoGastoListService.addNewTipoGasto(body)
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe({
        next: (resp) => {
          this._loadMsgService.showToastMsgSuccess(
            'Se agregó el tipo de costo correctamente',
            'Buen trabajo!'
          );
          this._tipoGastoListService.getDataTipoGastoList();
          this.onReset();
          this._loadMsgService.hideLoadingMsg();
        }
      });
  }

  onReset() {
    this.submitted = false;
    this.registerForm.reset();
    this.toggleSidebar('new-tipo-gasto-sidebar');
  }
}
