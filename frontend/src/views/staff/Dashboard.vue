<template>
  <div class="space-y-6">
    <!-- Loading -->
    <div v-if="loading" class="flex justify-center py-20">
      <div class="animate-spin rounded-full h-14 w-14 border-4 border-primary-400 border-t-transparent"></div>
    </div>

    <!-- Erreur -->
    <div v-else-if="error" class="bg-red-50 border border-red-200 rounded-2xl p-6 text-center">
      <i class="fa-solid fa-triangle-exclamation text-4xl text-red-500 mb-3"></i>
      <p class="text-red-700">{{ error }}</p>
      <button @click="fetchStats" class="btn-primary mt-4">
        <i class="fa-solid fa-rotate-right mr-2"></i>
        Réessayer
      </button>
    </div>

    <template v-else>
      <!-- ============ KPI CARDS ============ -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div v-for="(kpi, i) in kpis" :key="i" class="bg-white rounded-2xl shadow-card p-5 hover:shadow-luxe transition-all">
          <div class="flex items-start justify-between mb-3">
            <div class="w-11 h-11 rounded-xl flex items-center justify-center" :class="kpi.bgColor">
              <i :class="[kpi.icon, kpi.iconColor]"></i>
            </div>
            <span v-if="kpi.trend" class="text-xs font-bold px-2 py-1 rounded-full bg-green-100 text-green-700">
              <i class="fa-solid fa-arrow-up mr-1"></i>{{ kpi.trend }}
            </span>
          </div>
          <div class="text-2xl font-extrabold text-dark-900 mb-1">{{ kpi.value }}</div>
          <div class="text-dark-400 text-xs font-medium">{{ kpi.label }}</div>
        </div>
      </div>

      <!-- ============ CHARTS ROW 1 ============ -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <!-- Revenus (Line) -->
        <div class="lg:col-span-2 bg-white rounded-2xl shadow-card p-5">
          <div class="flex items-center justify-between mb-4">
            <div>
              <h3 class="font-bold text-dark-900">Revenus mensuels</h3>
              <p class="text-dark-400 text-xs">6 derniers mois</p>
            </div>
            <div class="text-2xl font-extrabold text-primary-500">
              {{ stats.totals.revenue }}€
            </div>
          </div>
          <div style="height: 260px;">
            <Line :data="revenueChartData" :options="lineOptions" />
          </div>
        </div>

        <!-- Réservations par statut (Doughnut) -->
        <div class="bg-white rounded-2xl shadow-card p-5">
          <div class="mb-4">
            <h3 class="font-bold text-dark-900">Réservations</h3>
            <p class="text-dark-400 text-xs">Par statut</p>
          </div>
          <div style="height: 260px;">
            <Doughnut :data="statusChartData" :options="doughnutOptions" />
          </div>
        </div>
      </div>

      <!-- ============ CHARTS ROW 2 ============ -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <!-- Chambres par type (Bar) -->
        <div class="lg:col-span-2 bg-white rounded-2xl shadow-card p-5">
          <div class="mb-4">
            <h3 class="font-bold text-dark-900">Chambres par type</h3>
            <p class="text-dark-400 text-xs">Répartition de l'inventaire</p>
          </div>
          <div style="height: 240px;">
            <Bar :data="roomsChartData" :options="barOptions" />
          </div>
        </div>

        <!-- Taux d'occupation -->
        <div class="bg-white rounded-2xl shadow-card p-5 flex flex-col">
          <h3 class="font-bold text-dark-900 mb-1">Taux d'occupation</h3>
          <p class="text-dark-400 text-xs mb-4">Chambres occupées actuellement</p>

          <div class="flex-1 flex items-center justify-center">
            <div class="relative w-40 h-40">
              <svg class="transform -rotate-90" width="160" height="160">
                <circle cx="80" cy="80" r="70" stroke="#F3EEE7" stroke-width="12" fill="none" />
                <circle
                  cx="80" cy="80" r="70"
                  stroke="#F5A623" stroke-width="12" fill="none"
                  stroke-linecap="round"
                  :stroke-dasharray="circumference"
                  :stroke-dashoffset="dashOffset"
                  class="transition-all duration-1000"
                />
              </svg>
              <div class="absolute inset-0 flex flex-col items-center justify-center">
                <div class="text-3xl font-extrabold text-dark-900">
                  {{ stats.totals.occupancyRate }}%
                </div>
                <div class="text-xs text-dark-400 font-medium">occupation</div>
              </div>
            </div>
          </div>

          <div class="grid grid-cols-2 gap-3 mt-4 pt-4 border-t border-soft-200 text-center">
            <div>
              <div class="text-xl font-extrabold text-green-600">{{ stats.totals.availableRooms }}</div>
              <div class="text-xs text-dark-400">Disponibles</div>
            </div>
            <div>
              <div class="text-xl font-extrabold text-primary-500">{{ stats.totals.occupiedRooms }}</div>
              <div class="text-xs text-dark-400">Occupées</div>
            </div>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<script>
import { statsApi } from '../../services/api';
import { Line, Bar, Doughnut } from 'vue-chartjs';
import {
  Chart as ChartJS,
  CategoryScale, LinearScale, PointElement, LineElement, BarElement,
  ArcElement, Title, Tooltip, Legend, Filler,
} from 'chart.js';

ChartJS.register(
  CategoryScale, LinearScale, PointElement, LineElement, BarElement,
  ArcElement, Title, Tooltip, Legend, Filler
);

