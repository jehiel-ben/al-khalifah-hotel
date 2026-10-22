<template>
  <header class="bg-white border-b border-soft-200 sticky top-0 z-20">
    <div class="flex items-center justify-between px-4 lg:px-6 py-3">
      <!-- Burger mobile + titre -->
      <div class="flex items-center gap-3">
        <button
          @click="$emit('toggle-sidebar')"
          class="lg:hidden w-10 h-10 rounded-lg bg-soft-200 flex items-center justify-center"
        >
          <i class="fa-solid fa-bars text-dark-700"></i>
        </button>
        <div>
          <h1 class="font-bold text-dark-900 text-lg">{{ title }}</h1>
          <p class="text-dark-400 text-xs">{{ subtitle }}</p>
        </div>
      </div>

      <!-- Actions -->
      <div class="flex items-center gap-3">
        <!-- Search (caché mobile) -->
        <div class="hidden md:flex items-center gap-2 bg-soft-100 rounded-xl px-3 py-2 w-64">
          <i class="fa-solid fa-magnifying-glass text-dark-400"></i>
          <input
            type="text"
            placeholder="Rechercher..."
            class="bg-transparent outline-none text-sm flex-1 text-dark-700"
          />
        </div>

        <!-- Notif -->
        <button class="w-10 h-10 rounded-xl bg-soft-100 hover:bg-soft-200 flex items-center justify-center relative">
          <i class="fa-solid fa-bell text-dark-600"></i>
          <span class="absolute top-2 right-2 w-2 h-2 bg-primary-500 rounded-full"></span>
        </button>

        <!-- User -->
        <div class="flex items-center gap-2 pl-3 border-l border-soft-200">
          <div class="w-9 h-9 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white text-sm font-bold">
            AD
          </div>
          <div class="hidden md:block">
            <div class="text-sm font-semibold text-dark-800">Admin</div>
            <div class="text-xs text-dark-400">Staff</div>
          </div>
        </div>
      </div>
    </div>
  </header>
</template>

<script>
export default {
  name: 'StaffTopbar',
  props: {
    title: { type: String, default: 'Dashboard' },
    subtitle: { type: String, default: 'Vue d\'ensemble' },
  },
  emits: ['toggle-sidebar'],
};
</script>