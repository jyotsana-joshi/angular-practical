import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DrilldownChartComponent } from './components/drilldown-chart/drilldown-chart.component';

const routes: Routes = [
  {
    path:'', component:DrilldownChartComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
