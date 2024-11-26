import { Component, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CoreSidebarService } from '@core/components/core-sidebar/core-sidebar.service';
import { LoadMessageService } from 'app/shared/services/load-message.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { FertilizanteListService } from '../fertilizante-list.service';

@Component({
  selector: 'app-new-fertilizante-sidebar',
  templateUrl: './new-fertilizante-sidebar.component.html'
})
export class NewFertilizanteSidebarComponent implements OnInit, OnDestroy {
  public registerForm: FormGroup;
  public submitted = false;

  private _unsubscribeAll: Subject<any>;
  
  constructor(
    private _coreSidebarService: CoreSidebarService,
    private _formBuilder: FormBuilder,
    private _FertilizanteListService: FertilizanteListService,
    private _loadMsgService: LoadMessageService
  ) {
    this._unsubscribeAll = new Subject();
  }

  get requerimientoSueloControl(){
    return this.registerForm.controls['requerimiento_suelo'];
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
        nombre_fertilizante: ['', Validators.required],
        composicion: ['', Validators.required],
        precio: ['', Validators.required],
        codigo_codificado: ['', Validators.required]
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
    this.onAddNewFertilizante(payloadAdd);
  }

  onAddNewFertilizante(body) {
    this._FertilizanteListService.addNewFertilizante(body)
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe({
        next: (resp) => {
          this._loadMsgService.showToastMsgSuccess(
            'Se agregó el fertilizante correctamente',
            'Buen trabajo!'
          );
          this._FertilizanteListService.getDataFertilizanteList();
          this.onReset();
          this._loadMsgService.hideLoadingMsg();
        }
      });
  }

  onReset() {
    this.submitted = false;
    this.registerForm.reset();
    this.toggleSidebar('new-fertilizante-sidebar');
  }
}
