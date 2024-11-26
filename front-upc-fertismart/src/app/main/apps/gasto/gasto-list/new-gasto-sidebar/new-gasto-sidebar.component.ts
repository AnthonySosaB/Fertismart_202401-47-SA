import { Component, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CoreSidebarService } from '@core/components/core-sidebar/core-sidebar.service';
import { LoadMessageService } from 'app/shared/services/load-message.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { GastoListService } from '../gasto-list.service';

@Component({
  selector: 'app-new-gasto-sidebar',
  templateUrl: './new-gasto-sidebar.component.html'
})
export class NewGastoSidebarComponent implements OnInit, OnDestroy {
  public registerForm: FormGroup;
  public submitted = false;
  public campoList = [];
  public tipoGastoList = [];
  private currentDate = new Date().toISOString();
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
    return this.registerForm.controls['descripcion_gasto'];
  }

  get observacionesControl(){
    return this.registerForm.controls['observaciones'];
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
        campo: ['', Validators.required],
        descripcion_gasto: ['', Validators.required],
        tipo_gasto: ['', Validators.required],
        fecha_registro: [this.currentDate, Validators.required],
        monto: ['', Validators.required],
        observaciones: ['', Validators.required]
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
    this.onAddNewGasto(payloadAdd);
  }

  onAddNewGasto(body) {
    this._gastoListService.addNewGasto(body)
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe({
        next: (resp) => {
          this._loadMsgService.showToastMsgSuccess(
            'Se agregó el costo correctamente',
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
    this.registerForm.reset();
    this.toggleSidebar('new-gasto-sidebar');
  }
}
