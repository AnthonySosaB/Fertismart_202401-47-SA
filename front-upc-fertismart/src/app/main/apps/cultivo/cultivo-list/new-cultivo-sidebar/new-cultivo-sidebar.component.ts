import { Component, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CoreSidebarService } from '@core/components/core-sidebar/core-sidebar.service';
import { LoadMessageService } from 'app/shared/services/load-message.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { CultivoListService } from '../cultivo-list.service';

@Component({
  selector: 'app-new-cultivo-sidebar',
  templateUrl: './new-cultivo-sidebar.component.html'
})
export class NewCultivoSidebarComponent implements OnInit, OnDestroy {
  public registerForm: FormGroup;
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
        nombre_cultivo: ['', Validators.required],
        siglas_cultivo: ['', Validators.required],
        requerimiento_suelo: ['', Validators.required],
        estado: ['', Validators.required],
        variedad: ['', Validators.required],
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
    this.onAddNewCultivo(payloadAdd);
  }

  onAddNewCultivo(body) {
    this._cultivoListService.addNewCultivo(body)
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe({
        next: (resp) => {
          this._loadMsgService.showToastMsgSuccess(
            'Se agregó el cultivo correctamente',
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
    this.registerForm.reset();
    this.toggleSidebar('new-cultivo-sidebar');
  }
}
