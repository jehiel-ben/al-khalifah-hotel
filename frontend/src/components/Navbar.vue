<template>
  <header
    class="sticky top-0 z-50 transition-all duration-300"
    :class="scrolled
      ? 'bg-white/95 backdrop-blur-md shadow-soft py-3'
      : 'bg-white py-4'"
  >
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
      <!-- Logo -->
      <router-link to="/" class="flex items-center gap-2 group">
        <div class="w-11 h-11 rounded-xl bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center shadow-orange group-hover:scale-105 transition-transform">
          <i class="fa-solid fa-hotel text-white text-xl"></i>
        </div>
        <div class="leading-tight">
          <div class="font-bold text-lg text-dark-900">Al Khalifah Hôtel</div>
          <div class="text-xs text-primary-500 font-medium tracking-widest">LUXURY & HOSPITALITY</div>
        </div>
      </router-link>

      <!-- Menu desktop -->
      <nav class="hidden md:flex items-center gap-8">
        <router-link
          v-for="link in links"
          :key="link.to"
          :to="link.to"
          class="text-dark-600 hover:text-primary-500 font-medium text-sm transition-colors relative group"
        >
          {{ link.label }}
          <span class="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary-400 transition-all duration-300 group-hover:w-full"></span>
        </router-link>
      </nav>

      <!-- Actions -->
      <div class="flex items-center gap-3">
        <router-link to="/staff" class="hidden md:flex items-center gap-2 text-dark-600 hover:text-primary-500 text-sm font-medium transition-colors">
          <i class="fa-solid fa-user-tie"></i>
          <span>Staff</span>
        </router-link>
        <router-link to="/rooms" class="btn-primary text-sm !px-5 !py-2.5">
          <i class="fa-solid fa-calendar-check mr-2"></i>
          Réserver
        </router-link>

        <!-- Burger mobile -->
        <button
          @click="mobileOpen = !mobileOpen"
          class="md:hidden w-10 h-10 rounded-lg bg-soft-200 flex items-center justify-center text-dark-700"
        >
          <i :class="mobileOpen ? 'fa-solid fa-xmark' : 'fa-solid fa-bars'"></i>
        </button>
      </div>
    </div>

    <!-- Menu mobile -->
    <transition name="page">
      <div v-if="mobileOpen" class="md:hidden bg-white border-t border-soft-200 mt-3 px-4 py-4 space-y-2">
        <router-link
          v-for="link in links"
          :key="link.to"
          :to="link.to"
          @click="mobileOpen = false"
          class="block px-4 py-3 rounded-xl text-dark-700 hover:bg-soft-100 hover:text-primary-500 font-medium transition-colors"
        >
          <i :class="link.icon" class="mr-3 text-primary-400"></i>
          {{ link.label }}
        </router-link>
        <router-link
          to="/staff"
          @click="mobileOpen = false"
          class="block px-4 py-3 rounded-xl text-dark-700 hover:bg-soft-100 hover:text-primary-500 font-medium transition-colors"
        >
          <i class="fa-solid fa-user-tie mr-3 text-primary-400"></i>
          Espace Staff
        </router-link>
      </div>
    </transition>
  </header>
</template>

<script>
export default {
  name: 'Navbar',
  data() {
    return {
      scrolled: false,
      mobileOpen: false,
      links: [
        { to: '/', label: 'Accueil', icon: 'fa-solid fa-house' },
        { to: '/rooms', label: 'Chambres', icon: 'fa-solid fa-bed' },
        { to: '/services', label: 'Services', icon: 'fa-solid fa-concierge-bell' },
        { to: '/contact', label: 'Contact', icon: 'fa-solid fa-envelope' },
        { to: '/my-reservations', label: 'Mes réservations', icon: 'fa-solid fa-list-check' },
      ],
    };
  },
  mounted() {
    window.addEventListener('scroll', this.handleScroll);
  },
  beforeUnmount() {
    window.removeEventListener('scroll', this.handleScroll);
  },
  methods: {
    handleScroll() {
      this.scrolled = window.scrollY > 20;
    },
  },
};
</script>