<template>
  <div>
    <!-- ==================== BANNIÈRE ==================== -->
    <section class="relative h-[45vh] min-h-[350px] flex items-center justify-center overflow-hidden">
      <div
        class="absolute inset-0 bg-cover bg-center"
        style="background-image: url('https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=1920')"
      ></div>
      <div class="absolute inset-0 bg-gradient-to-b from-dark-900/80 to-dark-900/60"></div>

      <div class="relative z-10 text-center text-white px-4" data-aos="fade-up">
        <div class="text-primary-400 uppercase tracking-widest text-sm font-bold mb-3">
          Nos Hébergements
        </div>
        <h1 class="text-4xl md:text-6xl font-extrabold mb-4">Chambres & Suites</h1>
        <p class="text-white/80 max-w-2xl mx-auto">
          Trouvez la chambre parfaite pour votre séjour parmi notre sélection.
        </p>
      </div>
    </section>

    <!-- ==================== FILTRES ==================== -->
    <section class="bg-white shadow-soft sticky top-[72px] z-40 py-5 border-b border-soft-200">
      <div class="max-w-7xl mx-auto px-4">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3">
          <!-- Date arrivée -->
          <div>
            <label class="text-xs font-semibold text-dark-600 uppercase mb-1 block">
              <i class="fa-solid fa-calendar-day text-primary-400 mr-1"></i>
              Arrivée
            </label>
            <input v-model="filters.checkIn" type="date" class="input-field text-sm" />
          </div>

          <!-- Date départ -->
          <div>
            <label class="text-xs font-semibold text-dark-600 uppercase mb-1 block">
              <i class="fa-solid fa-calendar-check text-primary-400 mr-1"></i>
              Départ
            </label>
            <input v-model="filters.checkOut" type="date" class="input-field text-sm" />
          </div>

          <!-- Type -->
          <div>
            <label class="text-xs font-semibold text-dark-600 uppercase mb-1 block">
              <i class="fa-solid fa-door-open text-primary-400 mr-1"></i>
              Type
            </label>
            <select v-model="filters.typeId" class="input-field text-sm">
              <option value="">Tous les types</option>
              <option v-for="t in roomTypes" :key="t.id" :value="t.id">
                {{ t.name }}
              </option>
            </select>
          </div>

          <!-- Prix max -->
          <div>
            <label class="text-xs font-semibold text-dark-600 uppercase mb-1 block">
              <i class="fa-solid fa-tag text-primary-400 mr-1"></i>
              Prix max : {{ filters.maxPrice }}€
            </label>
            <input
              v-model.number="filters.maxPrice"
              type="range"
              :min="minPrice"
              :max="maxPrice"
              step="5"
              class="w-full accent-primary-400 h-2 mt-3"
            />
          </div>

          <!-- Reset -->
          <div class="flex items-end">
            <button @click="resetFilters" class="btn-outline w-full text-sm !px-4 !py-2.5">
              <i class="fa-solid fa-rotate-left mr-2"></i>
              Réinitialiser
            </button>
          </div>
        </div>

        <!-- Résumé -->
        <div class="mt-4 flex flex-wrap items-center justify-between gap-3 text-sm">
          <div class="text-dark-500">
            <i class="fa-solid fa-circle-info text-primary-400 mr-1"></i>
            <strong>{{ filteredRooms.length }}</strong> chambre(s) trouvée(s)
            <span v-if="filters.checkIn && filters.checkOut" class="ml-2">
              pour la période du <strong>{{ formatDate(filters.checkIn) }}</strong>
              au <strong>{{ formatDate(filters.checkOut) }}</strong>
            </span>
          </div>
          <div v-if="activeFiltersCount > 0" class="flex items-center gap-2 text-xs">
            <span class="badge badge-orange">
              {{ activeFiltersCount }} filtre(s) actif(s)
            </span>
          </div>
        </div>
      </div>
    </section>

    <!-- ==================== LISTE ==================== -->
    <section class="py-12 bg-soft-100">
      <div class="max-w-7xl mx-auto px-4">
        <!-- Loading -->
        <div v-if="loading" class="flex justify-center py-20">
          <div class="animate-spin rounded-full h-14 w-14 border-4 border-primary-400 border-t-transparent"></div>
        </div>

        <!-- Erreur -->
        <div v-else-if="error" class="text-center py-20">
          <i class="fa-solid fa-triangle-exclamation text-5xl text-red-500 mb-4"></i>
          <p class="text-dark-600 mb-6">{{ error }}</p>
          <button @click="fetchRooms" class="btn-primary">
            <i class="fa-solid fa-rotate-right mr-2"></i>
            Réessayer
          </button>
        </div>

        <!-- Vide -->
        <div v-else-if="filteredRooms.length === 0" class="text-center py-20">
          <div class="w-20 h-20 mx-auto mb-6 rounded-full bg-soft-200 flex items-center justify-center">
            <i class="fa-solid fa-bed text-3xl text-dark-300"></i>
          </div>
          <h3 class="text-2xl font-bold text-dark-800 mb-2">Aucune chambre trouvée</h3>
          <p class="text-dark-500 mb-6">Essayez de modifier vos critères de recherche.</p>
          <button @click="resetFilters" class="btn-primary">
            <i class="fa-solid fa-rotate-left mr-2"></i>
            Réinitialiser les filtres
          </button>
        </div>

        <!-- Grille -->
        <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div
            v-for="(room, i) in filteredRooms"
            :key="room.id"
            data-aos="fade-up"
            :data-aos-delay="(i % 6) * 80"
            class="card group"
          >
            <!-- Image -->
            <div class="relative h-56 overflow-hidden">
              <img
                :src="room.image_url"
                :alt="room.room_number"
                class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
              />
              <div class="absolute top-4 right-4">
                <span
                  :class="statusBadge(room.status).class"
                  class="badge shadow-lg"
                >
                  <i :class="statusBadge(room.status).icon" class="mr-2 text-[8px]"></i>
                  {{ statusBadge(room.status).label }}
                </span>
              </div>
              <div class="absolute top-4 left-4 bg-white/95 backdrop-blur px-3 py-1 rounded-lg text-xs font-bold text-dark-700">
                <i class="fa-solid fa-door-closed text-primary-400 mr-1"></i>
                N° {{ room.room_number }}
              </div>
              <div class="absolute bottom-4 left-4 bg-dark-900/80 backdrop-blur px-3 py-1 rounded-lg text-xs font-bold text-white">
                <i class="fa-solid fa-layer-group text-primary-400 mr-1"></i>
                Étage {{ room.floor }}
              </div>
            </div>

            <!-- Contenu -->
            <div class="p-6">
              <div class="flex items-start justify-between mb-3">
                <div>
                  <div class="text-xs font-bold text-primary-500 uppercase tracking-wider mb-1">
                    {{ room.type_name }}
                  </div>
                  <h3 class="text-xl font-bold text-dark-900 mb-1">
                    Chambre {{ room.room_number }}
                  </h3>
                  <div class="flex items-center gap-1 text-primary-400 text-sm">
                    <i v-for="n in 5" :key="n" class="fa-solid fa-star text-xs"></i>
                    <span class="text-dark-400 ml-1 text-xs">(5.0)</span>
                  </div>
                </div>
              </div>

              <p class="text-dark-500 text-sm mb-4 line-clamp-2 min-h-[40px]">
                {{ room.description }}
              </p>

              <!-- Équipements -->
              <div class="flex flex-wrap gap-2 mb-5">
                <span class="text-xs bg-soft-200 text-dark-600 px-2 py-1 rounded-md">
                  <i class="fa-solid fa-user-group text-primary-400 mr-1"></i>
                  {{ room.capacity }} pers.
                </span>
                <span class="text-xs bg-soft-200 text-dark-600 px-2 py-1 rounded-md">
                  <i class="fa-solid fa-wifi text-primary-400 mr-1"></i>
                  Wifi
                </span>
                <span class="text-xs bg-soft-200 text-dark-600 px-2 py-1 rounded-md">
                  <i class="fa-solid fa-snowflake text-primary-400 mr-1"></i>
                  Clim
                </span>
              </div>

              <div class="flex items-center justify-between pt-4 border-t border-soft-200">
                <div>
                  <div class="text-2xl font-extrabold text-primary-500">
                    {{ room.base_price }}€
                  </div>
                  <div class="text-dark-400 text-xs">par nuit</div>
                </div>
          <router-link
            v-if="room.status === 'available'"
            :to="`/booking/${room.id}`"
            class="btn-primary text-sm !px-4 !py-2.5"
            >
            Réserver
            <i class="fa-solid fa-arrow-right ml-1"></i>
          </router-link>
          <button
           v-else
           disabled
           class="btn-primary text-sm !px-4 !py-2.5 opacity-50 cursor-not-allowed"
            >
            <i class="fa-solid fa-lock mr-1"></i>
            {{ room.status === 'occupied' ? 'Occupée' : 'Maintenance' }}
          </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import { roomsApi, roomTypesApi } from '../../services/api';

