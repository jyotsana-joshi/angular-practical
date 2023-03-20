import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DrilldownChartComponent } from './drilldown-chart.component';

describe('DrilldownChartComponent', () => {
  let component: DrilldownChartComponent;
  let fixture: ComponentFixture<DrilldownChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DrilldownChartComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DrilldownChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
