<template>
  <div>
    <!-- ==================== HERO ==================== -->
    <section class="relative h-[92vh] min-h-[600px] flex items-center justify-center overflow-hidden">
      <!-- Image de fond -->
      <div
        class="absolute inset-0 bg-cover bg-center"
        style="background-image: url('https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1920')"
      ></div>
      <!-- Overlay -->
      <div class="absolute inset-0 bg-gradient-to-b from-dark-900/70 via-dark-900/60 to-dark-900/80"></div>

      <!-- Contenu -->
      <div class="relative z-10 max-w-5xl mx-auto px-4 text-center text-white">
        <div data-aos="fade-down" class="inline-flex items-center gap-2 bg-primary-400/20 backdrop-blur border border-primary-400/40 rounded-full px-4 py-2 mb-6 text-sm font-medium">
          <i class="fa-solid fa-star text-primary-400"></i>
          <span>Hôtel 5 étoiles au cœur de la ville</span>
        </div>

        <h1 data-aos="fade-up" class="font-display text-4xl md:text-6xl lg:text-7xl font-extrabold mb-6 leading-tight">
          Vivez une expérience
          <span class="text-primary-400">inoubliable</span>
        </h1>

        <p data-aos="fade-up" data-aos-delay="100" class="text-lg md:text-xl text-white/80 mb-10 max-w-2xl mx-auto">
          Réservez votre séjour de rêve dans notre hôtel de luxe. Chambres élégantes, services premium et vue exceptionnelle.
        </p>

        <div data-aos="fade-up" data-aos-delay="200" class="flex flex-wrap justify-center gap-4 mb-12">
          <router-link to="/rooms" class="btn-primary">
            <i class="fa-solid fa-calendar-check mr-2"></i>
            Réserver maintenant
          </router-link>
          <a href="#chambres" class="border-2 border-white/30 hover:bg-white/10 text-white font-semibold px-6 py-3 rounded-xl transition-all duration-300">
            <i class="fa-solid fa-eye mr-2"></i>
            Découvrir
          </a>
        </div>

        <!-- Barre de recherche flottante -->
        <div data-aos="fade-up" data-aos-delay="300" class="bg-white rounded-2xl shadow-luxe p-4 md:p-6 max-w-3xl mx-auto">
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div class="text-left">
              <label class="text-xs font-semibold text-dark-600 uppercase tracking-wider mb-1 block">
                <i class="fa-solid fa-calendar-day text-primary-400 mr-1"></i>
                Arrivée
              </label>
              <input v-model="searchForm.checkIn" type="date" class="input-field" />
            </div>
            <div class="text-left">
              <label class="text-xs font-semibold text-dark-600 uppercase tracking-wider mb-1 block">
                <i class="fa-solid fa-calendar-check text-primary-400 mr-1"></i>
                Départ
              </label>
              <input v-model="searchForm.checkOut" type="date" class="input-field" />
            </div>
            <div class="text-left flex items-end">
              <button @click="handleSearch" class="btn-primary w-full">
                <i class="fa-solid fa-magnifying-glass mr-2"></i>
                Rechercher
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Scroll indicator -->
      <div class="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/60 animate-float">
        <i class="fa-solid fa-chevron-down text-2xl"></i>
      </div>
    </section>

    <!-- ==================== STATS ==================== -->
    <section class="py-16 bg-white">
      <div class="max-w-7xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-8">
        <div v-for="(stat, i) in stats" :key="i" data-aos="fade-up" :data-aos-delay="i * 100" class="text-center">
          <div class="w-16 h-16 mx-auto mb-4 rounded-2xl bg-primary-50 flex items-center justify-center">
            <i :class="stat.icon" class="text-2xl text-primary-400"></i>
          </div>
          <div class="text-3xl md:text-4xl font-extrabold text-dark-900 mb-1">{{ stat.value }}</div>
          <div class="text-dark-500 text-sm font-medium">{{ stat.label }}</div>
        </div>
      </div>
    </section>

    <!-- ==================== CHAMBRES ==================== -->
    <section id="chambres" class="py-20 bg-soft-100">
      <div class="max-w-7xl mx-auto px-4">
        <div class="text-center mb-14" data-aos="fade-up">
          <div class="section-subtitle">Nos Hébergements</div>
          <h2 class="section-title">Chambres & Suites d'exception</h2>
          <p class="text-dark-500 max-w-2xl mx-auto">
            Choisissez parmi notre sélection de chambres élégantes, toutes équipées du confort moderne.
          </p>
        </div>

        <!-- Loading -->
        <div v-if="loading" class="flex justify-center py-20">
          <div class="animate-spin rounded-full h-12 w-12 border-4 border-primary-400 border-t-transparent"></div>
        </div>

        <!-- Erreur -->
        <div v-else-if="error" class="text-center py-20">
          <i class="fa-solid fa-triangle-exclamation text-4xl text-red-500 mb-4"></i>
          <p class="text-dark-600">{{ error }}</p>
        </div>

        <!-- Cartes -->
        <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div
            v-for="(room, i) in featuredRooms"
            :key="room.id"
            data-aos="fade-up"
            :data-aos-delay="i * 100"
            class="card group"
          >
            <!-- Image -->
            <div class="relative h-56 overflow-hidden">
              <img
                :src="room.image_url"
                :alt="room.room_number"
                class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
              />
              <div class="absolute top-4 right-4 badge badge-orange shadow-lg">
                <i class="fa-solid fa-circle text-[6px] mr-2"></i>
                Disponible
              </div>
              <div class="absolute top-4 left-4 bg-white/95 backdrop-blur px-3 py-1 rounded-lg text-xs font-bold text-dark-700">
                N° {{ room.room_number }}
              </div>
            </div>

            <!-- Contenu -->
            <div class="p-6">
              <div class="flex items-start justify-between mb-3">
                <div>
                  <h3 class="text-xl font-bold text-dark-900 mb-1">{{ room.type_name }}</h3>
                  <div class="flex items-center gap-1 text-primary-400 text-sm">
                    <i v-for="n in 5" :key="n" class="fa-solid fa-star text-xs"></i>
                    <span class="text-dark-400 ml-1">(5.0)</span>
                  </div>
                </div>
              </div>

              <p class="text-dark-500 text-sm mb-4 line-clamp-2">
                {{ room.description }}
              </p>

              <div class="flex items-center gap-4 text-dark-500 text-xs mb-5">
                <span><i class="fa-solid fa-user-group text-primary-400 mr-1"></i>{{ room.capacity }} pers.</span>
                <span><i class="fa-solid fa-building text-primary-400 mr-1"></i>Étage {{ room.floor }}</span>
                <span><i class="fa-solid fa-wifi text-primary-400 mr-1"></i>Wifi</span>
              </div>

              <div class="flex items-center justify-between pt-4 border-t border-soft-200">
                <div>
                  <span class="text-2xl font-extrabold text-primary-500">{{ room.base_price }}€</span>
                  <span class="text-dark-400 text-sm"> / nuit</span>
                </div>
                <router-link :to="`/booking/${room.id}`" class="btn-primary text-sm !px-4 !py-2">
                  Réserver
                  <i class="fa-solid fa-arrow-right ml-1"></i>
                </router-link>
              </div>
            </div>
          </div>
        </div>

        <div class="text-center mt-12" data-aos="fade-up">
          <router-link to="/rooms" class="btn-outline">
            Voir toutes les chambres
            <i class="fa-solid fa-arrow-right ml-2"></i>
          </router-link>
        </div>
      </div>
    </section>

    <!-- ==================== SERVICES ==================== -->
    <section class="py-20 bg-white">
      <div class="max-w-7xl mx-auto px-4">
        <div class="text-center mb-14" data-aos="fade-up">
          <div class="section-subtitle">Ce que nous offrons</div>
          <h2 class="section-title">Des services pensés pour vous</h2>
        </div>

        <div v-if="loading" class="flex justify-center py-10">
          <div class="animate-spin rounded-full h-10 w-10 border-4 border-primary-400 border-t-transparent"></div>
        </div>

        <div v-else class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          <div
            v-for="(service, i) in services"
            :key="service.id"
            data-aos="zoom-in"
            :data-aos-delay="i * 80"
            class="text-center p-6 rounded-2xl bg-soft-100 hover:bg-primary-50 transition-all duration-300 hover:-translate-y-2 group cursor-pointer"
          >
            <div class="w-16 h-16 mx-auto mb-4 rounded-2xl bg-white shadow-soft flex items-center justify-center group-hover:scale-110 transition-transform">
              <i :class="service.icon" class="text-2xl text-primary-400"></i>
            </div>
            <h3 class="font-semibold text-dark-800 text-sm mb-1">{{ service.name }}</h3>
            <div class="text-primary-500 font-bold text-sm">{{ service.price }}€</div>
          </div>
        </div>
      </div>
    </section>

    <!-- ==================== WHY US ==================== -->
    <section class="py-20 bg-soft-100">
      <div class="max-w-7xl mx-auto px-4">
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div data-aos="fade-right">
            <img
              src="https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800"
              alt="Suite de luxe"
              class="rounded-3xl shadow-luxe w-full h-[500px] object-cover"
            />
          </div>
          <div data-aos="fade-left">
            <div class="section-subtitle">Pourquoi nous choisir</div>
            <h2 class="section-title mb-8">Une expérience<br>vraiment unique</h2>
            <div class="space-y-6">
              <div v-for="(feature, i) in features" :key="i" class="flex gap-4">
                <div class="flex-shrink-0 w-12 h-12 rounded-xl bg-primary-400 flex items-center justify-center text-white shadow-orange">
                  <i :class="feature.icon"></i>
                </div>
                <div>
                  <h3 class="font-bold text-dark-900 mb-1">{{ feature.title }}</h3>
                  <p class="text-dark-500 text-sm">{{ feature.desc }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ==================== CTA ==================== -->
    <section class="py-20 bg-dark-900 text-white relative overflow-hidden">
      <div class="absolute inset-0 opacity-10">
        <div class="absolute top-0 left-0 w-96 h-96 bg-primary-400 rounded-full blur-3xl"></div>
        <div class="absolute bottom-0 right-0 w-96 h-96 bg-primary-600 rounded-full blur-3xl"></div>
      </div>
      <div class="relative max-w-4xl mx-auto text-center px-4" data-aos="zoom-in">
        <h2 class="text-3xl md:text-5xl font-extrabold mb-6">
          Prêt à vivre l'expérience <span class="text-primary-400">Grand Hôtel</span> ?
        </h2>
        <p class="text-white/70 mb-8 text-lg">
          Réservez dès maintenant et profitez de nos offres exclusives.
        </p>
        <router-link to="/rooms" class="btn-primary text-lg !px-8 !py-4">
          <i class="fa-solid fa-calendar-check mr-2"></i>
          Réserver mon séjour
        </router-link>
      </div>
    </section>
  </div>
</template>

<script>
import { roomsApi, servicesApi } from '../../services/api';

export default {
  name: 'Home',
  data() {
    return {
      loading: true,
      error: null,
      rooms: [],
      services: [],
      searchForm: {
        checkIn: '',
        checkOut: '',
      },
      stats: [
        { icon: 'fa-solid fa-bed', value: '50+', label: 'Chambres' },
        { icon: 'fa-solid fa-user-group', value: '10K+', label: 'Clients heureux' },
        { icon: 'fa-solid fa-star', value: '5.0', label: 'Note moyenne' },
        { icon: 'fa-solid fa-award', value: '15', label: 'Années d\'expérience' },
      ],
      features: [
        { icon: 'fa-solid fa-shield-halved', title: 'Sécurité & Confiance', desc: 'Paiement sécurisé et données protégées.' },
        { icon: 'fa-solid fa-bolt', title: 'Réservation rapide', desc: 'Réservez en moins de 2 minutes.' },
        { icon: 'fa-solid fa-headset', title: 'Support 24/7', desc: 'Notre équipe est disponible à tout moment.' },
        { icon: 'fa-solid fa-medal', title: 'Qualité garantie', desc: 'Un service premium reconnu par nos clients.' },
      ],
    };
  },
  computed: {
    featuredRooms() {
      return this.rooms.slice(0, 3);
    },
  },
  async mounted() {
    await this.fetchData();
  },
  methods: {
    async fetchData() {
      this.loading = true;
      this.error = null;
      try {
        const [roomsRes, servicesRes] = await Promise.all([
          roomsApi.getAll(),
          servicesApi.getAll(),
        ]);
        this.rooms = roomsRes.data;
        this.services = servicesRes.data;
      } catch (err) {
        this.error = 'Impossible de charger les données. Vérifiez que le backend est démarré.';
        console.error(err);
      } finally {
        this.loading = false;
      }
    },
    handleSearch() {
      if (!this.searchForm.checkIn || !this.searchForm.checkOut) {
        alert('Veuillez sélectionner les dates d\'arrivée et de départ');
        return;
      }
      this.$router.push({
        path: '/rooms',
        query: {
          check_in: this.searchForm.checkIn,
          check_out: this.searchForm.checkOut,
        },
      });
    },
  },
};
</script>