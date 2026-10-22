<template>
  <div class="bg-soft-100 min-h-screen">
    <!-- Bannière -->
    <section class="bg-dark-900 text-white py-12">
      <div class="max-w-7xl mx-auto px-4">
        <router-link to="/rooms" class="text-white/60 hover:text-primary-400 text-sm mb-3 inline-block transition-colors">
          <i class="fa-solid fa-arrow-left mr-2"></i>
          Retour
        </router-link>
        <h1 class="text-3xl md:text-4xl font-extrabold">Paiement sécurisé</h1>
        <p class="text-white/60 mt-2">Finalisez votre réservation en choisissant un mode de paiement.</p>
      </div>
    </section>

    <section class="py-12">
      <div class="max-w-7xl mx-auto px-4">
        <!-- Loading -->
        <div v-if="loading" class="flex justify-center py-20">
          <div class="animate-spin rounded-full h-14 w-14 border-4 border-primary-400 border-t-transparent"></div>
        </div>

        <!-- Erreur -->
        <div v-else-if="error" class="text-center py-20">
          <i class="fa-solid fa-triangle-exclamation text-5xl text-red-500 mb-4"></i>
          <p class="text-dark-600 mb-6">{{ error }}</p>
          <router-link to="/rooms" class="btn-primary">
            <i class="fa-solid fa-arrow-left mr-2"></i>
            Retour aux chambres
          </router-link>
        </div>

        <!-- Contenu -->
        <div v-else class="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <!-- ========== COLONNE FORMULAIRE (2/3) ========== -->
          <div class="lg:col-span-2 space-y-6">
            <!-- Étape indicateur -->
            <div class="flex items-center gap-4 text-sm">
              <div class="flex items-center gap-2 text-dark-400">
                <div class="w-8 h-8 rounded-full bg-green-100 text-green-600 flex items-center justify-center">
                  <i class="fa-solid fa-check text-xs"></i>
                </div>
                <span>Réservation</span>
              </div>
              <div class="flex-1 h-0.5 bg-primary-400"></div>
              <div class="flex items-center gap-2 text-primary-500 font-semibold">
                <div class="w-8 h-8 rounded-full bg-primary-400 text-white flex items-center justify-center">
                  2
                </div>
                <span>Paiement</span>
              </div>
              <div class="flex-1 h-0.5 bg-soft-200"></div>
              <div class="flex items-center gap-2 text-dark-400">
                <div class="w-8 h-8 rounded-full bg-soft-200 flex items-center justify-center">
                  3
                </div>
                <span>Confirmation</span>
              </div>
            </div>

            <!-- Choix méthode -->
            <div class="bg-white rounded-2xl shadow-card p-6 md:p-8" data-aos="fade-up">
              <div class="flex items-center gap-3 mb-6">
                <div class="w-10 h-10 rounded-xl bg-primary-50 flex items-center justify-center">
                  <i class="fa-solid fa-credit-card text-primary-400"></i>
                </div>
                <div>
                  <h3 class="font-bold text-dark-900 text-lg">Mode de paiement</h3>
                  <p class="text-dark-400 text-xs">Choisissez comment vous souhaitez payer</p>
                </div>
              </div>

              <div class="grid grid-cols-1 md:grid-cols-3 gap-3 mb-8">
                <button
                  v-for="method in methods"
                  :key="method.value"
                  type="button"
                  @click="form.method = method.value"
                  class="p-5 rounded-xl border-2 transition-all text-center"
                  :class="form.method === method.value
                    ? 'border-primary-400 bg-primary-50 shadow-orange'
                    : 'border-soft-200 hover:border-primary-200 hover:bg-soft-100'"
                >
                  <div class="text-3xl mb-2">
                    <i :class="[method.icon, form.method === method.value ? 'text-primary-500' : 'text-dark-400']"></i>
                  </div>
                  <div class="font-semibold text-dark-800 text-sm">{{ method.label }}</div>
                  <div class="text-dark-400 text-xs mt-1">{{ method.desc }}</div>
                </button>
              </div>

              <!-- Formulaire carte -->
              <transition name="page">
                <div v-if="form.method === 'card'" class="space-y-4 pt-4 border-t border-soft-200">
                  <div class="text-xs font-bold text-dark-600 uppercase mb-3">Informations de carte</div>

                  <div>
                    <label class="text-xs font-semibold text-dark-600 uppercase mb-1 block">
                      Numéro de carte *
                    </label>
                    <input
                      v-model="form.cardNumber"
                      type="text"
                      class="input-field"
                      placeholder="4242 4242 4242 4242"
                      maxlength="19"
                      @input="formatCardNumber"
                    />
                    <p v-if="errors.cardNumber" class="text-red-500 text-xs mt-1">
                      {{ errors.cardNumber }}
                    </p>
                  </div>

                  <div class="grid grid-cols-2 gap-4">
                    <div>
                      <label class="text-xs font-semibold text-dark-600 uppercase mb-1 block">
                        Expiration *
                      </label>
                      <input
                        v-model="form.cardExpiry"
                        type="text"
                        class="input-field"
                        placeholder="MM/AA"
                        maxlength="5"
                        @input="formatExpiry"
                      />
                      <p v-if="errors.cardExpiry" class="text-red-500 text-xs mt-1">
                        {{ errors.cardExpiry }}
                      </p>
                    </div>
                    <div>
                      <label class="text-xs font-semibold text-dark-600 uppercase mb-1 block">
                        CVV *
                      </label>
                      <input
                        v-model="form.cardCvv"
                        type="text"
                        class="input-field"
                        placeholder="123"
                        maxlength="4"
                      />
                      <p v-if="errors.cardCvv" class="text-red-500 text-xs mt-1">
                        {{ errors.cardCvv }}
                      </p>
                    </div>
                  </div>
                  <p class="text-xs text-dark-400">
                    <i class="fa-solid fa-circle-info mr-1"></i>
                    Démo : utilisez 4242 4242 4242 4242, n'importe quelle date future et CVV à 3 chiffres.
                  </p>
                </div>
              </transition>

              <!-- Message pour cash / virement -->
              <transition name="page">
                <div v-if="form.method === 'cash' || form.method === 'transfer'" class="pt-4 border-t border-soft-200">
                  <div class="bg-primary-50 border border-primary-200 rounded-xl p-4">
                    <div class="flex gap-3">
                      <i class="fa-solid fa-circle-info text-primary-500 mt-0.5"></i>
                      <div class="text-sm text-dark-700">
                        <strong v-if="form.method === 'cash'">Paiement en espèces à l'arrivée.</strong>
                        <strong v-else>Virement bancaire sous 48h.</strong>
                        <p class="text-dark-500 mt-1">
                          Votre réservation sera confirmée immédiatement. Un email de confirmation vous sera envoyé.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </transition>
            </div>

            <!-- Sécu -->
            <div class="bg-white rounded-2xl shadow-card p-5 flex items-center gap-4">
              <div class="w-12 h-12 rounded-xl bg-green-50 flex items-center justify-center flex-shrink-0">
                <i class="fa-solid fa-shield-halved text-green-600 text-xl"></i>
              </div>
              <div>
                <div class="font-bold text-dark-800">Paiement 100% sécurisé</div>
                <p class="text-dark-400 text-xs">Vos données sont chiffrées et ne sont jamais stockées. Ceci est une démonstration.</p>
              </div>
            </div>
          </div>

          <!-- ========== COLONNE RÉSUMÉ (1/3) ========== -->
          <div class="lg:col-span-1">
            <div class="bg-white rounded-2xl shadow-luxe p-6 sticky top-24" data-aos="fade-left">
              <h3 class="text-xl font-bold text-dark-900 mb-1">Votre réservation</h3>
              <p class="text-dark-400 text-xs mb-6">Réf. {{ reservation.reference }}</p>

              <!-- Chambre -->
              <div class="space-y-3 pb-4 border-b border-soft-200">
                <div class="flex justify-between text-sm">
                  <span class="text-dark-500">Chambre</span>
                  <span class="font-semibold text-dark-800">
                    {{ reservation.room_number }} ({{ reservation.type_name }})
                  </span>
                </div>
                <div class="flex justify-between text-sm">
                  <span class="text-dark-500">Arrivée</span>
                  <span class="font-semibold text-dark-800">{{ formatDate(reservation.check_in) }}</span>
                </div>
                <div class="flex justify-between text-sm">
                  <span class="text-dark-500">Départ</span>
                  <span class="font-semibold text-dark-800">{{ formatDate(reservation.check_out) }}</span>
                </div>
                <div class="flex justify-between text-sm">
                  <span class="text-dark-500">Voyageurs</span>
                  <span class="font-semibold text-dark-800">{{ reservation.guests }} pers.</span>
                </div>
              </div>

              <!-- Services -->
              <div v-if="reservation.services && reservation.services.length > 0" class="py-4 border-b border-soft-200">
                <div class="text-xs font-bold text-dark-600 uppercase mb-3">Services</div>
                <div class="space-y-2">
                  <div v-for="s in reservation.services" :key="s.id" class="flex justify-between text-sm">
                    <span class="text-dark-500">
                      <i :class="s.icon" class="text-primary-400 mr-2"></i>
                      {{ s.service_name }}
                    </span>
                    <span class="font-semibold text-dark-800">
                      +{{ s.unit_price * s.quantity }}€
                    </span>
                  </div>
                </div>
              </div>

              <!-- Client -->
              <div class="py-4 border-b border-soft-200">
                <div class="text-xs font-bold text-dark-600 uppercase mb-3">Client</div>
                <div class="text-sm space-y-1">
                  <div class="text-dark-800 font-semibold">{{ reservation.customer_name }}</div>
                  <div class="text-dark-500 text-xs">{{ reservation.customer_email }}</div>
                  <div class="text-dark-500 text-xs">{{ reservation.customer_phone }}</div>
                </div>
              </div>

              <!-- Total -->
              <div class="pt-4 pb-6">
                <div class="flex justify-between items-end">
                  <span class="text-dark-700 font-semibold">Total</span>
                  <div class="text-right">
                    <div class="text-3xl font-extrabold text-primary-500">{{ reservation.total_amount }}€</div>
                  </div>
                </div>
              </div>

              <!-- Bouton paiement -->
              <button
                @click="submitPayment"
                :disabled="submitting || !isFormValid"
                class="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span v-if="submitting">
                  <i class="fa-solid fa-spinner fa-spin mr-2"></i>
                  Traitement du paiement...
                </span>
                <span v-else>
                  <i class="fa-solid fa-lock mr-2"></i>
                  Payer {{ reservation.total_amount }}€
                </span>
              </button>

              <p class="text-center text-xs text-dark-400 mt-3">
                <i class="fa-solid fa-lock mr-1"></i>
                Paiement sécurisé SSL
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import { reservationsApi, paymentsApi } from '../../services/api';
export default {
  name: 'Payment',
  data() {
    return {
      loading: true,
      submitting: false,
      error: null,
      reservation: {},
      form: {
        method: 'card',
        cardNumber: '',
        cardExpiry: '',
        cardCvv: '',
      },
      errors: {},
      methods: [
        { value: 'card', label: 'Carte bancaire', desc: 'Visa, Mastercard', icon: 'fa-solid fa-credit-card' },
        { value: 'cash', label: 'Espèces', desc: 'À l\'arrivée', icon: 'fa-solid fa-money-bill-wave' },
        { value: 'transfer', label: 'Virement', desc: 'Sous 48h', icon: 'fa-solid fa-building-columns' },
      ],
    };
  },
  computed: {
    isFormValid() {
      if (this.form.method === 'card') {
        return (
          this.form.cardNumber.replace(/\s/g, '').length >= 15 &&
          this.form.cardExpiry.length === 5 &&
          this.form.cardCvv.length >= 3
        );
      }
      return true; // cash / transfer toujours valides
    },
  },
  async mounted() {
    const id = this.$route.params.reservationId;
    try {
      const res = await reservationsApi.getById(id);
      this.reservation = res.data;

      // Si déjà payée, rediriger
      if (res.data.payment && res.data.payment.status === 'completed') {
        this.$router.push(`/confirmation/${id}`);
      }
    } catch (err) {
      this.error = 'Impossible de charger la réservation.';
      console.error(err);
    } finally {
      this.loading = false;
    }
  },
  methods: {
    formatCardNumber(e) {
      let v = e.target.value.replace(/\D/g, '').slice(0, 16);
      this.form.cardNumber = v.replace(/(.{4})/g, '$1 ').trim();
    },
    formatExpiry(e) {
      let v = e.target.value.replace(/\D/g, '').slice(0, 4);
      if (v.length >= 3) v = v.slice(0, 2) + '/' + v.slice(2);
      this.form.cardExpiry = v;
    },
    validate() {
      this.errors = {};
      if (this.form.method === 'card') {
        const num = this.form.cardNumber.replace(/\s/g, '');
        if (num.length < 15) this.errors.cardNumber = 'Numéro de carte invalide';
        if (this.form.cardExpiry.length !== 5) this.errors.cardExpiry = 'Format MM/AA requis';
        if (this.form.cardCvv.length < 3) this.errors.cardCvv = 'CVV invalide';
      }
      return Object.keys(this.errors).length === 0;
    },
    async submitPayment() {
      if (!this.validate()) return;

      this.submitting = true;
      try {
        await paymentsApi.create({
          reservation_id: this.reservation.id,
          method: this.form.method,
        });
          
        // Redirection vers confirmation
        this.$router.push(`/confirmation/${this.reservation.id}`);
      } catch (err) {
        alert(err.response?.data?.error || 'Erreur lors du paiement');
        console.error(err);
      } finally {
        this.submitting = false;
      }
    },
    formatDate(dateStr) {
      if (!dateStr) return '';
      return new Date(dateStr).toLocaleDateString('fr-FR', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      });
    },
  },
};
</script>