export default {
  name: 'StaffDashboard',
  components: { Line, Bar, Doughnut },
  data() {
    return {
      loading: true,
      error: null,
      stats: {
        totals: { rooms: 0, reservations: 0, revenue: 0, availableRooms: 0, occupiedRooms: 0, occupancyRate: 0 },
        revenueByMonth: [],
        reservationsByStatus: [],
        roomsByType: [],
      },
    };
  },
  computed: {
    kpis() {
      return [
        {
          label: 'Chambres totales',
          value: this.stats.totals.rooms,
          icon: 'fa-solid fa-bed',
          bgColor: 'bg-primary-50',
          iconColor: 'text-primary-500',
        },
        {
          label: 'Réservations',
          value: this.stats.totals.reservations,
          icon: 'fa-solid fa-calendar-check',
          bgColor: 'bg-blue-50',
          iconColor: 'text-blue-500',
        },
        {
          label: 'Revenus totaux',
          value: this.stats.totals.revenue + '€',
          icon: 'fa-solid fa-coins',
          bgColor: 'bg-green-50',
          iconColor: 'text-green-600',
          trend: '+12%',
        },
        {
          label: 'Taux d\'occupation',
          value: this.stats.totals.occupancyRate + '%',
          icon: 'fa-solid fa-percent',
          bgColor: 'bg-purple-50',
          iconColor: 'text-purple-500',
        },
      ];
    },
    revenueChartData() {
      const months = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Août', 'Sep', 'Oct', 'Nov', 'Déc'];
      const labels = this.stats.revenueByMonth.map((item) => {
        const [year, month] = item.month.split('-');
        return months[parseInt(month) - 1] + ' ' + year.slice(2);
      });
      const values = this.stats.revenueByMonth.map((item) => item.total);

      return {
        labels: labels.length ? labels : ['Aucune donnée'],
        datasets: [{
          label: 'Revenus (€)',
          data: values.length ? values : [0],
          borderColor: '#F5A623',
          backgroundColor: 'rgba(245, 166, 35, 0.1)',
          borderWidth: 3,
          tension: 0.4,
          fill: true,
          pointBackgroundColor: '#F5A623',
          pointBorderColor: '#fff',
          pointBorderWidth: 2,
          pointRadius: 6,
          pointHoverRadius: 8,
        }],
      };
    },
    statusChartData() {
      const statusMap = {
        pending: { label: 'En attente', color: '#F5A623' },
        confirmed: { label: 'Confirmées', color: '#10B981' },
        cancelled: { label: 'Annulées', color: '#EF4444' },
        completed: { label: 'Terminées', color: '#6B7280' },
      };
      const labels = [];
      const values = [];
      const colors = [];
      this.stats.reservationsByStatus.forEach((item) => {
        const cfg = statusMap[item.status] || { label: item.status, color: '#9CA3AF' };
        labels.push(cfg.label);
        values.push(item.count);
        colors.push(cfg.color);
      });

      return {
        labels: labels.length ? labels : ['Aucune'],
        datasets: [{
          data: values.length ? values : [1],
          backgroundColor: colors.length ? colors : ['#E5E5E5'],
          borderWidth: 0,
          hoverOffset: 8,
        }],
      };
    },
    roomsChartData() {
      const labels = this.stats.roomsByType.map((item) => item.name);
      const values = this.stats.roomsByType.map((item) => item.count);

      return {
        labels,
        datasets: [{
          label: 'Nombre de chambres',
          data: values,
          backgroundColor: ['#F5A623', '#1A1A1A', '#10B981', '#6B7280'],
          borderRadius: 8,
          barThickness: 40,
        }],
      };
    },
    lineOptions() {
      return {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: {
            backgroundColor: '#1A1A1A',
            padding: 12,
            cornerRadius: 8,
            callbacks: {
              label: (ctx) => ` ${ctx.parsed.y}€`,
            },
          },
        },
        scales: {
          y: {
            beginAtZero: true,
            grid: { color: '#F7F7F7' },
            ticks: { color: '#737373' },
          },
          x: {
            grid: { display: false },
            ticks: { color: '#737373' },
          },
        },
      };
    },
    barOptions() {
      return {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: {
          y: {
            beginAtZero: true,
            grid: { color: '#F7F7F7' },
            ticks: { color: '#737373', stepSize: 1 },
          },
          x: {
            grid: { display: false },
            ticks: { color: '#737373' },
          },
        },
      };
    },
    doughnutOptions() {
      return {
        responsive: true,
        maintainAspectRatio: false,
        cutout: '70%',
        plugins: {
          legend: {
            position: 'bottom',
            labels: {
              padding: 15,
              font: { size: 12 },
              color: '#2D2D2D',
              usePointStyle: true,
              pointStyle: 'circle',
            },
          },
        },
      };
    },
    circumference() {
      return 2 * Math.PI * 70;
    },
    dashOffset() {
      const percent = this.stats.totals.occupancyRate / 100;
      return this.circumference * (1 - percent);
    },
  },
  async mounted() {
    await this.fetchStats();
  },
  methods: {
    async fetchStats() {
      this.loading = true;
      this.error = null;
      try {
        const res = await statsApi.getDashboard();
        this.stats = res.data;
      } catch (err) {
        this.error = 'Impossible de charger les statistiques. Vérifiez le backend.';
        console.error(err);
      } finally {
        this.loading = false;
      }
    },
  },
};
</script>