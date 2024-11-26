import { Component, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CoreSidebarService } from '@core/components/core-sidebar/core-sidebar.service';
import { LoadMessageService } from 'app/shared/services/load-message.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { RecomendacionListService } from '../recomendacion-list.service';

@Component({
  selector: 'app-new-recomendacion-sidebar',
  templateUrl: './new-recomendacion-sidebar.component.html'
})
export class NewRecomendacionSidebarComponent implements OnInit, OnDestroy {
  public registerForm: FormGroup;
  public submitted = false;
  public campoList = [];
  private _unsubscribeAll: Subject<any>;
  
  constructor(
    private _coreSidebarService: CoreSidebarService,
    private _formBuilder: FormBuilder,
    private _recomendacionListService: RecomendacionListService,
    private _loadMsgService: LoadMessageService
  ) {
    this._unsubscribeAll = new Subject();

    this._recomendacionListService.onCampoChanged
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe(response => {
        this.campoList = response;
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
        fecha: ['', Validators.required],
        fosforo: ['', Validators.required],
        potasio: ['', Validators.required],
        temperatura: ['', Validators.required],
        humedad_suelo: ['', Validators.required],
        humedad_aire: ['', Validators.required],
        nitrogeno: ['', Validators.required],
        observacion: ['']
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
    this.onAddNewRecomendacion(payloadAdd);
  }

  onAddNewRecomendacion(body) {
    this._recomendacionListService.addNewRecomendacion(body)
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe({
        next: (resp) => {
          this._loadMsgService.showToastMsgSuccess(
            'Se agregó el recomendacion correctamente',
            'Buen trabajo!'
          );
          this._recomendacionListService.getDataRecomendacionList();
          this.onReset();
          this._loadMsgService.hideLoadingMsg();
        }
      });
  }

  onReset() {
    this.submitted = false;
    this.registerForm.reset();
    this.toggleSidebar('new-recomendacion-sidebar');
  }
}
