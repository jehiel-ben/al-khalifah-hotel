<template>
  <div class="bg-soft-100 min-h-screen py-12">
    <div class="max-w-5xl mx-auto px-4">
      <div class="text-center mb-10" data-aos="fade-up">
        <div class="section-subtitle">Historique</div>
        <h1 class="section-title">Mes réservations</h1>
      </div>

      <div v-if="loading" class="flex justify-center py-20">
        <div class="animate-spin rounded-full h-14 w-14 border-4 border-primary-400 border-t-transparent"></div>
      </div>

      <div v-else-if="reservations.length === 0" class="text-center py-20 bg-white rounded-2xl shadow-card">
        <div class="w-20 h-20 mx-auto mb-6 rounded-full bg-soft-200 flex items-center justify-center">
          <i class="fa-solid fa-calendar-xmark text-3xl text-dark-300"></i>
        </div>
        <h3 class="text-2xl font-bold text-dark-800 mb-2">Aucune réservation</h3>
        <p class="text-dark-500 mb-6">Vous n'avez pas encore réservé de chambre.</p>
        <router-link to="/rooms" class="btn-primary">
          <i class="fa-solid fa-bed mr-2"></i>
          Voir les chambres
        </router-link>
      </div>

      <div v-else class="space-y-4">
        <div
          v-for="r in reservations"
          :key="r.id"
          class="bg-white rounded-2xl shadow-card p-6 hover:shadow-luxe transition-all"
          data-aos="fade-up"
        >
          <div class="flex flex-wrap items-center justify-between gap-4">
            <div class="flex items-center gap-4">
              <div class="w-14 h-14 rounded-xl bg-primary-50 flex items-center justify-center">
                <i class="fa-solid fa-bed text-primary-400 text-xl"></i>
              </div>
              <div>
                <div class="font-bold text-dark-900 text-lg">
                  Chambre {{ r.room_number }} — {{ r.type_name }}
                </div>
                <div class="text-dark-400 text-sm">
                  Réf. {{ r.reference }} • {{ formatDate(r.check_in) }} → {{ formatDate(r.check_out) }}
                </div>
              </div>
            </div>
            <div class="flex items-center gap-3">
              <span
                class="badge"
                :class="{
                  'badge-green': r.status === 'confirmed',
                  'badge-orange': r.status === 'pending',
                  'badge-gray': r.status === 'cancelled' || r.status === 'completed',
                }"
              >
                {{ statusLabel(r.status) }}
              </span>
              <div class="text-2xl font-extrabold text-primary-500">{{ r.total_amount }}€</div>
              <router-link :to="`/invoice/${r.id}`" class="btn-outline text-sm !px-3 !py-2">
                <i class="fa-solid fa-file-invoice"></i>
              </router-link>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { reservationsApi } from '../../services/api';

export default {
  name: 'MyReservations',
  data() {
    return { loading: true, reservations: [] };
  },
  async mounted() {
    try {
      const res = await reservationsApi.getAll();
      this.reservations = res.data;
    } catch (err) {
      console.error(err);
    } finally {
      this.loading = false;
    }
  },
  methods: {
    formatDate(d) {
      if (!d) return '';
      return new Date(d).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' });
    },
    statusLabel(s) {
      const map = { pending: 'En attente', confirmed: 'Confirmée', cancelled: 'Annulée', completed: 'Terminée' };
      return map[s] || s;
    },
  },
};
</script>