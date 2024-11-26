import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { ColumnMode, DatatableComponent } from '@swimlane/ngx-datatable';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { CoreSidebarService } from '@core/components/core-sidebar/core-sidebar.service';
import { LoadMessageService } from 'app/shared/services/load-message.service';
import { GastoListService } from './gasto-list.service';
import { SharedModalService } from 'app/shared/components/shared-modal/shared-modal.service';
import { IModalConfig } from 'app/shared/interfaces/modal-config.interface';
import { IGasto } from 'app/shared/interfaces/gasto.interface';
import { ChartOptionsGastos } from 'app/shared/interfaces/chart-option-gastos.interfac';
import { colors } from 'app/colors.const';

@Component({
  selector: 'app-gasto-list',
  templateUrl: './gasto-list.component.html',
  styleUrls: ['./gasto-list.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class GastoListComponent implements OnInit {
  @ViewChild(DatatableComponent) table: DatatableComponent;
  public contentHeader: object;
  public sidebarToggleRef = false;
  public rows;
  public dataReportGraph;
  public selectedOption = 10;
  public temp = [];
  public searchValue = '';
  public ColumnMode = ColumnMode;
  public rowEdit: IGasto = {} as IGasto;
  public gastosReportChartOptions: Partial<ChartOptionsGastos>;
  public budgetChartoptions: Partial<ChartOptionsGastos>;
  public goalChartoptions: Partial<any>;
  private $textMutedColor = '#b9b9c3';
  private $budgetStrokeColor2 = '#dcdae3';
  private $goalStrokeColor2 = '#51e5a8';
  private $strokeColor = '#ebe9f1';
  private $textHeadingColor = '#5e5873';
  private tempData = [];
  public isMenuToggled = false;
  private _unsubscribeAll: Subject<any>;

  constructor(
    private _gastoListService: GastoListService,
    private _coreSidebarService: CoreSidebarService,
    private _loadMsgService: LoadMessageService,
    private _sharedModalService: SharedModalService
  ) {
    this._unsubscribeAll = new Subject();

    this.gastosReportChartOptions = {
      chart: {
        height: 230,
        stacked: true,
        type: 'bar',
        toolbar: { show: false }
      },
      plotOptions: {
        bar: {
          columnWidth: '17%',
          endingShape: 'rounded'
        }
      },
      colors: [colors.solid.warning, colors.solid.primary],
      dataLabels: {
        enabled: false
      },
      legend: {
        show: false
      },
      grid: {
        padding: {
          top: -20,
          bottom: -10
        },
        yaxis: {
          lines: { show: false }
        }
      },
      xaxis: {
        categories: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'],
        labels: {
          style: {
            colors: this.$textMutedColor,
            fontSize: '0.86rem'
          }
        },
        axisTicks: {
          show: false
        },
        axisBorder: {
          show: false
        }
      },
      yaxis: {
        labels: {
          style: {
            colors: this.$textMutedColor,
            fontSize: '0.86rem'
          }
        }
      }
    };

    this.budgetChartoptions = {
      chart: {
        height: 80,
        toolbar: { show: false },
        zoom: { enabled: false },
        type: 'line',
        sparkline: { enabled: true }
      },
      stroke: {
        curve: 'smooth',
        dashArray: [0, 5],
        width: [2]
      },
      colors: [colors.solid.primary, this.$budgetStrokeColor2],
      tooltip: {
        enabled: false
      }
    };

    this.goalChartoptions = {
      chart: {
        height: 245,
        type: 'radialBar',
        sparkline: {
          enabled: true
        },
        dropShadow: {
          enabled: true,
          blur: 3,
          left: 1,
          top: 1,
          opacity: 0.1
        }
      },
      colors: [this.$goalStrokeColor2],
      plotOptions: {
        radialBar: {
          offsetY: -10,
          startAngle: -150,
          endAngle: 150,
          hollow: {
            size: '77%'
          },
          track: {
            background: this.$strokeColor,
            strokeWidth: '50%'
          },
          dataLabels: {
            name: {
              show: false
            },
            value: {
              color: this.$textHeadingColor,
              fontSize: '2.86rem',
              fontWeight: '600'
            }
          }
        }
      },
      fill: {
        type: 'gradient',
        gradient: {
          shade: 'dark',
          type: 'horizontal',
          shadeIntensity: 0.5,
          gradientToColors: [colors.solid.success],
          inverseColors: true,
          opacityFrom: 1,
          opacityTo: 1,
          stops: [0, 100]
        }
      },
      stroke: {
        lineCap: 'round'
      },
      grid: {
        padding: {
          bottom: 30
        }
      }
    };
  }

  ngOnInit(): void {
    this.assignTitleBreadcrumbs();
    this._gastoListService.onGastoReportListChanged
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe(response => {
        this.dataReportGraph = response;
        this.rows = response.expensesList;
        this.tempData = this.rows;
      });
  }

  ngOnDestroy(): void {
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }

  assignTitleBreadcrumbs() {
    this.contentHeader = {
      headerTitle: 'Gastos',
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
            name: 'Gastos',
            isLink: false
          }
        ]
      }
    };
  }

  filterUpdate(event) {
    const val = event.target.value.toLowerCase();
    const temp = this.tempData.filter(function (d) {
      return d.nombre_gasto.toLowerCase().indexOf(val) !== -1 ||
        d.requerimiento_suelo.toLowerCase().indexOf(val) !== -1 || !val;
    });

    this.rows = temp;
    this.table.offset = 0;
  }

  onAddGasto(name): void {
    this._coreSidebarService.getSidebarRegistry(name).toggleOpen();
  }

  onEditGasto(name, row): void {
    this.rowEdit = row;
    this._coreSidebarService.getSidebarRegistry(name).toggleOpen();
  }

  onOpenDeleteModal(rowParam) {
    const configModal: IModalConfig = {
      type: 'danger',
      title: 'Eliminar gasto',
      isHTMLBody: true,
      bodyDescription: `¿Estas seguro de eliminar el concepto <strong>${rowParam.descripcion_gasto}</strong>?, recuerda que no se podrá recuperar la información asociada.`,
      hasPrimaryButton: true,
      primaryButtonText: 'Si, eliminar',
      primaryButtonAction: this.onDeleteGasto.bind(this, rowParam.id),
      hasSecondaryButton: true,
      secondaryButtonText: 'Cancelar',
      secondaryButtonAction: this.onCloseModal.bind(this)

    }
    this._sharedModalService.emitOpenModal(configModal);
  }

  onDeleteGasto(id) {
    this._gastoListService.deleteGasto(id)
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe(resp => {
        this._loadMsgService.showToastMsgSuccess(
          'Se eliminó el gasto correctamente',
          'Buen trabajo!',
        );
        this._gastoListService.getDataGastoList();
        this._loadMsgService.hideLoadingMsg();
        this.onCloseModal();
      });;
  }

  onCloseModal() {
    this._sharedModalService.emitCloseModal();
  }
}
