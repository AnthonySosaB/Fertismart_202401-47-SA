import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { ColumnMode, DatatableComponent } from '@swimlane/ngx-datatable';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { CoreSidebarService } from '@core/components/core-sidebar/core-sidebar.service';
import { LoadMessageService } from 'app/shared/services/load-message.service';
import { ParameterDetailListService } from './parameter-detail-list.service';
import { SharedModalService } from 'app/shared/components/shared-modal/shared-modal.service';
import { IModalConfig } from 'app/shared/interfaces/modal-config.interface';
import { ActivatedRoute } from '@angular/router';
import { IParameterDetail } from 'app/shared/interfaces/parameter-detail.interface';

@Component({
  selector: 'app-parameter-detail-list',
  templateUrl: './parameter-detail-list.component.html',
  styleUrls: ['./parameter-detail-list.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ParameterDetailListComponent implements OnInit {
  public contentHeader: object;
  public sidebarToggleRef = false;
  public rows;
  public selectedOption = 10;
  public temp = [];
  public searchValue = '';
  public ColumnMode = ColumnMode;
  public rowEdit: IParameterDetail = {} as IParameterDetail;
  public parameterName: string;
  public currentId: number;
  
  @ViewChild(DatatableComponent) table: DatatableComponent;

  private tempData = [];
  private _unsubscribeAll: Subject<any>;

  constructor(
    private _parameterDetailListService: ParameterDetailListService,
    private _coreSidebarService: CoreSidebarService,
    private _loadMsgService: LoadMessageService,
    private _sharedModalService: SharedModalService,
    private _route: ActivatedRoute
  ) {
    this._unsubscribeAll = new Subject();

    this._route.params
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe(params => {
        this.currentId = +params['id'];
        this.parameterName = params['name'];
      });
  }

  ngOnInit(): void {
    this.assignTitleBreadcrumbs();
    this._parameterDetailListService.onParameterDetailListChanged
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
      headerTitle: `${this.parameterName}`,
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
            isLink: true,
            link: '/apps/parameter/parameter-list'
          },
          {
            name: 'Sub. Parámetro',
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

  onAddParameterDetail(name): void {
    this._coreSidebarService.getSidebarRegistry(name).toggleOpen();
  }

  onEditParameterDetail(name, row): void {
    this.rowEdit = row;
    this._coreSidebarService.getSidebarRegistry(name).toggleOpen();
  }

  onOpenDeleteModal(rowParam) {
    const configModal: IModalConfig = {
      type: 'danger',
      title: 'Eliminar sub parámetro',
      isHTMLBody: true,
      bodyDescription: `¿Estas seguro de eliminar el detalle parámetro <strong>${rowParam.name}</strong>?, recuerda que no se podrá recuperar la información asociada.`,
      hasPrimaryButton: true,
      primaryButtonText: 'Si, eliminar',
      primaryButtonAction: this.onDeleteParameterDetail.bind(this, rowParam.id),
      hasSecondaryButton: true,
      secondaryButtonText: 'Cancelar',
      secondaryButtonAction: this.onCloseModal.bind(this)

    }
    this._sharedModalService.emitOpenModal(configModal);
  }

  onDeleteParameterDetail(id) {
    this._parameterDetailListService.deleteParameterDetail(id)
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe(resp => {
        this._loadMsgService.showToastMsgSuccess(
          'Se eliminó el parámetro correctamente',
          'Buen trabajo!',
        );
        this._parameterDetailListService.getDataParameterDetailList(this.currentId);
        this._loadMsgService.hideLoadingMsg();
        this.onCloseModal();
      });;
  }

  onCloseModal() {
    this._sharedModalService.emitCloseModal();
  }
}
