<template>
  <transition name="page">
    <button
      v-if="visible"
      @click="scrollToTop"
      class="fixed bottom-6 right-6 z-40 w-12 h-12 rounded-full bg-primary-400 hover:bg-primary-500 text-white shadow-orange flex items-center justify-center transition-all hover:scale-110"
      aria-label="Retour en haut"
    >
      <i class="fa-solid fa-arrow-up"></i>
    </button>
  </transition>
</template>

<script>
export default {
  name: 'ScrollTop',
  data() {
    return { visible: false };
  },
  mounted() {
    window.addEventListener('scroll', this.handleScroll);
  },
  beforeUnmount() {
    window.removeEventListener('scroll', this.handleScroll);
  },
  methods: {
    handleScroll() {
      this.visible = window.scrollY > 400;
    },
    scrollToTop() {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    },
  },
};
</script>