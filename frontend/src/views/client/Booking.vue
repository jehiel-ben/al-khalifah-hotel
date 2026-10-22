<template>
  <div class="bg-soft-100 min-h-screen">
    <section class="bg-dark-900 text-white py-12">
      <div class="max-w-7xl mx-auto px-4">
        <router-link to="/rooms" class="text-white/60 hover:text-primary-400 text-sm mb-3 inline-block transition-colors">
          <i class="fa-solid fa-arrow-left mr-2"></i>
          Retour aux chambres
        </router-link>
        <h1 class="text-3xl md:text-4xl font-extrabold">Finalisez votre réservation</h1>
        <p class="text-white/60 mt-2">Remplissez le formulaire ci-dessous pour réserver votre chambre.</p>
      </div>
    </section>

    <section class="py-12">
      <div class="max-w-7xl mx-auto px-4">
        <div v-if="loading" class="flex justify-center py-20">
          <div class="animate-spin rounded-full h-14 w-14 border-4 border-primary-400 border-t-transparent"></div>
        </div>

        <div v-else-if="error" class="text-center py-20">
          <i class="fa-solid fa-triangle-exclamation text-5xl text-red-500 mb-4"></i>
          <p class="text-dark-600 mb-6">{{ error }}</p>
          <router-link to="/rooms" class="btn-primary">
            <i class="fa-solid fa-arrow-left mr-2"></i>
            Retour aux chambres
          </router-link>
        </div>

        <div v-else class="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div class="lg:col-span-2 space-y-6">
            <!-- CARTE CHAMBRE -->
            <div class="card !cursor-default" data-aos="fade-up">
              <div class="grid grid-cols-1 md:grid-cols-3">
                <div class="h-48 md:h-full">
                  <img :src="room.image_url" :alt="room.room_number" class="w-full h-full object-cover" />
                </div>
                <div class="md:col-span-2 p-6">
                  <div class="text-xs font-bold text-primary-500 uppercase tracking-wider mb-2">
                    {{ room.type_name }}
                  </div>
                  <h2 class="text-2xl font-bold text-dark-900 mb-2">Chambre {{ room.room_number }}</h2>
                  <p class="text-dark-500 text-sm mb-4">{{ room.description }}</p>
                  <div class="flex flex-wrap gap-3 text-sm">
                    <span class="bg-soft-200 px-3 py-1 rounded-lg text-dark-600">
                      <i class="fa-solid fa-user-group text-primary-400 mr-1"></i>{{ room.capacity }} pers.
                    </span>
                    <span class="bg-soft-200 px-3 py-1 rounded-lg text-dark-600">
                      <i class="fa-solid fa-layer-group text-primary-400 mr-1"></i>Étage {{ room.floor }}
                    </span>
                    <span class="bg-soft-200 px-3 py-1 rounded-lg text-dark-600">
                      <i class="fa-solid fa-wifi text-primary-400 mr-1"></i>Wifi
                    </span>
                  </div>
                  <div class="mt-4 pt-4 border-t border-soft-200">
                    <span class="text-3xl font-extrabold text-primary-500">{{ room.base_price }}€</span>
                    <span class="text-dark-400 text-sm">/ nuit</span>
                  </div>
                </div>
              </div>
            </div>

            <!-- FORMULAIRE CLIENT -->
            <div class="bg-white rounded-2xl shadow-card p-6 md:p-8" data-aos="fade-up" data-aos-delay="100">
              <div class="flex items-center gap-3 mb-6">
                <div class="w-10 h-10 rounded-xl bg-primary-50 flex items-center justify-center">
                  <i class="fa-solid fa-user text-primary-400"></i>
                </div>
                <div>
                  <h3 class="font-bold text-dark-900 text-lg">Informations client</h3>
                  <p class="text-dark-400 text-xs">Tous les champs marqués * sont obligatoires</p>
                </div>
              </div>

              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div class="md:col-span-2">
                  <label class="text-xs font-semibold text-dark-600 uppercase mb-1 block">Nom complet *</label>
                  <input v-model="form.customer_name" type="text" class="input-field"
                    :class="{ 'border-red-400 ring-2 ring-red-200': errors.customer_name }"
                    placeholder="Jean Dupont" />
                  <p v-if="errors.customer_name" class="text-red-500 text-xs mt-1">
                    <i class="fa-solid fa-circle-exclamation mr-1"></i>{{ errors.customer_name }}
                  </p>
                </div>

                <div>
                  <label class="text-xs font-semibold text-dark-600 uppercase mb-1 block">Email *</label>
                  <input v-model="form.customer_email" type="email" class="input-field"
                    :class="{ 'border-red-400 ring-2 ring-red-200': errors.customer_email }"
                    placeholder="jean@email.com" />
                  <p v-if="errors.customer_email" class="text-red-500 text-xs mt-1">
                    <i class="fa-solid fa-circle-exclamation mr-1"></i>{{ errors.customer_email }}
                  </p>
                </div>

                <div>
                  <label class="text-xs font-semibold text-dark-600 uppercase mb-1 block">Téléphone *</label>
                  <input v-model="form.customer_phone" type="tel" class="input-field"
                    :class="{ 'border-red-400 ring-2 ring-red-200': errors.customer_phone }"
                    placeholder="+000 00 00 00 00" />
                  <p v-if="errors.customer_phone" class="text-red-500 text-xs mt-1">
                    <i class="fa-solid fa-circle-exclamation mr-1"></i>{{ errors.customer_phone }}
                  </p>
                </div>

                <div>
                  <label class="text-xs font-semibold text-dark-600 uppercase mb-1 block">
                    <i class="fa-solid fa-calendar-day text-primary-400 mr-1"></i>Date d'arrivée *
                  </label>
                  <input v-model="form.check_in" type="date" :min="today" class="input-field"
                    :class="{ 'border-red-400 ring-2 ring-red-200': errors.check_in }" />
                  <p v-if="errors.check_in" class="text-red-500 text-xs mt-1">
                    <i class="fa-solid fa-circle-exclamation mr-1"></i>{{ errors.check_in }}
                  </p>
                </div>

                <div>
                  <label class="text-xs font-semibold text-dark-600 uppercase mb-1 block">
                    <i class="fa-solid fa-calendar-check text-primary-400 mr-1"></i>Date de départ *
                  </label>
                  <input v-model="form.check_out" type="date" :min="form.check_in || today" class="input-field"
                    :class="{ 'border-red-400 ring-2 ring-red-200': errors.check_out }" />
                  <p v-if="errors.check_out" class="text-red-500 text-xs mt-1">
                    <i class="fa-solid fa-circle-exclamation mr-1"></i>{{ errors.check_out }}
                  </p>
                </div>

                <div>
                  <label class="text-xs font-semibold text-dark-600 uppercase mb-1 block">
                    <i class="fa-solid fa-user-group text-primary-400 mr-1"></i>Nombre de personnes *
                  </label>
                  <select v-model.number="form.guests" class="input-field">
                    <option v-for="n in room.capacity" :key="n" :value="n">
                      {{ n }} {{ n > 1 ? 'personnes' : 'personne' }}
                    </option>
                  </select>
                </div>
              </div>
            </div>

            <!-- SERVICES -->
            <div class="bg-white rounded-2xl shadow-card p-6 md:p-8" data-aos="fade-up" data-aos-delay="200">
              <div class="flex items-center gap-3 mb-6">
                <div class="w-10 h-10 rounded-xl bg-primary-50 flex items-center justify-center">
                  <i class="fa-solid fa-concierge-bell text-primary-400"></i>
                </div>
                <div>
                  <h3 class="font-bold text-dark-900 text-lg">Services additionnels</h3>
                  <p class="text-dark-400 text-xs">Sélectionnez les services souhaités (optionnel)</p>
                </div>
              </div>

              <div v-if="servicesLoading" class="flex justify-center py-6">
                <div class="animate-spin rounded-full h-8 w-8 border-4 border-primary-400 border-t-transparent"></div>
              </div>

              <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-3">
                <label v-for="service in services" :key="service.id"
                  class="flex items-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all"
                  :class="isServiceSelected(service.id)
                    ? 'border-primary-400 bg-primary-50'
                    : 'border-soft-200 hover:border-primary-200 hover:bg-soft-100'">
                  <input type="checkbox" :checked="isServiceSelected(service.id)"
                    @change="toggleService(service.id)"
                    class="w-5 h-5 accent-primary-400 cursor-pointer" />
                  <div class="text-2xl w-10 text-center">
                    <i :class="service.icon" class="text-primary-400"></i>
                  </div>
                  <div class="flex-1">
                    <div class="font-semibold text-dark-800 text-sm">{{ service.name }}</div>
                    <div class="text-dark-400 text-xs line-clamp-1">{{ service.description }}</div>
                  </div>
                  <div class="text-primary-500 font-bold text-sm whitespace-nowrap">+{{ service.price }}€</div>
                </label>
              </div>
            </div>
          </div>

          <!-- RÉSUMÉ -->
          <div class="lg:col-span-1">
            <div class="bg-white rounded-2xl shadow-luxe p-6 sticky top-24" data-aos="fade-left">
              <h3 class="text-xl font-bold text-dark-900 mb-1">Résumé de la réservation</h3>
              <p class="text-dark-400 text-xs mb-6">Vérifiez les détails avant de continuer</p>

              <div class="space-y-3 pb-4 border-b border-soft-200">
                <div class="flex justify-between text-sm">
                  <span class="text-dark-500">Chambre {{ room.room_number }} ({{ room.type_name }})</span>
                  <span class="font-semibold text-dark-800">{{ room.base_price }}€/nuit</span>
                </div>
                <div v-if="nights > 0" class="flex justify-between text-sm">
                  <span class="text-dark-500">Durée du séjour</span>
                  <span class="font-semibold text-dark-800">{{ nights }} {{ nights > 1 ? 'nuits' : 'nuit' }}</span>
                </div>
                <div v-if="nights > 0" class="flex justify-between text-sm">
                  <span class="text-dark-500">Sous-total chambre</span>
                  <span class="font-semibold text-dark-800">{{ roomTotal }}€</span>
                </div>
              </div>

              <div v-if="selectedServices.length > 0" class="py-4 border-b border-soft-200">
                <div class="text-xs font-bold text-dark-600 uppercase mb-3">Services ajoutés</div>
                <div class="space-y-2">
                  <div v-for="s in selectedServices" :key="s.id" class="flex justify-between text-sm">
                    <span class="text-dark-500">
                      <i :class="s.icon" class="text-primary-400 mr-2"></i>{{ s.name }}
                    </span>
                    <span class="font-semibold text-dark-800">+{{ s.price }}€</span>
                  </div>
                </div>
              </div>

              <div class="py-4 border-b border-soft-200">
                <div class="flex justify-between items-end">
                  <span class="text-dark-700 font-semibold">Total à payer</span>
                  <div class="text-right">
                    <div class="text-3xl font-extrabold text-primary-500">{{ total }}€</div>
                    <div v-if="nights > 0" class="text-dark-400 text-xs">Taxes incluses</div>
                  </div>
                </div>
              </div>

              <!-- Alertes -->
              <div v-if="availabilityChecking" class="bg-blue-50 border border-blue-200 rounded-xl p-3 mt-4 text-xs text-blue-700">
                <i class="fa-solid fa-spinner fa-spin mr-2"></i>
                Vérification de la disponibilité...
              </div>

              <div v-else-if="availabilityError" class="bg-red-50 border-2 border-red-300 rounded-xl p-3 mt-4 text-xs text-red-700">
                <i class="fa-solid fa-triangle-exclamation mr-2"></i>
                <strong>Indisponible :</strong> {{ availabilityError }}
              </div>

              <div v-else-if="submitError" class="bg-red-50 border-2 border-red-300 rounded-xl p-3 mt-4 text-xs text-red-700">
                <i class="fa-solid fa-circle-exclamation mr-2"></i>
                <strong>Erreur :</strong> {{ submitError }}
              </div>

              <button @click="submit"
                :disabled="submitting || !isFormValid || !!availabilityError || availabilityChecking"
                class="btn-primary w-full mt-4 disabled:opacity-50 disabled:cursor-not-allowed">
                <span v-if="submitting">
                  <i class="fa-solid fa-spinner fa-spin mr-2"></i>Traitement...
                </span>
                <span v-else>
                  Continuer vers le paiement
                  <i class="fa-solid fa-arrow-right ml-2"></i>
                </span>
              </button>

              <p v-if="!isFormValid && !submitting" class="text-center text-xs text-dark-400 mt-3">
                <i class="fa-solid fa-circle-info mr-1"></i>Remplissez tous les champs obligatoires
              </p>

              <div class="mt-6 pt-6 border-t border-soft-200 grid grid-cols-3 gap-2 text-center">
                <div>
                  <i class="fa-solid fa-shield-halved text-primary-400 text-lg"></i>
                  <div class="text-[10px] text-dark-500 mt-1 font-medium">Sécurisé</div>
                </div>
                <div>
                  <i class="fa-solid fa-bolt text-primary-400 text-lg"></i>
                  <div class="text-[10px] text-dark-500 mt-1 font-medium">Rapide</div>
                </div>
                <div>
                  <i class="fa-solid fa-headset text-primary-400 text-lg"></i>
                  <div class="text-[10px] text-dark-500 mt-1 font-medium">Support 24/7</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import { roomsApi, servicesApi, reservationsApi } from '../../services/api';

