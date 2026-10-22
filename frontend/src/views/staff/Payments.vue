<template>
  <div class="space-y-6">
    <!-- ============ KPIs ============ -->
    <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
      <div class="bg-white rounded-2xl shadow-card p-5">
        <div class="w-11 h-11 rounded-xl bg-green-50 flex items-center justify-center mb-3">
          <i class="fa-solid fa-sack-dollar text-green-600"></i>
        </div>
        <div class="text-2xl font-extrabold text-dark-900">{{ totalAmount }}€</div>
        <div class="text-dark-400 text-xs">Total encaissé</div>
      </div>
      <div class="bg-white rounded-2xl shadow-card p-5">
        <div class="w-11 h-11 rounded-xl bg-blue-50 flex items-center justify-center mb-3">
          <i class="fa-solid fa-credit-card text-blue-600"></i>
        </div>
        <div class="text-2xl font-extrabold text-dark-900">{{ payments.length }}</div>
        <div class="text-dark-400 text-xs">Paiements totaux</div>
      </div>
      <div class="bg-white rounded-2xl shadow-card p-5">
        <div class="w-11 h-11 rounded-xl bg-primary-50 flex items-center justify-center mb-3">
          <i class="fa-solid fa-chart-simple text-primary-500"></i>
        </div>
        <div class="text-2xl font-extrabold text-dark-900">{{ avgAmount }}€</div>
        <div class="text-dark-400 text-xs">Panier moyen</div>
      </div>
      <div class="bg-white rounded-2xl shadow-card p-5">
        <div class="w-11 h-11 rounded-xl bg-purple-50 flex items-center justify-center mb-3">
          <i class="fa-solid fa-calendar-day text-purple-500"></i>
        </div>
        <div class="text-2xl font-extrabold text-dark-900">{{ todayCount }}</div>
        <div class="text-dark-400 text-xs">Paiements aujourd'hui</div>
      </div>
    </div>

    <!-- ============ FILTRES ============ -->
    <div class="bg-white rounded-2xl shadow-card p-4 flex flex-wrap gap-3 items-center">
      <div class="flex items-center gap-2 bg-soft-100 rounded-xl px-4 py-2.5 flex-1 min-w-[200px]">
        <i class="fa-solid fa-magnifying-glass text-dark-400"></i>
        <input
          v-model="search"
          type="text"
          placeholder="Rechercher par référence, client..."
          class="bg-transparent outline-none text-sm flex-1 text-dark-700"
        />
      </div>
      <select v-model="methodFilter" class="input-field !w-auto min-w-[160px]">
        <option value="">Toutes méthodes</option>
        <option value="card">Carte bancaire</option>
        <option value="cash">Espèces</option>
        <option value="transfer">Virement</option>
      </select>
      <select v-model="statusFilter" class="input-field !w-auto min-w-[140px]">
        <option value="">Tous statuts</option>
        <option value="completed">Complétés</option>
        <option value="pending">En attente</option>
        <option value="failed">Échoués</option>
      </select>
      <button @click="resetFilters" class="btn-outline text-sm !px-4 !py-2.5">
        <i class="fa-solid fa-rotate-left mr-2"></i>
        Réinitialiser
      </button>
    </div>

    <!-- ============ TABLEAU ============ -->
    <div v-if="loading" class="flex justify-center py-20">
      <div class="animate-spin rounded-full h-12 w-12 border-4 border-primary-400 border-t-transparent"></div>
    </div>

    <div v-else class="bg-white rounded-2xl shadow-card overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full text-sm">
          <thead class="bg-soft-100">
            <tr>
              <th class="text-left py-4 px-5 font-bold text-dark-700 uppercase text-xs tracking-wider">Référence</th>
              <th class="text-left py-4 px-5 font-bold text-dark-700 uppercase text-xs tracking-wider">Client</th>
              <th class="text-left py-4 px-5 font-bold text-dark-700 uppercase text-xs tracking-wider">Réservation</th>
              <th class="text-center py-4 px-5 font-bold text-dark-700 uppercase text-xs tracking-wider">Méthode</th>
              <th class="text-right py-4 px-5 font-bold text-dark-700 uppercase text-xs tracking-wider">Montant</th>
              <th class="text-center py-4 px-5 font-bold text-dark-700 uppercase text-xs tracking-wider">Statut</th>
              <th class="text-left py-4 px-5 font-bold text-dark-700 uppercase text-xs tracking-wider">Date</th>
              <th class="text-right py-4 px-5 font-bold text-dark-700 uppercase text-xs tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="p in filteredPayments"
              :key="p.id"
              class="border-t border-soft-200 hover:bg-soft-50 transition-colors"
            >
              <td class="py-4 px-5">
                <div class="font-mono font-bold text-dark-900 text-xs">{{ p.reference }}</div>
              </td>
              <td class="py-4 px-5">
                <div class="font-semibold text-dark-900">{{ p.customer_name }}</div>
              </td>
              <td class="py-4 px-5">
                <span class="text-xs text-dark-600 font-mono">{{ p.reservation_reference }}</span>
              </td>
              <td class="py-4 px-5 text-center">
                <span class="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-lg" :class="methodClass(p.method)">
                  <i :class="methodIcon(p.method)"></i>
                  {{ methodLabel(p.method) }}
                </span>
              </td>
              <td class="py-4 px-5 text-right">
                <span class="font-extrabold text-primary-500">{{ p.amount }}€</span>
              </td>
              <td class="py-4 px-5 text-center">
                <span class="badge" :class="statusClass(p.status)">
                  {{ statusLabel(p.status) }}
                </span>
              </td>
              <td class="py-4 px-5 text-xs text-dark-500">
                {{ formatDate(p.paid_at || p.created_at, true) }}
              </td>
              <td class="py-4 px-5 text-right">
                <div class="flex items-center justify-end gap-1">
                  <button
                    @click="openDetail(p)"
                    class="w-8 h-8 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-600 flex items-center justify-center transition-colors"
                    title="Détails"
                  >
                    <i class="fa-solid fa-eye text-xs"></i>
                  </button>
                  <router-link
                    :to="`/invoice/${p.reservation_id}`"
                    target="_blank"
                    class="w-8 h-8 rounded-lg bg-purple-50 hover:bg-purple-100 text-purple-600 flex items-center justify-center transition-colors"
                    title="Facture"
                  >
                    <i class="fa-solid fa-file-invoice text-xs"></i>
                  </router-link>
                </div>
              </td>
            </tr>
            <tr v-if="filteredPayments.length === 0">
              <td colspan="8" class="py-12 text-center text-dark-400">
                <i class="fa-solid fa-credit-card text-3xl mb-2 block"></i>
                Aucun paiement trouvé
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div v-if="filteredPayments.length > 0" class="p-4 border-t border-soft-200 bg-soft-50 text-sm text-dark-500">
        <i class="fa-solid fa-circle-info text-primary-400 mr-1"></i>
        <strong>{{ filteredPayments.length }}</strong> paiement(s) affiché(s)
      </div>
    </div>

    <!-- ============ MODAL DÉTAIL ============ -->
    <Modal v-model="detailOpen" title="Détails du paiement" :subtitle="detail?.reference">
      <div v-if="detail" class="space-y-5">
        <!-- Montant en gros -->
        <div class="text-center p-6 rounded-xl bg-gradient-to-br from-primary-50 to-primary-100 border border-primary-200">
          <div class="text-xs text-primary-600 uppercase font-bold mb-2">Montant payé</div>
          <div class="text-4xl font-extrabold text-primary-600">{{ detail.amount }}€</div>
          <div class="mt-3">
            <span class="badge" :class="statusClass(detail.status)">
              {{ statusLabel(detail.status) }}
            </span>
          </div>
        </div>

        <div>
          <div class="text-xs font-bold text-primary-500 uppercase tracking-widest mb-3">
            <i class="fa-solid fa-receipt mr-1"></i> Informations
          </div>
          <div class="bg-soft-50 rounded-xl p-4 space-y-2 text-sm">
            <div class="flex justify-between">
              <span class="text-dark-500">Référence</span>
              <span class="font-mono font-semibold text-dark-800 text-xs">{{ detail.reference }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-dark-500">Méthode</span>
              <span class="font-semibold text-dark-800">{{ methodLabel(detail.method) }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-dark-500">Réservation liée</span>
              <span class="font-mono text-xs text-dark-800">{{ detail.reservation_reference }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-dark-500">Payé le</span>
              <span class="text-dark-800">{{ formatDate(detail.paid_at || detail.created_at, true) }}</span>
            </div>
          </div>
        </div>

        <div>
          <div class="text-xs font-bold text-primary-500 uppercase tracking-widest mb-3">
            <i class="fa-solid fa-user mr-1"></i> Client
          </div>
          <div class="bg-soft-50 rounded-xl p-4 space-y-2 text-sm">
            <div class="flex justify-between">
              <span class="text-dark-500">Nom</span>
              <span class="font-semibold text-dark-800">{{ detail.customer_name }}</span>
            </div>
          </div>
        </div>
      </div>

      <template #footer>
        <div class="flex justify-end gap-3">
          <router-link
            v-if="detail"
            :to="`/invoice/${detail.reservation_id}`"
            target="_blank"
            class="btn-outline !px-5 !py-2.5 text-sm"
          >
            <i class="fa-solid fa-file-invoice mr-2"></i>
            Voir facture
          </router-link>
          <button @click="detailOpen = false" class="btn-primary !px-5 !py-2.5 text-sm">
            Fermer
          </button>
        </div>
      </template>
    </Modal>
  </div>
</template>

<script>
import { paymentsApi } from '../../services/api';
import Modal from '../../components/Modal.vue';

export default {
  name: 'StaffPayments',
  components: { Modal },
  data() {
    return {
      loading: true,
      payments: [],
      search: '',
      methodFilter: '',
      statusFilter: '',
      detailOpen: false,
      detail: null,
    };
  },
  computed: {
    totalAmount() {
      return this.payments
        .filter((p) => p.status === 'completed')
        .reduce((sum, p) => sum + p.amount, 0);
    },
    avgAmount() {
      if (this.payments.length === 0) return 0;
      const total = this.payments.reduce((s, p) => s + p.amount, 0);
      return Math.round(total / this.payments.length);
    },
    todayCount() {
      const today = new Date().toISOString().slice(0, 10);
      return this.payments.filter((p) => {
        const d = (p.paid_at || p.created_at || '').slice(0, 10);
        return d === today;
      }).length;
    },
    filteredPayments() {
      return this.payments.filter((p) => {
        if (this.methodFilter && p.method !== this.methodFilter) return false;
        if (this.statusFilter && p.status !== this.statusFilter) return false;
        if (this.search) {
          const q = this.search.toLowerCase();
          return (
            (p.reference || '').toLowerCase().includes(q) ||
            (p.reservation_reference || '').toLowerCase().includes(q) ||
            (p.customer_name || '').toLowerCase().includes(q)
          );
        }
        return true;
      });
    },
  },
  async mounted() {
    await this.fetch();
  },
  methods: {
    async fetch() {
      this.loading = true;
      try {
        const res = await paymentsApi.getAll();
        this.payments = res.data;
      } catch (err) {
        console.error(err);
      } finally {
        this.loading = false;
      }
    },
    resetFilters() {
      this.search = '';
      this.methodFilter = '';
      this.statusFilter = '';
    },
    openDetail(p) {
      this.detail = p;
      this.detailOpen = true;
    },
    formatDate(d, withTime = false) {
      if (!d) return '—';
      const opts = { day: '2-digit', month: 'short', year: 'numeric' };
      if (withTime) {
        opts.hour = '2-digit';
        opts.minute = '2-digit';
      }
      return new Date(d).toLocaleDateString('fr-FR', opts);
    },
    methodLabel(m) {
      return { card: 'Carte', cash: 'Espèces', transfer: 'Virement' }[m] || m;
    },
    methodIcon(m) {
      return {
        card: 'fa-solid fa-credit-card',
        cash: 'fa-solid fa-money-bill-wave',
        transfer: 'fa-solid fa-building-columns',
      }[m] || 'fa-solid fa-circle';
    },
    methodClass(m) {
      return {
        card: 'bg-blue-50 text-blue-700',
        cash: 'bg-green-50 text-green-700',
        transfer: 'bg-purple-50 text-purple-700',
      }[m] || 'bg-gray-100 text-gray-700';
    },
    statusLabel(s) {
      return { completed: 'Complété', pending: 'En attente', failed: 'Échoué' }[s] || s;
    },
    statusClass(s) {
      return {
        completed: 'badge-green',
        pending: 'badge-orange',
        failed: 'badge-red',
      }[s] || 'badge-gray';
    },
  },
};
</script>