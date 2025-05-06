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

  selectedDate: string = '';
  selectedRow: any = null;

  constructor(private cashFlowService: CashFlowService) { }

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    if (this.cashData.length > 0) {
      this.createChart();
    }
  }

  onSubmit(): void {
    if (!this.formData.store) {
      alert('Veuillez sélectionner un magasin');
      return;
    }

    this.cashFlowService.getCashFlowData(this.formData).subscribe({
      next: (response: any) => {
        if (response.status === 'success') {
          this.cashData = response.cash_data;
          this.recommendation = response.recommendation;

          if (this.cashData.length > 0) {
            this.selectedDate = this.cashData[0].date;
            this.selectedRow = this.cashData[0];
            setTimeout(() => this.createChart(), 0);
          }
        } else {
          console.error('Erreur du serveur:', response.message);
          alert('Erreur: ' + response.message);
        }
      },
      error: (err) => {
        console.error('Erreur HTTP:', err);
        alert('Une erreur est survenue lors de la communication avec le serveur');
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
          label: 'Trésorerie cumulée (€)',
          data: cashValues,
          borderColor: '#e60012',
          backgroundColor: 'rgba(230, 0, 18, 0.1)',
          fill: true,
          tension: 0.3
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          title: {
            display: true,
            text: 'Prévision de trésorerie - 30 prochains jours'
          },
          legend: {
            display: false
          }
        },
        scales: {
          y: {
            beginAtZero: false
          }
        }
      }
    });
  }


  downloadPdf(): void {
    if (!this.cashData.length) {
      alert('Aucune donnée à exporter');
      return;
    }

    const body = {
      store: this.formData.store,
      cash_data: this.cashData,
      recommendation: this.recommendation
    };

    console.log('Sending PDF request with data:', body); // Debug

    this.cashFlowService.downloadPdf(body).subscribe({
      next: (blob: Blob) => {
        if (blob.size === 0) {
          throw new Error('Received empty PDF blob');
        }

        const blobUrl = URL.createObjectURL(blob);

        // Testez si le blob est un PDF valide
        const reader = new FileReader();
        reader.onload = (e) => {
          const arr = new Uint8Array(e.target?.result as ArrayBuffer);
          const header = arr.subarray(0, 4).reduce((acc, byte) => acc + byte.toString(16), '');
          if (header !== '25504446') { // '%PDF' en hex
            throw new Error('Invalid PDF file received');
          }

          // Si valide, procédez au téléchargement
          const a = document.createElement('a');
          a.href = blobUrl;
          a.download = `cashflow_${this.formData.store}.pdf`;
          a.style.display = 'none';
          document.body.appendChild(a);
          a.click();

          // Nettoyage
          setTimeout(() => {
            document.body.removeChild(a);
            URL.revokeObjectURL(blobUrl);
          }, 100);
        };
        reader.readAsArrayBuffer(blob);
      },
      error: (err) => {
        console.error('PDF Error:', err);
        alert(`Échec du téléchargement: ${err.message || 'Erreur inconnue'}`);
      }
    });
  }
}