export default {
  name: 'Booking',
  data() {
    return {
      loading: true,
      servicesLoading: false,
      submitting: false,
      error: null,
      room: {},
      services: [],
      selectedServiceIds: [],
      form: {
        customer_name: '',
        customer_email: '',
        customer_phone: '',
        check_in: '',
        check_out: '',
        guests: 1,
      },
      errors: {},
      availabilityError: null,
      availabilityChecking: false,
      submitError: null,
      today: new Date().toISOString().split('T')[0],
    };
  },
  computed: {
    nights() {
      if (!this.form.check_in || !this.form.check_out) return 0;
      const d1 = new Date(this.form.check_in);
      const d2 = new Date(this.form.check_out);
      return Math.max(0, Math.round((d2 - d1) / (1000 * 60 * 60 * 24)));
    },
    roomTotal() {
      return this.room.base_price ? this.room.base_price * this.nights : 0;
    },
    selectedServices() {
      return this.services.filter((s) => this.selectedServiceIds.includes(s.id));
    },
    servicesTotal() {
      return this.selectedServices.reduce((sum, s) => sum + s.price, 0);
    },
    total() {
      return this.roomTotal + this.servicesTotal;
    },
    isFormValid() {
      return (
        this.form.customer_name.trim() !== '' &&
        this.form.customer_email.trim() !== '' &&
        this.form.customer_phone.trim() !== '' &&
        this.form.check_in !== '' &&
        this.form.check_out !== '' &&
        this.nights > 0
      );
    },
  },
  watch: {
    'form.check_in'() {
      this.submitError = null;
      this.checkAvailability();
    },
    'form.check_out'() {
      this.submitError = null;
      this.checkAvailability();
    },
  },
  async mounted() {
    const roomId = this.$route.params.roomId;

    if (this.$route.query.check_in) this.form.check_in = this.$route.query.check_in;
    if (this.$route.query.check_out) this.form.check_out = this.$route.query.check_out;

    try {
      const [roomRes, servicesRes] = await Promise.all([
        roomsApi.getById(roomId),
        servicesApi.getAll(),
      ]);
      this.room = roomRes.data;
      this.services = servicesRes.data;
      this.form.guests = Math.min(2, this.room.capacity || 1);

      if (this.form.check_in && this.form.check_out) {
        this.checkAvailability();
      }
    } catch (err) {
      this.error = 'Impossible de charger la chambre.';
      console.error(err);
    } finally {
      this.loading = false;
    }
  },
  methods: {
    async checkAvailability() {
      this.availabilityError = null;

      if (!this.form.check_in || !this.form.check_out) return;
      if (this.nights <= 0) return;

      this.availabilityChecking = true;
      try {
        const res = await roomsApi.getAvailable(this.form.check_in, this.form.check_out);
        const stillAvailable = res.data.some((r) => r.id === this.room.id);
        if (!stillAvailable) {
          this.availabilityError = `La chambre ${this.room.room_number} est déjà réservée sur cette période.`;
        }
      } catch (err) {
        console.error('Erreur check dispo:', err);
      } finally {
        this.availabilityChecking = false;
      }
    },
    isServiceSelected(id) {
      return this.selectedServiceIds.includes(id);
    },
    toggleService(id) {
      const idx = this.selectedServiceIds.indexOf(id);
      if (idx > -1) this.selectedServiceIds.splice(idx, 1);
      else this.selectedServiceIds.push(id);
    },
    validate() {
      this.errors = {};
      if (!this.form.customer_name.trim()) this.errors.customer_name = 'Le nom est obligatoire';
      if (!this.form.customer_email.trim()) {
        this.errors.customer_email = 'L\'email est obligatoire';
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.form.customer_email)) {
        this.errors.customer_email = 'Format d\'email invalide';
      }
      if (!this.form.customer_phone.trim()) this.errors.customer_phone = 'Le téléphone est obligatoire';
      if (!this.form.check_in) this.errors.check_in = 'La date d\'arrivée est obligatoire';
      if (!this.form.check_out) {
        this.errors.check_out = 'La date de départ est obligatoire';
      } else if (this.nights <= 0) {
        this.errors.check_out = 'La date de départ doit être après l\'arrivée';
      }
      return Object.keys(this.errors).length === 0;
    },
    async submit() {
      this.submitError = null;

      if (!this.validate()) {
        const firstError = document.querySelector('.border-red-400');
        if (firstError) firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
        return;
      }

      if (this.availabilityError) return;

      this.submitting = true;
      try {
        const payload = {
          customer_name: this.form.customer_name,
          customer_email: this.form.customer_email,
          customer_phone: this.form.customer_phone,
          room_id: this.room.id,
          check_in: this.form.check_in,
          check_out: this.form.check_out,
          guests: this.form.guests,
          services: this.selectedServiceIds.map((id) => ({ service_id: id, quantity: 1 })),
        };

        console.log('📤 Envoi réservation:', payload);
        const res = await reservationsApi.create(payload);
        console.log('✅ Réponse:', res.data);

        const reservation = res.data;

        if (!reservation || !reservation.id) {
          this.submitError = 'L\'API n\'a pas renvoyé l\'ID. Regardez la console (F12).';
          return;
        }
        this.$router.push(`/payment/${reservation.id}`);
      } catch (err) {
        console.error('❌ Erreur:', err.response?.data || err);
        this.submitError = err.response?.data?.error || 'Erreur lors de la réservation';
      } finally {
        this.submitting = false;
      }
    },
  },
};
</script>