<template>
  <aside
    class="fixed lg:static inset-y-0 left-0 z-40 w-64 bg-dark-900 text-white transform transition-transform duration-300 lg:translate-x-0 flex flex-col"
    :class="open ? 'translate-x-0' : '-translate-x-full'"
  >
    <!-- Logo -->
    <div class="p-6 border-b border-dark-800">
      <router-link to="/" class="flex items-center gap-2 group">
        <div class="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center">
          <i class="fa-solid fa-hotel text-white"></i>
        </div>
        <div class="leading-tight">
          <div class="font-bold text-sm">Al Khalifah Hôtel</div>
          <div class="text-[10px] text-primary-400 tracking-widest">STAFF PANEL</div>
        </div>
      </router-link>
    </div>

    <!-- Menu -->
    <nav class="flex-1 overflow-y-auto p-4 space-y-1">
      <div class="text-[10px] font-bold text-dark-400 uppercase tracking-widest px-3 pt-2 pb-2">
        Principal
      </div>
      <router-link
        v-for="item in mainItems"
        :key="item.to"
        :to="item.to"
        class="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors"
        :class="isActive(item.to)
          ? 'bg-primary-400 text-white shadow-orange'
          : 'text-dark-200 hover:bg-dark-800 hover:text-white'"
      >
        <i :class="item.icon" class="w-5 text-center"></i>
        <span>{{ item.label }}</span>
      </router-link>

      <div class="text-[10px] font-bold text-dark-400 uppercase tracking-widest px-3 pt-6 pb-2">
        Gestion
      </div>
      <router-link
        v-for="item in managementItems"
        :key="item.to"
        :to="item.to"
        class="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors"
        :class="isActive(item.to)
          ? 'bg-primary-400 text-white shadow-orange'
          : 'text-dark-200 hover:bg-dark-800 hover:text-white'"
      >
        <i :class="item.icon" class="w-5 text-center"></i>
        <span>{{ item.label }}</span>
      </router-link>
    </nav>

    <!-- Footer -->
    <div class="p-4 border-t border-dark-800">
      <router-link to="/" class="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-dark-200 hover:bg-dark-800 hover:text-white transition-colors">
        <i class="fa-solid fa-arrow-left w-5 text-center"></i>
        <span>Retour au site</span>
      </router-link>
    </div>
  </aside>

  <!-- Overlay mobile -->
  <transition name="page">
    <div
      v-if="open"
      @click="$emit('close')"
      class="fixed inset-0 bg-black/50 z-30 lg:hidden"
    ></div>
  </transition>
</template>

<script>
export default {
  name: 'StaffSidebar',
  props: {
    open: { type: Boolean, default: false },
  },
  emits: ['close'],
  data() {
    return {
      mainItems: [
        { to: '/staff', label: 'Dashboard', icon: 'fa-solid fa-chart-line' },
        { to: '/staff/reservations', label: 'Réservations', icon: 'fa-solid fa-calendar-check' },
        { to: '/staff/payments', label: 'Paiements', icon: 'fa-solid fa-credit-card' },
      ],
      managementItems: [
        { to: '/staff/rooms', label: 'Chambres', icon: 'fa-solid fa-bed' },
        { to: '/staff/room-types', label: 'Types de chambres', icon: 'fa-solid fa-door-open' },
        { to: '/staff/services', label: 'Services', icon: 'fa-solid fa-concierge-bell' },
      ],
    };
  },
  methods: {
    isActive(path) {
      if (path === '/staff') return this.$route.path === '/staff';
      return this.$route.path.startsWith(path);
    },
  },
};
</script>