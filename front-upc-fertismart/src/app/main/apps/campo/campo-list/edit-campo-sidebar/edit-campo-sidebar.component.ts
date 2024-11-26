import { Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CoreSidebarService } from '@core/components/core-sidebar/core-sidebar.service';
import { LoadMessageService } from 'app/shared/services/load-message.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { CampoListService } from '../campo-list.service';
import { ICampo } from 'app/shared/interfaces/campo.interface';

@Component({
  selector: 'app-edit-campo-sidebar',
  templateUrl: './edit-campo-sidebar.component.html'
})
export class EditCampoSidebarComponent implements OnInit, OnDestroy, OnChanges {
  @Input() rowEdit?: ICampo = {} as ICampo;
  public editForm: FormGroup;
  public submitted = false;
  public variedadList = [];
  public cultivoList = [];
  public sueloList = [];
  private _unsubscribeAll: Subject<any>;
  
  constructor(
    private _coreSidebarService: CoreSidebarService,
    private _formBuilder: FormBuilder,
    private _campoListService: CampoListService,
    private _loadMsgService: LoadMessageService
  ) {
    this._unsubscribeAll = new Subject();

    this._campoListService.onVariedadChanged
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe(response => {
        this.variedadList = response;
      });
    
    this._campoListService.onCultivoChanged
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe(response => {
        this.cultivoList = response;
      });

    this._campoListService.onSueloChanged
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe(response => {
        this.sueloList = response;
      });
  }

  get requerimientoSueloControl(){
    return this.editForm.controls['requerimiento_suelo'];
  }
  
  ngOnChanges(changes: SimpleChanges): void {
    this.editForm.patchValue({
      cultivo: changes.rowEdit.currentValue.cultivo,
      nombre_campo: changes.rowEdit.currentValue.nombre_campo,
      tipo_suelo: changes.rowEdit.currentValue.tipo_suelo,
      siglas_campo: changes.rowEdit.currentValue.siglas_campo,
      variedad: changes.rowEdit.currentValue.variedad,
      area: changes.rowEdit.currentValue.area,
      latitud: changes.rowEdit.currentValue.latitud,
      longitud: changes.rowEdit.currentValue.longitud,
      estado: changes.rowEdit.currentValue.estado
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
        cultivo: [this.rowEdit.cultivo, Validators.required],
        nombre_campo: [this.rowEdit.nombre_campo, Validators.required],
        tipo_suelo: [this.rowEdit.tipo_suelo, Validators.required],
        siglas_campo: [this.rowEdit.siglas_campo, Validators.required],
        variedad: [this.rowEdit.variedad, Validators.required],
        area: [this.rowEdit.area, Validators.required],
        latitud: [this.rowEdit.latitud, Validators.required],
        longitud: [this.rowEdit.longitud, Validators.required],
        estado: [this.rowEdit.estado, Validators.required]
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
    this.onEditParameter(payloadAdd);
  }

  onEditParameter(body) {
    this._campoListService.editCampo(body, this.rowEdit.id)
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe({
        next: (resp) => {
          this._loadMsgService.showToastMsgSuccess(
            'Se editó el campo correctamente',
            'Buen trabajo!'
          );
          this._campoListService.getDataCampoList();
          this.onReset();
          this._loadMsgService.hideLoadingMsg();
        }
      });
  }

  onReset() {
    this.submitted = false;
    this.toggleSidebar('edit-campo-sidebar');
  }
}
