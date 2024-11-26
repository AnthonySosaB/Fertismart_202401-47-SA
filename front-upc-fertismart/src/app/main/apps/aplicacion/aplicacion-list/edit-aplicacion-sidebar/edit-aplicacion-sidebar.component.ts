import { Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CoreSidebarService } from '@core/components/core-sidebar/core-sidebar.service';
import { LoadMessageService } from 'app/shared/services/load-message.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { AplicacionListService } from '../aplicacion-list.service';
import { IAplicacion } from 'app/shared/interfaces/aplicacion.interface';

@Component({
  selector: 'app-edit-aplicacion-sidebar',
  templateUrl: './edit-aplicacion-sidebar.component.html'
})
export class EditAplicacionSidebarComponent implements OnInit, OnDestroy, OnChanges {
  @Input() rowEdit?: IAplicacion = {} as IAplicacion;
  public editForm: FormGroup;
  public submitted = false;
  public campoList = [];
  public fertilizanteList = [];
  public recomendacionList = [];
  private _unsubscribeAll: Subject<any>;
  
  constructor(
    private _coreSidebarService: CoreSidebarService,
    private _formBuilder: FormBuilder,
    private _aplicacionListService: AplicacionListService,
    private _loadMsgService: LoadMessageService
  ) {
    this._unsubscribeAll = new Subject();

    this._aplicacionListService.onCampoChanged
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe(response => {
        this.campoList = response;
      });
    
    this._aplicacionListService.onFertilizanteChanged
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe(response => {
        this.fertilizanteList = response;
      });
    
    this._aplicacionListService.onRecomendacionChanged
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe(response => {
        this.recomendacionList = response;
      });
  }
  
  ngOnChanges(changes: SimpleChanges): void {
    this.editForm.patchValue({
      campo: changes.rowEdit.currentValue.campo,
      fertilizante: changes.rowEdit.currentValue.fertilizante,
      recomendacion: changes.rowEdit.currentValue.recomendacion,
      fecha_aplicacion: changes.rowEdit.currentValue.fecha_aplicacion,
      dosis: changes.rowEdit.currentValue.dosis,
      resultado: changes.rowEdit.currentValue.resultado,
      motivo_fallo: changes.rowEdit.currentValue.motivo_fallo
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
        fertilizante: [this.rowEdit.fertilizante, Validators.required],
        recomendacion: [this.rowEdit.recomendacion, Validators.required],
        fecha_aplicacion: [this.rowEdit.fecha_aplicacion, Validators.required],
        dosis: [this.rowEdit.dosis, Validators.required],
        resultado: [this.rowEdit.resultado, Validators.required],
        motivo_fallo: [this.rowEdit.motivo_fallo, Validators.required]
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
    this.onEditAplicacion(payloadAdd);
  }

  onEditAplicacion(body) {
    this._aplicacionListService.editAplicacion(body, this.rowEdit.id)
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe({
        next: (resp) => {
          this._loadMsgService.showToastMsgSuccess(
            'Se editó el aplicación correctamente',
            'Buen trabajo!'
          );
          this._aplicacionListService.getDataAplicacionList();
          this.onReset();
          this._loadMsgService.hideLoadingMsg();
        }
      });
  }

  onReset() {
    this.submitted = false;
    this.toggleSidebar('edit-aplicacion-sidebar');
  }
}
