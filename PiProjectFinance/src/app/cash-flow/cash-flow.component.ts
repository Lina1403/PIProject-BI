import { Component, OnInit, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { CashFlowService } from '../services/cash-flow.service';
import Chart from 'chart.js/auto';

@Component({
  selector: 'app-cash-flow',
  templateUrl: './cash-flow.component.html',
  styleUrls: ['./cash-flow.component.scss']
})
export class CashFlowComponent implements OnInit, AfterViewInit {
  @ViewChild('cashChart') chartRef!: ElementRef;
  chart!: Chart;

  stores: string[] = [
    'Monoprix Paris', 'Monoprix Lyon', 'Monoprix Marseille', 'Monoprix Toulouse',
    'Monoprix Nice', 'Monoprix Bordeaux', 'Monoprix Lille', 'Monoprix Nantes',
    'Monoprix Montpellier', 'Monoprix Strasbourg', 'Monoprix Rennes', 'Monoprix Grenoble',
    'Monoprix Aix-en-Provence', 'Monoprix Dijon', 'Monoprix Le Havre', 'Monoprix Toulon',
    'Monoprix Saint-Étienne', 'Monoprix La Rochelle'
  ];

  formData = {
    store: '',
    sales_change: 0,
    inventory_change: 0,
    supplier_delay: 0
  };

  cashData: any[] = [];
  recommendation: string = '';
  hasDeficit: boolean = false;
  isLoading: boolean = false;
  submitted: boolean = false;

  selectedDate: string = '';
  selectedRow: any = null;

  sections = {
    store: true,
    parameters: true
  };

  constructor(private cashFlowService: CashFlowService) { }

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    if (this.cashData.length > 0) {
      this.createChart();
    }
  }

  toggleSection(section: string): void {
    this.sections[section] = !this.sections[section];
  }

  calculateProgress(): number {
    let completed = 0;
    const totalFields = 1; // Only store is required

    if (this.formData.store) completed++;

    return Math.round((completed / totalFields) * 100);
  }

  onSubmit(): void {
    this.submitted = true;

    if (!this.formData.store) {
      return;
    }

    this.isLoading = true;

    this.cashFlowService.getCashFlowData(this.formData).subscribe({
      next: (response: any) => {
        this.isLoading = false;
        if (response.status === 'success') {
          this.cashData = response.cash_data;
          this.recommendation = response.recommendation;
          this.hasDeficit = this.cashData.some(day => day.cash_shortage);

          if (this.cashData.length > 0) {
            this.selectedDate = this.cashData[0].date;
            this.selectedRow = this.cashData[0];
            setTimeout(() => this.createChart(), 0);
          }
        }
      },
      error: (err) => {
        this.isLoading = false;
        console.error('Error:', err);
      }
    });
  }

  updateSelectedRow(): void {
    this.selectedRow = this.cashData.find(day => day.date === this.selectedDate);
  }

  createChart(): void {
    if (this.chart) {
      this.chart.destroy();
    }

    const labels = this.cashData.map(day => day.date);
    const cashValues = this.cashData.map(day => day.cumulative_cash);

    this.chart = new Chart(this.chartRef.nativeElement, {
      type: 'line',
      data: {
        labels: labels,
        datasets: [{
          label: 'Cumulative Cash (€)',
          data: cashValues,
          borderColor: '#4361ee',
          backgroundColor: 'rgba(67, 97, 238, 0.1)',
          fill: true,
          tension: 0.3,
          borderWidth: 2
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          title: {
            display: true,
            text: '30-Day Cash Flow Forecast',
            font: {
              size: 16,
              weight: 'bold'
            }
          },
          tooltip: {
            mode: 'index',
            intersect: false
          },
          legend: {
            display: false
          }
        },
        scales: {
          y: {
            beginAtZero: false,
            title: {
              display: true,
              text: 'Amount (€)'
            }
          },
          x: {
            title: {
              display: true,
              text: 'Date'
            }
          }
        }
      }
    });
  }

  downloadPdf(): void {
    if (!this.cashData.length) return;

    const body = {
      store: this.formData.store,
      cash_data: this.cashData,
      recommendation: this.recommendation
    };

    this.cashFlowService.downloadPdf(body).subscribe({
      next: (blob: Blob) => {
        const blobUrl = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = blobUrl;
        a.download = `cashflow_${this.formData.store}.pdf`;
        a.style.display = 'none';
        document.body.appendChild(a);
        a.click();
        setTimeout(() => {
          document.body.removeChild(a);
          URL.revokeObjectURL(blobUrl);
        }, 100);
      },
      error: (err) => {
        console.error('PDF Error:', err);
      }
    });
  }
}
