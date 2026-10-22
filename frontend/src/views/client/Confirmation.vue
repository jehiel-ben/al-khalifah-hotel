<template>
  <div class="bg-soft-100 min-h-screen">
    <section class="py-16">
      <div class="max-w-3xl mx-auto px-4">
        <!-- Loading -->
        <div v-if="loading" class="flex justify-center py-20">
          <div class="animate-spin rounded-full h-14 w-14 border-4 border-primary-400 border-t-transparent"></div>
        </div>

        <!-- Erreur -->
        <div v-else-if="error" class="text-center py-20">
          <i class="fa-solid fa-triangle-exclamation text-5xl text-red-500 mb-4"></i>
          <p class="text-dark-600">{{ error }}</p>
        </div>

        <!-- Contenu -->
        <div v-else>
          <!-- Carte succès -->
          <div class="bg-white rounded-3xl shadow-luxe p-8 md:p-12 text-center" data-aos="zoom-in">
            <!-- Icône check -->
            <div class="w-24 h-24 mx-auto mb-6 rounded-full bg-green-100 flex items-center justify-center animate-float">
              <i class="fa-solid fa-circle-check text-green-500 text-5xl"></i>
            </div>

            <h1 class="text-3xl md:text-4xl font-extrabold text-dark-900 mb-3">
              Réservation confirmée !
            </h1>
            <p class="text-dark-500 mb-8">
              Merci {{ reservation.customer_name }}, votre séjour est réservé. Un email de confirmation a été envoyé.
            </p>

            <!-- Numéro réservation -->
            <div class="bg-primary-50 border-2 border-dashed border-primary-300 rounded-2xl p-5 mb-8">
              <div class="text-xs font-bold text-primary-600 uppercase tracking-wider mb-2">
                Numéro de réservation
              </div>
              <div class="text-2xl md:text-3xl font-extrabold text-primary-600 tracking-wider">
                {{ reservation.reference }}
              </div>
            </div>

            <!-- Détails -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-left mb-8">
              <div class="bg-soft-100 rounded-xl p-4">
                <div class="text-xs text-dark-400 uppercase font-bold mb-1">
                  <i class="fa-solid fa-calendar-day text-primary-400 mr-1"></i>
                  Arrivée
                </div>
                <div class="font-bold text-dark-800">{{ formatDate(reservation.check_in) }}</div>
              </div>
              <div class="bg-soft-100 rounded-xl p-4">
                <div class="text-xs text-dark-400 uppercase font-bold mb-1">
                  <i class="fa-solid fa-calendar-check text-primary-400 mr-1"></i>
                  Départ
                </div>
                <div class="font-bold text-dark-800">{{ formatDate(reservation.check_out) }}</div>
              </div>
              <div class="bg-soft-100 rounded-xl p-4">
                <div class="text-xs text-dark-400 uppercase font-bold mb-1">
                  <i class="fa-solid fa-bed text-primary-400 mr-1"></i>
                  Chambre
                </div>
                <div class="font-bold text-dark-800">
                  N° {{ reservation.room_number }} — {{ reservation.type_name }}
                </div>
              </div>
              <div class="bg-soft-100 rounded-xl p-4">
                <div class="text-xs text-dark-400 uppercase font-bold mb-1">
                  <i class="fa-solid fa-circle-check text-primary-400 mr-1"></i>
                  Paiement
                </div>
                <div class="font-bold text-green-600">
                  Payé {{ reservation.total_amount }}€
                </div>
              </div>
            </div>

            <!-- Boutons -->
            <div class="flex flex-col sm:flex-row gap-3 justify-center">
              <router-link :to="`/invoice/${reservation.id}`" class="btn-primary">
                <i class="fa-solid fa-file-invoice mr-2"></i>
                Voir ma facture
              </router-link>
              <router-link to="/rooms" class="btn-outline">
                <i class="fa-solid fa-bed mr-2"></i>
                Réserver une autre chambre
              </router-link>
            </div>
          </div>

          <!-- Info email -->
          <div class="mt-6 bg-white rounded-2xl shadow-card p-5 flex items-center gap-4" data-aos="fade-up">
            <div class="w-12 h-12 rounded-xl bg-primary-50 flex items-center justify-center flex-shrink-0">
              <i class="fa-solid fa-envelope text-primary-400 text-xl"></i>
            </div>
            <div>
              <div class="font-bold text-dark-800">Email de confirmation envoyé</div>
              <p class="text-dark-400 text-xs">
                Un récapitulatif a été envoyé à {{ reservation.customer_email }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import { reservationsApi } from '../../services/api';

export default {
  name: 'Confirmation',
  data() {
    return {
      loading: true,
      error: null,
      reservation: {},
    };
  },
  async mounted() {
    const id = this.$route.params.reservationId;
    try {
      const res = await reservationsApi.getById(id);
      this.reservation = res.data;
    } catch (err) {
      this.error = 'Impossible de charger la réservation.';
      console.error(err);
    } finally {
      this.loading = false;
    }
  },
  methods: {
    formatDate(dateStr) {
      if (!dateStr) return '';
      return new Date(dateStr).toLocaleDateString('fr-FR', {
        weekday: 'long',
        day: '2-digit',
        month: 'long',
        year: 'numeric',
      });
    },
  },
};
</script>