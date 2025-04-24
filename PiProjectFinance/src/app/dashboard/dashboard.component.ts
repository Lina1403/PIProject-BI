import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-dashboard',
  template: `
    <div class="page-header">
      <h3 class="page-title">Dashboard</h3>
    </div>
    <div class="row">
      <div class="col-12">
        <div class="card">
          <div class="card-body">
            <h4 class="card-title">Power BI Report</h4>
            <iframe
              [src]="powerBIUrl | safe"
              title="Power BI Report"
              width="100%"
              height="600px"
              style="border: none;"
              allowfullscreen="true"
            ></iframe>
          </div>
        </div>
      </div>
    </div>
  `,
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  powerBIUrl: string;

  constructor() {}

  ngOnInit(): void {
    // URL du rapport Power BI
    this.powerBIUrl =
      'https://app.powerbi.com/reportEmbed?reportId=de9745aa-ee3c-48b1-a96c-adb5d6051d73&autoAuth=true&ctid=604f1a96-cbe8-43f8-abbf-f8eaf5d85730';
  }
}
