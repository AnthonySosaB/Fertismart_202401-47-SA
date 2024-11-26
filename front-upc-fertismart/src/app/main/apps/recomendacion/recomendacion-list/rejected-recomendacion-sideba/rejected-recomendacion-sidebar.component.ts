import { Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CoreSidebarService } from '@core/components/core-sidebar/core-sidebar.service';
import { LoadMessageService } from 'app/shared/services/load-message.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { RecomendacionListService } from '../recomendacion-list.service';

@Component({
  selector: 'app-rejected-recomendacion-sidebar',
  templateUrl: './rejected-recomendacion-sidebar.component.html'
})
export class RejectedRecomendacionSidebarComponent implements OnInit, OnDestroy, OnChanges {
  @Input() recomendacion?: number;
  public rejectedForm: FormGroup;
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
    this.rejectedForm.patchValue({
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
    this.rejectedForm = this._formBuilder.group(
      {
        recomendacion: [this.recomendacion, Validators.required],
        fecha_aplicacion: ['', Validators.required],
        dosis: ['', Validators.required],
        motivo_fallo: ['', Validators.required]
      }
    );
  }

  errorHandlingForm (control: string, groupForm?: string) {
    let validateError: boolean;
    if (groupForm){
      validateError = this.rejectedForm.controls[groupForm]['controls'][control].errors && 
          this.rejectedForm.controls[groupForm]['controls'][control].touched;
      } else {
        validateError = this.rejectedForm.controls[control].errors && 
          this.rejectedForm.controls[control].touched;
      }
      return validateError;
  }

  errorHandlingFormValidator (control: string, validator: string, groupForm?: string) {
    let validateError: boolean;
    if (groupForm){
      validateError = this.rejectedForm.controls[groupForm]['controls'][control].hasError(validator) && 
          this.rejectedForm.controls[groupForm]['controls'][control].touched;
      } else {
        validateError = this.rejectedForm.controls[control].hasError(validator) && 
          this.rejectedForm.controls[control].touched;
      }
      return validateError
  }

  onSubmitRejected() {
    this.submitted = true;
    if(this.rejectedForm.invalid) { return; }
    
    let payloadAdd = this.rejectedForm.getRawValue();
    this.onRejectedRecomendacion(payloadAdd);
  }

  onRejectedRecomendacion(body) {
    this._recomendacionListService.rejectedRecomendacion(body)
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe({
        next: (resp) => {
          this._loadMsgService.showToastMsgSuccess(
            'Se rechazó la recomendación correctamente',
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
    this.rejectedForm.reset();
    this.toggleSidebar('rejected-recomendacion-sidebar');
  }
}
