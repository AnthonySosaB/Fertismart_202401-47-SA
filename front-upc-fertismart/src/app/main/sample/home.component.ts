import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core'
import { HomeService } from './home.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { colors } from 'app/colors.const';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class HomeComponent implements OnInit, OnDestroy {
  public dashboardData: any;
  public currentUser: any;
  public isMenuToggled = true;
  public dataReportGraph;
  public gastosReportChartOptions;
  public budgetChartoptions;
  public earningChartoptions;
  private _unsubscribeAll: Subject<any>;

  private $primary = '#7367F0';
  private $warning = '#FF9F43';
  private $textMutedColor = '#b9b9c3';
  private $budgetStrokeColor2 = '#dcdae3';
  private $barColor = '#f3f3f3';
  private $trackBgColor = '#EBEBEB';
  private $goalStrokeColor2 = '#51e5a8';
  private $textHeadingColor = '#5e5873';
  private $strokeColor = '#ebe9f1';
  private $earningsStrokeColor2 = '#28c76f66';
  private $earningsStrokeColor3 = '#28c76f33';

  constructor(
    private _homeService: HomeService
  ) {
    this._unsubscribeAll = new Subject();

    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));

    this._homeService.onApiDataChanged
      .subscribe(response => {
        this.dashboardData = response;
      });

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

    this.earningChartoptions = {
      chart: {
        type: 'donut',
        height: 180,
        toolbar: {
          show: false
        }
      },
      dataLabels: {
        enabled: false
      },
      series: this.dashboardData.total_predicciones.series,
      legend: { show: false },
      labels: this.dashboardData.total_predicciones.labels,
      stroke: { width: 0 },
      colors: [colors.solid.success, this.$earningsStrokeColor2],
      grid: {
        padding: {
          right: -20,
          bottom: -8,
          left: -20
        }
      },
      plotOptions: {
        pie: {
          startAngle: 0,
          donut: {
            labels: {
              show: true,
              name: {
                offsetY: 15
              },
              value: {
                offsetY: -15,
                formatter: function (val) {
                  return parseInt(val) + '%';
                }
              },
              total: {
                show: true,
                offsetY: 15,
                label: 'Acertadas',
                formatter: function (w) {
                  return parseInt(w.globals.initialSeries[0]) + '%';
                }
              }
            }
          }
        }
      },
      responsive: [
        {
          breakpoint: 1325,
          options: {
            chart: {
              height: 100
            }
          }
        },
        {
          breakpoint: 1200,
          options: {
            chart: {
              height: 120
            }
          }
        },
        {
          breakpoint: 1065,
          options: {
            chart: {
              height: 100
            }
          }
        },
        {
          breakpoint: 992,
          options: {
            chart: {
              height: 120
            }
          }
        }
      ]
    };
  }

  ngOnDestroy(): void {
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }

  public contentHeader: object

  ngOnInit() {
    this.contentHeader = {
      headerTitle: 'Inicio',
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
            name: 'Tablero de control',
            isLink: false
          }
        ]
      }
    }

    this._homeService.onGastoReportListChanged
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe(response => {
        this.dataReportGraph = response;
      });
  }
}