export default {
  name: 'RoomList',
  data() {
    return {
      loading: true,
      error: null,
      rooms: [],
      roomTypes: [],
      filters: {
        checkIn: '',
        checkOut: '',
        typeId: '',
        maxPrice: 1000,
      },
    };
  },
  computed: {
    minPrice() {
      if (this.rooms.length === 0) return 0;
      return Math.min(...this.rooms.map((r) => r.base_price));
    },
    maxPrice() {
      if (this.rooms.length === 0) return 1000;
      return Math.max(...this.rooms.map((r) => r.base_price));
    },
    activeFiltersCount() {
      let count = 0;
      if (this.filters.checkIn) count++;
      if (this.filters.checkOut) count++;
      if (this.filters.typeId) count++;
      if (this.filters.maxPrice < this.maxPrice) count++;
      return count;
    },
    filteredRooms() {
  return this.rooms.filter((room) => {
    // Filtre type
    if (this.filters.typeId && room.room_type_id !== Number(this.filters.typeId)) {
      return false;
    }
    // Filtre prix
    if (room.base_price > this.filters.maxPrice) {
      return false;
    }
    // Filtre statut : on cache les chambres en maintenance
    if (room.status === 'maintenance') {
      return false;
    }
    return true;
  });
},
  },
  async mounted() {
    // Pré-remplir les dates depuis l'URL (depuis la page d'accueil)
    if (this.$route.query.check_in) this.filters.checkIn = this.$route.query.check_in;
    if (this.$route.query.check_out) this.filters.checkOut = this.$route.query.check_out;

    await this.fetchData();
  },
  methods: {
    async fetchData() {
      this.loading = true;
      this.error = null;
      try {
        const [roomsRes, typesRes] = await Promise.all([
          roomsApi.getAll(),
          roomTypesApi.getAll(),
        ]);
        this.rooms = roomsRes.data;
        this.roomTypes = typesRes.data;
        this.filters.maxPrice = this.maxPrice;
      } catch (err) {
        this.error = 'Impossible de charger les chambres. Vérifiez que le backend est démarré.';
        console.error(err);
      } finally {
        this.loading = false;
      }
    },
    async fetchAvailableRooms() {
      if (!this.filters.checkIn || !this.filters.checkOut) return;

      this.loading = true;
      this.error = null;
      try {
        const res = await roomsApi.getAvailable(this.filters.checkIn, this.filters.checkOut);
        this.rooms = res.data;
      } catch (err) {
        this.error = err.response?.data?.error || 'Erreur lors de la recherche';
        console.error(err);
      } finally {
        this.loading = false;
      }
    },
    resetFilters() {
      this.filters = {
        checkIn: '',
        checkOut: '',
        typeId: '',
        maxPrice: this.maxPrice,
      };
      this.fetchData();
    },
    formatDate(dateStr) {
      if (!dateStr) return '';
      const d = new Date(dateStr);
      return d.toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' });
    },
    statusBadge(status) {
      switch (status) {
        case 'available':
          return { class: 'badge-green', icon: 'fa-solid fa-circle', label: 'Disponible' };
        case 'occupied':
          return { class: 'badge-red', icon: 'fa-solid fa-circle', label: 'Occupée' };
        case 'maintenance':
          return { class: 'badge-gray', icon: 'fa-solid fa-wrench', label: 'Maintenance' };
        default:
          return { class: 'badge-gray', icon: 'fa-solid fa-circle', label: status };
      }
    },
  },
  watch: {
    // Quand les dates changent, on recharge les chambres disponibles
    'filters.checkIn'() {
      if (this.filters.checkIn && this.filters.checkOut) this.fetchAvailableRooms();
    },
    'filters.checkOut'() {
      if (this.filters.checkIn && this.filters.checkOut) this.fetchAvailableRooms();
    },
  },
};
</script>