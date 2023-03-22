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
  finalData: any = [];
  drillDownResult: any = [];
  yearData: any = [];
  constructor() { }

private prepareChartData() {
    let data = jsonData.data;
    let result: any = [];
    let months: any = [];
    let year: any = [];
    let sum: any = {};
    data.map((item: any) => {
      const reduceData = item.periods.reduce((acc: any, { year, amt, period }: any) => {
        if (!acc[year]) {
          acc[year] = amt;
          acc.period.push({ period, year })
        } else {
          acc[year] += amt;
          acc.period.push({ period, year })
        }
        return acc;
      }, { period: [] });
      result.push(reduceData);
    });
   
    for (let i = 0; i < result.length; i++) {
      let obj = result[i];
      for (let key in obj) {
        if (key in sum) {
          sum[key] += obj[key];
        } else {
          sum[key] = obj[key];
        }
      }
    }

    Object.keys(sum).map(res => {
      this.yearData.push({
        name: `${res}`,
        y: sum[res],
        drilldown: `${res}`
      });

    });
    this.yearData.splice(-1);

    result.map((item: any) => {
      item.period.map((r: any) => {
        months.push(r.period);
        year.push(r.year)
      })
    });
    const d = [... new Set(months)];
    const y = [... new Set(year)];

    this.filterData(d, y)
  }

  // filter data using period and year for drilldown
  filterData(period: any, year: any) {
    this.finalData = [];
    let data = jsonData.data;
    period.map((month: any) => {
      let total = 0;
      data.map((item: any) => {
        item.periods.map((itm: any) => {
          if (itm.period == month) {
            total += itm.amt;
          }
        });
      });

      this.finalData.push({ month, total });
    });
    const dataWithYear = this.finalData.map((d: any) => {
      const lastTwoDigits = d.month.slice(-2); // get last two digits of month
      const matchingYear = year.find((y: any) => lastTwoDigits == y % 100); // find matching year
      return {
        ...d,
        year: matchingYear ? matchingYear : null // add year property to object
      };
    });

    // create a new object for each year
    dataWithYear.forEach((item: any) => {
      const year = item.year.toString();;
      const existingObj = this.drillDownResult.find((obj: any) => obj.id === year);

      if (existingObj) {
        existingObj.data.push([item.month, item.total]);
      } else {
        this.drillDownResult.push({
          name: `${year}`,
          id: `${year}`,
          data: [[item.month, item.total]]
        });
      }
    });

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
          data: this.yearData
        },
      ],
      drilldown: {
        series: this.drillDownResult
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
