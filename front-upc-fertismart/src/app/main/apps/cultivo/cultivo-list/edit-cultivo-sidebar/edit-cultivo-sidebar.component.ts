import { Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CoreSidebarService } from '@core/components/core-sidebar/core-sidebar.service';
import { LoadMessageService } from 'app/shared/services/load-message.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { CultivoListService } from '../cultivo-list.service';
import { ICultivo } from 'app/shared/interfaces/cultivo.interface';

@Component({
  selector: 'app-edit-cultivo-sidebar',
  templateUrl: './edit-cultivo-sidebar.component.html'
})
export class EditCultivoSidebarComponent implements OnInit, OnDestroy, OnChanges {
  @Input() rowEdit?: ICultivo = {} as ICultivo;
  public editForm: FormGroup;
  public submitted = false;
  public variedadList = [];
  private _unsubscribeAll: Subject<any>;
  
  constructor(
    private _coreSidebarService: CoreSidebarService,
    private _formBuilder: FormBuilder,
    private _cultivoListService: CultivoListService,
    private _loadMsgService: LoadMessageService
  ) {
    this._unsubscribeAll = new Subject();

    this._cultivoListService.onVariedadChanged
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe(response => {
        this.variedadList = response;
      });
  }

  get requerimientoSueloControl(){
    return this.editForm.controls['requerimiento_suelo'];
  }
  
  ngOnChanges(changes: SimpleChanges): void {
    this.editForm.patchValue({
      nombre_cultivo: changes.rowEdit.currentValue.nombre_cultivo,
      siglas_cultivo: changes.rowEdit.currentValue.siglas_cultivo,
      requerimiento_suelo: changes.rowEdit.currentValue.requerimiento_suelo,
      estado: changes.rowEdit.currentValue.estado,
      variedad: changes.rowEdit.currentValue.variedad,
      codigo_codificado: changes.rowEdit.currentValue.codigo_codificado
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
        nombre_cultivo: [this.rowEdit.nombre_cultivo, Validators.required],
        siglas_cultivo: [this.rowEdit.siglas_cultivo, Validators.required],
        requerimiento_suelo: [this.rowEdit.requerimiento_suelo, Validators.required],
        estado: [this.rowEdit.estado, Validators.required],
        variedad: [this.rowEdit.variedad, Validators.required],
        codigo_codificado: [this.rowEdit.codigo_codificado, Validators.required]
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
    this.onEditCultivo(payloadAdd);
  }

  onEditCultivo(body) {
    this._cultivoListService.editCultivo(body, this.rowEdit.id)
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe({
        next: (resp) => {
          this._loadMsgService.showToastMsgSuccess(
            'Se editó el cultivo correctamente',
            'Buen trabajo!'
          );
          this._cultivoListService.getDataCultivoList();
          this.onReset();
          this._loadMsgService.hideLoadingMsg();
        }
      });
  }

  onReset() {
    this.submitted = false;
    this.toggleSidebar('edit-cultivo-sidebar');
  }
}
