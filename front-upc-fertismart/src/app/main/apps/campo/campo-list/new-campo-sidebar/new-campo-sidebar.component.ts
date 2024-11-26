import { Component, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CoreSidebarService } from '@core/components/core-sidebar/core-sidebar.service';
import { LoadMessageService } from 'app/shared/services/load-message.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { CampoListService } from '../campo-list.service';

@Component({
  selector: 'app-new-campo-sidebar',
  templateUrl: './new-campo-sidebar.component.html'
})
export class NewCampoSidebarComponent implements OnInit, OnDestroy {
  public registerForm: FormGroup;
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
        cultivo: ['', Validators.required],
        nombre_campo: ['', Validators.required],
        tipo_suelo: ['', Validators.required],
        siglas_campo: ['', Validators.required],
        variedad: ['', Validators.required],
        area: ['', Validators.required],
        latitud: ['', Validators.required],
        longitud: ['', Validators.required],
        estado: ['', Validators.required]
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
    this.onAddNewCampo(payloadAdd);
  }

  onAddNewCampo(body) {
    this._campoListService.addNewCampo(body)
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe({
        next: (resp) => {
          this._loadMsgService.showToastMsgSuccess(
            'Se agregó el campo correctamente',
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
    this.registerForm.reset();
    this.toggleSidebar('new-campo-sidebar');
  }
}
