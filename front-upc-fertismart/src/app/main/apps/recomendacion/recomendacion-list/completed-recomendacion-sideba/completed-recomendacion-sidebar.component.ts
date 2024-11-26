import { Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CoreSidebarService } from '@core/components/core-sidebar/core-sidebar.service';
import { LoadMessageService } from 'app/shared/services/load-message.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { RecomendacionListService } from '../recomendacion-list.service';

@Component({
  selector: 'app-completed-recomendacion-sidebar',
  templateUrl: './completed-recomendacion-sidebar.component.html'
})
export class CompletedRecomendacionSidebarComponent implements OnInit, OnDestroy, OnChanges {
  @Input() recomendacion?: number;
  public completedForm: FormGroup;
  public submitted = false;
  private _unsubscribeAll: Subject<any>;
  
  constructor(
    private _coreSidebarService: CoreSidebarService,
    private _formBuilder: FormBuilder,
    private _recomendacionListService: RecomendacionListService,
    private _loadMsgService: LoadMessageService
  ) {
    this._unsubscribeAll = new Subject();
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.completedForm.patchValue({
      recomendacion: changes.recomendacion.currentValue
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
    console.log('this.recomendacion', this.recomendacion)
    this.completedForm = this._formBuilder.group(
      {
        recomendacion: [this.recomendacion, Validators.required],
        fecha_aplicacion: ['', Validators.required],
        dosis: ['', Validators.required],
        resultado: ['', Validators.required]
      }
    );
  }

  errorHandlingForm (control: string, groupForm?: string) {
    let validateError: boolean;
    if (groupForm){
      validateError = this.completedForm.controls[groupForm]['controls'][control].errors && 
          this.completedForm.controls[groupForm]['controls'][control].touched;
      } else {
        validateError = this.completedForm.controls[control].errors && 
          this.completedForm.controls[control].touched;
      }
      return validateError;
  }

  errorHandlingFormValidator (control: string, validator: string, groupForm?: string) {
    let validateError: boolean;
    if (groupForm){
      validateError = this.completedForm.controls[groupForm]['controls'][control].hasError(validator) && 
          this.completedForm.controls[groupForm]['controls'][control].touched;
      } else {
        validateError = this.completedForm.controls[control].hasError(validator) && 
          this.completedForm.controls[control].touched;
      }
      return validateError
  }

  onSubmitCompleted() {
    this.submitted = true;
    if(this.completedForm.invalid) { return; }
    
    let payloadAdd = this.completedForm.getRawValue();
    this.onCompletedRecomendacion(payloadAdd);
  }

  onCompletedRecomendacion(body) {
    this._recomendacionListService.completedRecomendacion(body)
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe({
        next: (resp) => {
          this._loadMsgService.showToastMsgSuccess(
            'Se completó la recomendación correctamente',
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
    this.completedForm.reset();
    this.toggleSidebar('completed-recomendacion-sidebar');
  }
}
