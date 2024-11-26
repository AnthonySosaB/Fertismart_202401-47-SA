import { Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CoreSidebarService } from '@core/components/core-sidebar/core-sidebar.service';
import { LoadMessageService } from 'app/shared/services/load-message.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { GastoListService } from '../gasto-list.service';
import { IGasto } from 'app/shared/interfaces/gasto.interface';

@Component({
  selector: 'app-edit-gasto-sidebar',
  templateUrl: './edit-gasto-sidebar.component.html'
})
export class EditGastoSidebarComponent implements OnInit, OnDestroy, OnChanges {
  @Input() rowEdit?: IGasto = {} as IGasto;
  public editForm: FormGroup;
  public submitted = false;
  public campoList = [];
  public tipoGastoList = [];
  private _unsubscribeAll: Subject<any>;
  
  constructor(
    private _coreSidebarService: CoreSidebarService,
    private _formBuilder: FormBuilder,
    private _gastoListService: GastoListService,
    private _loadMsgService: LoadMessageService
  ) {
    this._unsubscribeAll = new Subject();

    this._gastoListService.onCampoChanged
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe(response => {
        this.campoList = response;
      });

    this._gastoListService.onTipoGastoChanged
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe(response => {
        this.tipoGastoList = response;
      });
  }

  get descripcionGastoControl(){
    return this.editForm.controls['descripcion_gasto'];
  }

  get observacionesControl(){
    return this.editForm.controls['observaciones'];
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.editForm.patchValue({
      campo: changes.rowEdit.currentValue.campo,
      descripcion_gasto: changes.rowEdit.currentValue.descripcion_gasto,
      tipo_gasto: changes.rowEdit.currentValue.tipo_gasto,
      fecha_registro: changes.rowEdit.currentValue.fecha_registro,
      monto: changes.rowEdit.currentValue.monto,
      observaciones: changes.rowEdit.currentValue.observaciones,
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
        campo: [this.rowEdit.campo, Validators.required],
        descripcion_gasto: [this.rowEdit.descripcion_gasto, Validators.required],
        tipo_gasto: [this.rowEdit.tipo_gasto, Validators.required],
        fecha_registro: [this.rowEdit.fecha_registro, Validators.required],
        monto: [this.rowEdit.monto, Validators.required],
        observaciones: [this.rowEdit.observaciones, Validators.required]
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
    this.onEditGasto(payloadAdd);
  }

  onEditGasto(body) {
    this._gastoListService.editGasto(body, this.rowEdit.id)
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe({
        next: (resp) => {
          this._loadMsgService.showToastMsgSuccess(
            'Se editó el gasto correctamente',
            'Buen trabajo!'
          );
          this._gastoListService.getDataGastoList();
          this.onReset();
          this._loadMsgService.hideLoadingMsg();
        }
      });
  }

  onReset() {
    this.submitted = false;
    this.toggleSidebar('edit-gasto-sidebar');
  }
}
