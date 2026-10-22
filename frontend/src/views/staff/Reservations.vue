<template>
  <div class="space-y-6">
    <!-- ============ KPIs ============ -->
    <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
      <div class="bg-white rounded-2xl shadow-card p-5">
        <div class="w-11 h-11 rounded-xl bg-primary-50 flex items-center justify-center mb-3">
          <i class="fa-solid fa-calendar-check text-primary-500"></i>
        </div>
        <div class="text-2xl font-extrabold text-dark-900">{{ reservations.length }}</div>
        <div class="text-dark-400 text-xs">Total réservations</div>
      </div>
      <div class="bg-white rounded-2xl shadow-card p-5">
        <div class="w-11 h-11 rounded-xl bg-yellow-50 flex items-center justify-center mb-3">
          <i class="fa-solid fa-clock text-yellow-600"></i>
        </div>
        <div class="text-2xl font-extrabold text-dark-900">{{ counts.pending }}</div>
        <div class="text-dark-400 text-xs">En attente</div>
      </div>
      <div class="bg-white rounded-2xl shadow-card p-5">
        <div class="w-11 h-11 rounded-xl bg-green-50 flex items-center justify-center mb-3">
          <i class="fa-solid fa-circle-check text-green-600"></i>
        </div>
        <div class="text-2xl font-extrabold text-dark-900">{{ counts.confirmed }}</div>
        <div class="text-dark-400 text-xs">Confirmées</div>
      </div>
      <div class="bg-white rounded-2xl shadow-card p-5">
        <div class="w-11 h-11 rounded-xl bg-blue-50 flex items-center justify-center mb-3">
          <i class="fa-solid fa-coins text-blue-600"></i>
        </div>
        <div class="text-2xl font-extrabold text-dark-900">{{ totalRevenue }}€</div>
        <div class="text-dark-400 text-xs">Revenus totaux</div>
      </div>
    </div>

    <!-- ============ FILTRES ============ -->
    <div class="bg-white rounded-2xl shadow-card p-4 flex flex-wrap gap-3 items-center">
      <div class="flex items-center gap-2 bg-soft-100 rounded-xl px-4 py-2.5 flex-1 min-w-[200px]">
        <i class="fa-solid fa-magnifying-glass text-dark-400"></i>
        <input
          v-model="search"
          type="text"
          placeholder="Rechercher par nom, référence, téléphone..."
          class="bg-transparent outline-none text-sm flex-1 text-dark-700"
        />
      </div>
      <select v-model="statusFilter" class="input-field !w-auto min-w-[180px]">
        <option value="">Tous les statuts</option>
        <option value="pending">En attente</option>
        <option value="confirmed">Confirmées</option>
        <option value="cancelled">Annulées</option>
        <option value="completed">Terminées</option>
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
              <th class="text-left py-4 px-5 font-bold text-dark-700 uppercase text-xs tracking-wider">Chambre</th>
              <th class="text-left py-4 px-5 font-bold text-dark-700 uppercase text-xs tracking-wider">Dates</th>
              <th class="text-right py-4 px-5 font-bold text-dark-700 uppercase text-xs tracking-wider">Total</th>
              <th class="text-center py-4 px-5 font-bold text-dark-700 uppercase text-xs tracking-wider">Statut</th>
              <th class="text-right py-4 px-5 font-bold text-dark-700 uppercase text-xs tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="r in filteredReservations"
              :key="r.id"
              class="border-t border-soft-200 hover:bg-soft-50 transition-colors"
            >
              <td class="py-4 px-5">
                <div class="font-mono font-bold text-dark-900 text-xs">{{ r.reference }}</div>
                <div class="text-dark-400 text-[10px]">{{ formatDate(r.created_at, true) }}</div>
              </td>
              <td class="py-4 px-5">
                <div class="font-semibold text-dark-900">{{ r.customer_name }}</div>
                <div class="text-dark-400 text-xs">{{ r.customer_phone }}</div>
              </td>
              <td class="py-4 px-5">
                <div class="text-dark-800">N° {{ r.room_number }}</div>
                <div class="text-dark-400 text-xs">{{ r.type_name }}</div>
              </td>
              <td class="py-4 px-5 text-xs">
                <div class="text-dark-700">
                  <i class="fa-solid fa-arrow-right text-primary-400 mx-1"></i>
                  {{ formatDate(r.check_in) }}
                </div>
                <div class="text-dark-500 mt-1">
                  <i class="fa-solid fa-arrow-left text-primary-400 mx-1"></i>
                  {{ formatDate(r.check_out) }}
                </div>
              </td>
              <td class="py-4 px-5 text-right">
                <span class="font-extrabold text-primary-500">{{ r.total_amount }}€</span>
              </td>
              <td class="py-4 px-5 text-center">
                <select
                  :value="r.status"
                  @change="changeStatus(r, $event.target.value)"
                  class="text-xs font-semibold rounded-lg border-2 px-2 py-1 cursor-pointer outline-none transition-colors"
                  :class="statusStyle(r.status)"
                >
                  <option value="pending">En attente</option>
                  <option value="confirmed">Confirmée</option>
                  <option value="completed">Terminée</option>
                  <option value="cancelled">Annulée</option>
                </select>
              </td>
              <td class="py-4 px-5 text-right">
                <div class="flex items-center justify-end gap-1">
                  <button
                    @click="openDetail(r)"
                    class="w-8 h-8 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-600 flex items-center justify-center transition-colors"
                    title="Voir détails"
                  >
                    <i class="fa-solid fa-eye text-xs"></i>
                  </button>
                  <router-link
                    :to="`/invoice/${r.id}`"
                    target="_blank"
                    class="w-8 h-8 rounded-lg bg-purple-50 hover:bg-purple-100 text-purple-600 flex items-center justify-center transition-colors"
                    title="Voir facture"
                  >
                    <i class="fa-solid fa-file-invoice text-xs"></i>
                  </router-link>
                  <button
                    @click="openDelete(r)"
                    class="w-8 h-8 rounded-lg bg-red-50 hover:bg-red-100 text-red-600 flex items-center justify-center transition-colors"
                    title="Supprimer"
                  >
                    <i class="fa-solid fa-trash text-xs"></i>
                  </button>
                </div>
              </td>
            </tr>
            <tr v-if="filteredReservations.length === 0">
              <td colspan="7" class="py-12 text-center text-dark-400">
                <i class="fa-solid fa-calendar-xmark text-3xl mb-2 block"></i>
                Aucune réservation trouvée
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div v-if="filteredReservations.length > 0" class="p-4 border-t border-soft-200 bg-soft-50 text-sm text-dark-500">
        <i class="fa-solid fa-circle-info text-primary-400 mr-1"></i>
        <strong>{{ filteredReservations.length }}</strong> réservation(s) affichée(s)
      </div>
    </div>

    <!-- ============ MODAL DÉTAIL ============ -->
    <Modal v-model="detailOpen" title="Détails de la réservation" :subtitle="detail?.reference">
      <div v-if="detail" class="space-y-5">
        <!-- Statut + total -->
        <div class="flex items-center justify-between p-4 rounded-xl bg-soft-100">
          <div>
            <div class="text-xs text-dark-400 uppercase font-bold mb-1">Statut</div>
            <span class="badge" :class="statusBadgeClass(detail.status)">
              {{ statusLabel(detail.status) }}
            </span>
          </div>
          <div class="text-right">
            <div class="text-xs text-dark-400 uppercase font-bold mb-1">Total</div>
            <div class="text-2xl font-extrabold text-primary-500">{{ detail.total_amount }}€</div>
          </div>
        </div>

        <!-- Client -->
        <div>
          <div class="text-xs font-bold text-primary-500 uppercase tracking-widest mb-3">
            <i class="fa-solid fa-user mr-1"></i> Client
          </div>
          <div class="bg-soft-50 rounded-xl p-4 space-y-2 text-sm">
            <div class="flex justify-between">
              <span class="text-dark-500">Nom</span>
              <span class="font-semibold text-dark-800">{{ detail.customer_name }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-dark-500">Email</span>
              <span class="text-dark-800">{{ detail.customer_email }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-dark-500">Téléphone</span>
              <span class="text-dark-800">{{ detail.customer_phone }}</span>
            </div>
          </div>
        </div>

        <!-- Séjour -->
        <div>
          <div class="text-xs font-bold text-primary-500 uppercase tracking-widest mb-3">
            <i class="fa-solid fa-bed mr-1"></i> Séjour
          </div>
          <div class="bg-soft-50 rounded-xl p-4 space-y-2 text-sm">
            <div class="flex justify-between">
              <span class="text-dark-500">Chambre</span>
              <span class="font-semibold text-dark-800">{{ detail.room_number }} — {{ detail.type_name }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-dark-500">Arrivée</span>
              <span class="text-dark-800">{{ formatDate(detail.check_in, false, true) }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-dark-500">Départ</span>
              <span class="text-dark-800">{{ formatDate(detail.check_out, false, true) }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-dark-500">Voyageurs</span>
              <span class="text-dark-800">{{ detail.guests }}</span>
            </div>
          </div>
        </div>

        <!-- Services -->
        <div v-if="detail.services && detail.services.length > 0">
          <div class="text-xs font-bold text-primary-500 uppercase tracking-widest mb-3">
            <i class="fa-solid fa-concierge-bell mr-1"></i> Services
          </div>
          <div class="bg-soft-50 rounded-xl p-4 space-y-2 text-sm">
            <div v-for="s in detail.services" :key="s.id" class="flex justify-between">
              <span class="text-dark-700">
                <i :class="s.icon" class="text-primary-400 mr-2"></i>
                {{ s.service_name }} × {{ s.quantity }}
              </span>
              <span class="font-semibold text-dark-800">{{ s.unit_price * s.quantity }}€</span>
            </div>
          </div>
        </div>

        <!-- Paiement -->
        <div v-if="detail.payment">
          <div class="text-xs font-bold text-primary-500 uppercase tracking-widest mb-3">
            <i class="fa-solid fa-credit-card mr-1"></i> Paiement
          </div>
          <div class="bg-green-50 border border-green-200 rounded-xl p-4 space-y-2 text-sm">
            <div class="flex justify-between">
              <span class="text-green-700">Méthode</span>
              <span class="font-semibold text-green-800 capitalize">{{ methodLabel(detail.payment.method) }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-green-700">Référence</span>
              <span class="font-mono font-semibold text-green-800 text-xs">{{ detail.payment.reference }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-green-700">Montant</span>
              <span class="font-extrabold text-green-800">{{ detail.payment.amount }}€</span>
            </div>
          </div>
        </div>
      </div>

      <template #footer>
        <div class="flex justify-end gap-3">
          <router-link
            v-if="detail"
            :to="`/invoice/${detail.id}`"
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

    <!-- ============ MODAL SUPPRESSION ============ -->
    <ConfirmDialog
      v-model="confirmOpen"
      title="Supprimer cette réservation ?"
      :message="`Voulez-vous vraiment supprimer la réservation ${selected?.reference} de ${selected?.customer_name} ?`"
      @confirm="deleteItem"
    />
  </div>
</template>

<script>
import { reservationsApi } from '../../services/api';
import Modal from '../../components/Modal.vue';
import ConfirmDialog from '../../components/ConfirmDialog.vue';

export default {
  name: 'StaffReservations',
  components: { Modal, ConfirmDialog },
  data() {
    return {
      loading: true,
      reservations: [],
      search: '',
      statusFilter: '',
      detailOpen: false,
      confirmOpen: false,
      detail: null,
      selected: null,
    };
  },
  computed: {
    counts() {
      return {
        pending: this.reservations.filter((r) => r.status === 'pending').length,
        confirmed: this.reservations.filter((r) => r.status === 'confirmed').length,
      };
    },
    totalRevenue() {
      return this.reservations
        .filter((r) => r.status === 'confirmed' || r.status === 'completed')
        .reduce((sum, r) => sum + r.total_amount, 0);
    },
    filteredReservations() {
      return this.reservations.filter((r) => {
        if (this.statusFilter && r.status !== this.statusFilter) return false;
        if (this.search) {
          const q = this.search.toLowerCase();
          return (
            r.customer_name.toLowerCase().includes(q) ||
            r.reference.toLowerCase().includes(q) ||
            (r.customer_phone || '').includes(q) ||
            (r.customer_email || '').toLowerCase().includes(q)
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
        const res = await reservationsApi.getAll();
        this.reservations = res.data;
      } catch (err) {
        console.error(err);
      } finally {
        this.loading = false;
      }
    },
    resetFilters() {
      this.search = '';
      this.statusFilter = '';
    },
    async openDetail(r) {
      try {
        const res = await reservationsApi.getById(r.id);
        this.detail = res.data;
        this.detailOpen = true;
      } catch (err) {
        alert('Impossible de charger les détails');
      }
    },
    openDelete(r) {
      this.selected = r;
      this.confirmOpen = true;
    },
    async deleteItem() {
      try {
        await reservationsApi.delete(this.selected.id);
        await this.fetch();
      } catch (err) {
        alert(err.response?.data?.error || 'Impossible de supprimer');
      }
    },
    async changeStatus(r, newStatus) {
      if (r.status === newStatus) return;
      try {
        await reservationsApi.update(r.id, { status: newStatus });
        r.status = newStatus;
      } catch (err) {
        alert('Erreur lors du changement de statut');
        await this.fetch();
      }
    },
    formatDate(d, withTime = false, full = false) {
      if (!d) return '';
      const opts = full
        ? { day: '2-digit', month: 'long', year: 'numeric' }
        : { day: '2-digit', month: 'short', year: 'numeric' };
      if (withTime) {
        opts.hour = '2-digit';
        opts.minute = '2-digit';
      }
      return new Date(d).toLocaleDateString('fr-FR', opts);
    },
    statusStyle(status) {
      const map = {
        pending: 'bg-yellow-50 text-yellow-700 border-yellow-200',
        confirmed: 'bg-green-50 text-green-700 border-green-200',
        cancelled: 'bg-red-50 text-red-700 border-red-200',
        completed: 'bg-gray-100 text-gray-700 border-gray-200',
      };
      return map[status] || map.pending;
    },
    statusBadgeClass(status) {
      const map = {
        pending: 'badge-orange',
        confirmed: 'badge-green',
        cancelled: 'badge-red',
        completed: 'badge-gray',
      };
      return map[status] || 'badge-gray';
    },
    statusLabel(status) {
      const map = {
        pending: 'En attente',
        confirmed: 'Confirmée',
        cancelled: 'Annulée',
        completed: 'Terminée',
      };
      return map[status] || status;
    },
    methodLabel(m) {
      return { card: 'Carte bancaire', cash: 'Espèces', transfer: 'Virement' }[m] || m;
    },
  },
};
</script>