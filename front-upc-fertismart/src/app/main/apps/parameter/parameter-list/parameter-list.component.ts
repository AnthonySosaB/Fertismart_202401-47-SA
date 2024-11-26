import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { ColumnMode, DatatableComponent } from '@swimlane/ngx-datatable';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { CoreSidebarService } from '@core/components/core-sidebar/core-sidebar.service';
import { LoadMessageService } from 'app/shared/services/load-message.service';
import { ParameterListService } from './parameter-list.service';
import { SharedModalService } from 'app/shared/components/shared-modal/shared-modal.service';
import { IModalConfig } from 'app/shared/interfaces/modal-config.interface';
import { IParameter } from 'app/shared/interfaces/parameter.interface';

@Component({
  selector: 'app-parameter-list',
  templateUrl: './parameter-list.component.html',
  styleUrls: ['./parameter-list.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ParameterListComponent implements OnInit {
  public contentHeader: object;
  public rows;
  public selectedOption = 10;
  public temp = [];
  public searchValue = '';
  public ColumnMode = ColumnMode;
  public rowEdit: IParameter = {} as IParameter;
  
  @ViewChild(DatatableComponent) table: DatatableComponent;

  private tempData = [];
  private _unsubscribeAll: Subject<any>;

  constructor(
    private _parameterListService: ParameterListService,
    private _coreSidebarService: CoreSidebarService,
    private _loadMsgService: LoadMessageService,
    private _sharedModalService: SharedModalService
  ) {
    this._unsubscribeAll = new Subject();
  }

  ngOnInit(): void {
    this.assignTitleBreadcrumbs();
    this._parameterListService.onParameterListChanged
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe(response => {
        this.rows = response;
        this.tempData = this.rows;
      });
  }

  ngOnDestroy(): void {
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }

  assignTitleBreadcrumbs() {
    this.contentHeader = {
      headerTitle: 'Parámetros',
      actionButton: false,
      breadcrumb: {
        type: '',
        links: [
          {
            name: 'Inicio',
            isLink: true,
            link: '/'
          },
          {
            name: 'Parámetros',
            isLink: false
          }
        ]
      }
    };
  }

  filterUpdate(event) {
    const val = event.target.value.toLowerCase();
    const temp = this.tempData.filter(function (d) {
      return d.name.toLowerCase().indexOf(val) !== -1 ||
        d.code.toLowerCase().indexOf(val) !== -1 || !val;
    });

    this.rows = temp;
    this.table.offset = 0;
  }

  onAddParameter(name): void {
    this._coreSidebarService.getSidebarRegistry(name).toggleOpen();
  }

  onEditParameter(name, row): void {
    this.rowEdit = row;
    this._coreSidebarService.getSidebarRegistry(name).toggleOpen();
  }

  onOpenDeleteModal(rowParam) {
    const configModal: IModalConfig = {
      type: 'danger',
      title: 'Eliminar parámetro',
      isHTMLBody: true,
      bodyDescription: `¿Estas seguro de eliminar el parámetro <strong>${rowParam.name}</strong>?, recuerda que no se podrá recuperar la información asociada.`,
      hasPrimaryButton: true,
      primaryButtonText: 'Si, eliminar',
      primaryButtonAction: this.onDeleteParameter.bind(this, rowParam.id),
      hasSecondaryButton: true,
      secondaryButtonText: 'Cancelar',
      secondaryButtonAction: this.onCloseModal.bind(this)

    }
    this._sharedModalService.emitOpenModal(configModal);
  }

  onDeleteParameter(id) {
    this._parameterListService.deleteParameter(id)
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe(resp => {
        this._loadMsgService.showToastMsgSuccess(
          'Se eliminó el parámetro correctamente',
          'Buen trabajo!',
        );
        this._parameterListService.getDataParameterList();
        this._loadMsgService.hideLoadingMsg();
        this.onCloseModal();
      });;
  }

  onCloseModal() {
    this._sharedModalService.emitCloseModal();
  }
}
