import { Component, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CoreSidebarService } from '@core/components/core-sidebar/core-sidebar.service';
import { LoadMessageService } from 'app/shared/services/load-message.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { AplicacionListService } from '../aplicacion-list.service';

@Component({
  selector: 'app-new-aplicacion-sidebar',
  templateUrl: './new-aplicacion-sidebar.component.html'
})
export class NewAplicacionSidebarComponent implements OnInit, OnDestroy {
  public registerForm: FormGroup;
  public submitted = false;
  public campoList = [];
  public fertilizanteList = [];
  public recomendacionList = [];
  private currentDate = new Date().toISOString();
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
        fertilizante: ['', Validators.required],
        recomendacion: ['', Validators.required],
        fecha_aplicacion: [this.currentDate, Validators.required],
        dosis: ['', Validators.required],
        resultado: ['', Validators.required],
        motivo_fallo: ['', Validators.required]
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
    this.onAddNewAplicacion(payloadAdd);
  }

  onAddNewAplicacion(body) {
    this._aplicacionListService.addNewAplicacion(body)
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe({
        next: (resp) => {
          this._loadMsgService.showToastMsgSuccess(
            'Se agregó la aplicación correctamente',
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
    this.registerForm.reset();
    this.toggleSidebar('new-aplicacion-sidebar');
  }
}
