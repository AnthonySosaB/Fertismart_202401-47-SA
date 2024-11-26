import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { ToastrService } from 'ngx-toastr';

@Injectable()
export class LoadMessageService {
  @BlockUI() blockUI: NgBlockUI;

  constructor(
    private _toastrService: ToastrService
  ) { }

  showLoadingMsg(msg?) {
    const message = msg || 'Cargando...'
    this.blockUI.start(message);
  }

  hideLoadingMsg() {
    this.blockUI.stop();
  }

  showToastMsgSuccess(msg, title){
    this._toastrService.success(
      msg, title, { toastClass: 'toast ngx-toastr', closeButton: true }
    );
  }

  showToastMsgError(msg, title){
    this._toastrService.error(
      msg, title, { toastClass: 'toast ngx-toastr', closeButton: true }
    );
  }
}
