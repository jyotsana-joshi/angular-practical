import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import * as Highcharts from 'highcharts';
import Drilldown from 'highcharts/modules/drilldown';
import jsonData from '../../../assets/demo.json';
Drilldown(Highcharts);

@Component({
  selector: 'app-drilldown-chart',
  templateUrl: './drilldown-chart.component.html',
  styleUrls: ['./drilldown-chart.component.css']
})
export class DrilldownChartComponent implements OnInit {

  @ViewChild('chart', { static: true }) chartElement!: ElementRef;

  private chart!: Highcharts.Chart;
  options: any
  amount2020: number = 0;
  amount2021: number = 0;
  amount2022: number = 0;
  amount2023: number = 0;
  finalData: any = []
  dataOf20 = ['Jan 20', 'Feb 20', 'Mar 20', 'Apr 20', 'May 20', 'Jun 20', 'Jul 20', 'Aug 20', 'Sep 20', 'Oct 20', 'Nov 20', 'Dec 20',]
  dataOf21 = ['Jan 21', 'Feb 21', 'Mar 21', 'Apr 21', 'May 21', 'Jun 21', 'Jul 21', 'Aug 21', 'Sep 21', 'Oct 21', 'Nov 21', 'Dec 21',]
  dataOf22 = ['Jan 22', 'Feb 22', 'Mar 22', 'Apr 22', 'May 22', 'Jun 22', 'Jul 22', 'Aug 22', 'Sep 22', 'Oct 22', 'Nov 22', 'Dec 22',]
  dataOf23 = ['Jan 23', 'Feb 23', 'Mar 23', 'Apr 23', 'May 23', 'Jun 23', 'Jul 23', 'Aug 23', 'Sep 23', 'Oct 23', 'Nov 23', 'Dec 23',]

  constructor() { }

  async prepareChartData() {

    let data = jsonData.data
    data.map((item: any) => {
      item.periods.map((x: any) => {
        if (x.year == 2020) {
          this.amount2020 += x.amt;
        } else if (x.year == 2021) {
          this.amount2021 += x.amt;
        } else if (x.year == 2022) {
          this.amount2022 += x.amt;
        } else if (x.year == 2023) {
          this.amount2023 += x.amt;
        }
      });
    });

  }

  filterData(period: any) {
    this.finalData = [];
    let data = jsonData.data
    period.map((month: any) => {
      let total = 0;
      data.map((item: any) => {
        item.periods.map((itm: any) => {
          if (itm.period == month) {
            total += itm.amt;
          }
        })
      });
      this.finalData.push([month, total]);
    });
    return this.finalData
  }


  ngOnInit(): void {
    this.prepareChartData();
  }

  ngAfterViewInit() {
    this.options = {
      chart: {
        type: 'spline',
    },
      title: {
        text: 'Revenue by Year and Month',
      },
      xAxis: {
        type: 'category',
      },
      yAxis: {
        title: {
          text: 'Revenue',
        },
      },
    
      plotOptions: {
        line: {
          marker: {
            enabled: true
          },
          lineWidth: 3,
          states: {
            hover: {
              lineWidth: 3
            }
          }
        }
      },
      series: [
        {
          name: 'Year',
          data: [
            {
              name: '2020',
              y: this.amount2020,
              drilldown: '2020',
            },
            {
              name: '2021',
              y: this.amount2021,
              drilldown: '2021',
            },
            {
              name: '2022',
              y: this.amount2022,
              drilldown: '2022',
            },
            {
              name: '2023',
              y: this.amount2023,
              drilldown: '2023',
            },
          ],
        },
      ],
      drilldown: {
        series: [
          {
            name: '2020',
            id: '2020',
            data: this.filterData(this.dataOf20)
          },
          {
            name: '2021',
            id: '2021',
            data: this.filterData(this.dataOf21)
          },
          {
            name: '2022',
            id: '2022',
            data: this.filterData(this.dataOf22)
          },
          {
            name: '2023',
            id: '2023',
            data: this.filterData(this.dataOf23)
          },
        ],
      },
      tooltip: {
        backgroundColor: '#FFFFFF',
        borderColor: '#000000',
        borderRadius: 5,
        padding: 10     
      },
    }
    this.chart = Highcharts.chart(this.chartElement.nativeElement, this.options);
  }

  ngOnDestroy(): void {
    this.chart.destroy();
  }
}
