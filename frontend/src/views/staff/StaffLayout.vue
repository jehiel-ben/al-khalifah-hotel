<template>
  <div class="flex min-h-screen bg-soft-100">
    <StaffSidebar :open="sidebarOpen" @close="sidebarOpen = false" />

    <div class="flex-1 flex flex-col min-w-0">
      <StaffTopbar
        :title="pageTitle"
        :subtitle="pageSubtitle"
        @toggle-sidebar="sidebarOpen = !sidebarOpen"
      />

      <main class="flex-1 p-4 lg:p-6">
        <router-view />
      </main>
    </div>
  </div>
</template>

<script>
import StaffSidebar from '../../components/StaffSidebar.vue';
import StaffTopbar from '../../components/StaffTopbar.vue';

export default {
  name: 'StaffLayout',
  components: { StaffSidebar, StaffTopbar },
  data() {
    return { sidebarOpen: false };
  },
  computed: {
    pageTitle() {
      return this.$route.meta.title || 'Dashboard';
    },
    pageSubtitle() {
      return this.$route.meta.subtitle || '';
    },
  },
};
</script>