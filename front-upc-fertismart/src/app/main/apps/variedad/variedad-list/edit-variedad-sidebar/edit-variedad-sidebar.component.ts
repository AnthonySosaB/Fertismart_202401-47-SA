import { Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CoreSidebarService } from '@core/components/core-sidebar/core-sidebar.service';
import { LoadMessageService } from 'app/shared/services/load-message.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { VariedadListService } from '../variedad-list.service';
import { IVariedad } from 'app/shared/interfaces/variedad.interface';

@Component({
  selector: 'app-edit-variedad-sidebar',
  templateUrl: './edit-variedad-sidebar.component.html'
})
export class EditVariedadSidebarComponent implements OnInit, OnDestroy, OnChanges {
  @Input() rowEdit?: IVariedad = {} as IVariedad;
  public editForm: FormGroup;
  public submitted = false;
  private _unsubscribeAll: Subject<any>;
  
  constructor(
    private _coreSidebarService: CoreSidebarService,
    private _formBuilder: FormBuilder,
    private _parameterDetailListService: VariedadListService,
    private _loadMsgService: LoadMessageService
  ) {
    this._unsubscribeAll = new Subject();
  }

  get requerimientoSueloControl(){
    return this.editForm.controls['requerimiento_suelo'];
  }
  
  ngOnChanges(changes: SimpleChanges): void {
    this.editForm.patchValue({
      nombre_variedad: changes.rowEdit.currentValue.nombre_variedad,
      siglas_variedad: changes.rowEdit.currentValue.siglas_variedad
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
        nombre_variedad: [this.rowEdit.nombre_variedad, Validators.required],
        siglas_variedad: [this.rowEdit.siglas_variedad, Validators.required]
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
    this._parameterDetailListService.editVariedad(body, this.rowEdit.id)
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe({
        next: (resp) => {
          this._loadMsgService.showToastMsgSuccess(
            'Se editó la variedad correctamente',
            'Buen trabajo!'
          );
          this._parameterDetailListService.getDataVariedadList();
          this.onReset();
          this._loadMsgService.hideLoadingMsg();
        }
      });
  }

  onReset() {
    this.submitted = false;
    this.toggleSidebar('edit-variedad-sidebar');
  }
}
