import { Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CoreSidebarService } from '@core/components/core-sidebar/core-sidebar.service';
import { LoadMessageService } from 'app/shared/services/load-message.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { TipoGastoListService } from '../tipo-gasto-list.service';
import { ITipoGasto } from 'app/shared/interfaces/tipo-gasto.interface';

@Component({
  selector: 'app-edit-tipo-gasto-sidebar',
  templateUrl: './edit-tipo-gasto-sidebar.component.html'
})
export class EditTipoGastoSidebarComponent implements OnInit, OnDestroy, OnChanges {
  @Input() rowEdit?: ITipoGasto = {} as ITipoGasto;
  public editForm: FormGroup;
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
  
  ngOnChanges(changes: SimpleChanges): void {
    this.editForm.patchValue({
      nombre_tipo_gasto: changes.rowEdit.currentValue.nombre_tipo_gasto,
      siglas_tipo_gasto: changes.rowEdit.currentValue.siglas_tipo_gasto
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
        nombre_tipo_gasto: [this.rowEdit.nombre_tipo_gasto, Validators.required],
        siglas_tipo_gasto: [this.rowEdit.siglas_tipo_gasto, Validators.required]
      }
    );
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
    this.onEditTipoGasto(payloadAdd);
  }

  onEditTipoGasto(body) {
    this._tipoGastoListService.editTipoGasto(body, this.rowEdit.id)
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe({
        next: (resp) => {
          this._loadMsgService.showToastMsgSuccess(
            'Se editó el tipo de costo correctamente',
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
    this.toggleSidebar('edit-tipo-gasto-sidebar');
  }
}
