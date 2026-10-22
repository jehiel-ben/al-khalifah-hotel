<template>
  <div>
    <!-- Bannière -->
    <section class="relative h-[45vh] min-h-[350px] flex items-center justify-center overflow-hidden">
      <div class="absolute inset-0 bg-cover bg-center"
        style="background-image: url('https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=1920')">
      </div>
      <div class="absolute inset-0 bg-gradient-to-b from-dark-900/80 to-dark-900/60"></div>
      <div class="relative z-10 text-center text-white px-4" data-aos="fade-up">
        <div class="text-primary-400 uppercase tracking-widest text-sm font-bold mb-3">Nos prestations</div>
        <h1 class="text-4xl md:text-6xl font-extrabold mb-4">Services & Confort</h1>
        <p class="text-white/80 max-w-2xl mx-auto">
          Découvrez tous les services pensés pour rendre votre séjour inoubliable.
        </p>
      </div>
    </section>

    <!-- Services -->
    <section class="py-20 bg-white">
      <div class="max-w-7xl mx-auto px-4">
        <div v-if="loading" class="flex justify-center py-20">
          <div class="animate-spin rounded-full h-14 w-14 border-4 border-primary-400 border-t-transparent"></div>
        </div>

        <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div
            v-for="(s, i) in services"
            :key="s.id"
            class="bg-white rounded-2xl shadow-card p-8 hover:shadow-luxe transition-all hover:-translate-y-1"
            data-aos="fade-up"
            :data-aos-delay="(i % 6) * 80"
          >
            <div class="w-16 h-16 rounded-2xl bg-primary-50 flex items-center justify-center mb-5">
              <i :class="s.icon" class="text-primary-500 text-2xl"></i>
            </div>
            <h3 class="text-xl font-bold text-dark-900 mb-2">{{ s.name }}</h3>
            <p class="text-dark-500 text-sm mb-5 min-h-[40px]">{{ s.description }}</p>
            <div class="flex items-center justify-between pt-4 border-t border-soft-200">
              <span class="text-2xl font-extrabold text-primary-500">{{ s.price }}€</span>
              <router-link to="/rooms" class="btn-outline text-xs !px-3 !py-2">
                Réserver
                <i class="fa-solid fa-arrow-right ml-1"></i>
              </router-link>
            </div>
          </div>
        </div>

        <div class="text-center mt-12" data-aos="fade-up">
          <router-link to="/rooms" class="btn-primary">
            <i class="fa-solid fa-bed mr-2"></i>
            Voir nos chambres
          </router-link>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import { servicesApi } from '../../services/api';

export default {
  name: 'ServicesPage',
  data() {
    return { loading: true, services: [] };
  },
  async mounted() {
    try {
      const res = await servicesApi.getAll();
      this.services = res.data.filter((s) => s.is_active);
    } catch (err) {
      console.error(err);
    } finally {
      this.loading = false;
    }
  },
};
</script>