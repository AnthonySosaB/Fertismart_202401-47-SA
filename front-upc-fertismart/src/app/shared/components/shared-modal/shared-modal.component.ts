import { Component, ElementRef, EventEmitter, OnDestroy, OnInit, Output, ViewChild, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { User } from 'app/auth/models';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SharedModalService } from './shared-modal.service';
import { IModalConfig } from 'app/shared/interfaces/modal-config.interface';

@Component({
  selector: 'app-shared-modal',
  templateUrl: './shared-modal.component.html',
  styleUrls: ['./shared-modal.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class SharedModalComponent implements OnInit, OnDestroy {
  @ViewChild('sharedModal') sharedModal!: ElementRef;
  configModal: IModalConfig = {} as IModalConfig;
  classButtonPrimary: string;

  private _unsubscribeAll: Subject<any>;

  constructor(
    private _modalService: NgbModal,
    private _sharedModalService: SharedModalService
  ) {
    this._unsubscribeAll = new Subject();
    _sharedModalService.emitOpenModal$.subscribe((config: IModalConfig) => {
      this.openModal(config);
    });

    _sharedModalService.emitCloseModal$.subscribe(() => {
      this.closeModal();
    });
  }

  ngOnInit(): void {

  }

  ngOnDestroy(): void {
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }

  openModal(config: IModalConfig) {
    this.configModal = config;
    this.classButtonPrimary = `btn btn-${config.type}`
    this._modalService.open(this.sharedModal, {
      centered: true,
      windowClass: `modal modal-${config.type}`
    });
  }

  closeModal() {
    this._modalService.dismissAll();
  }
}
