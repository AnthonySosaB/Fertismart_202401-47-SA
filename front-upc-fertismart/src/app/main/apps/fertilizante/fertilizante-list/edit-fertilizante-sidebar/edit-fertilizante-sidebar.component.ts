import { Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CoreSidebarService } from '@core/components/core-sidebar/core-sidebar.service';
import { LoadMessageService } from 'app/shared/services/load-message.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { FertilizanteListService } from '../fertilizante-list.service';
import { IFertilizante } from 'app/shared/interfaces/fertilizante.interface';

@Component({
  selector: 'app-edit-fertilizante-sidebar',
  templateUrl: './edit-fertilizante-sidebar.component.html'
})
export class EditFertilizanteSidebarComponent implements OnInit, OnDestroy, OnChanges {
  @Input() rowEdit?: IFertilizante = {} as IFertilizante;
  public editForm: FormGroup;
  public submitted = false;
  private _unsubscribeAll: Subject<any>;
  
  constructor(
    private _coreSidebarService: CoreSidebarService,
    private _formBuilder: FormBuilder,
    private _parameterDetailListService: FertilizanteListService,
    private _loadMsgService: LoadMessageService
  ) {
    this._unsubscribeAll = new Subject();
  }

  get requerimientoSueloControl(){
    return this.editForm.controls['requerimiento_suelo'];
  }
  
  ngOnChanges(changes: SimpleChanges): void {
    this.editForm.patchValue({
      nombre_fertilizante: changes.rowEdit.currentValue.nombre_fertilizante,
      composicion: changes.rowEdit.currentValue.composicion,
      precio: changes.rowEdit.currentValue.precio,
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
        nombre_fertilizante: [this.rowEdit.nombre_fertilizante, Validators.required],
        composicion: [this.rowEdit.composicion, Validators.required],
        precio: [this.rowEdit.precio, Validators.required],
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
    this.onEditParameter(payloadAdd);
  }

  onEditParameter(body) {
    this._parameterDetailListService.editFertilizante(body, this.rowEdit.id)
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe({
        next: (resp) => {
          this._loadMsgService.showToastMsgSuccess(
            'Se editó el fertilizante correctamente',
            'Buen trabajo!'
          );
          this._parameterDetailListService.getDataFertilizanteList();
          this.onReset();
          this._loadMsgService.hideLoadingMsg();
        }
      });
  }

  onReset() {
    this.submitted = false;
    this.toggleSidebar('edit-fertilizante-sidebar');
  }
}
