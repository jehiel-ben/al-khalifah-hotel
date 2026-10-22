<template>
  <div class="min-h-screen flex flex-col bg-soft-100">
    <Navbar />

    <main class="flex-1">
      <router-view v-slot="{ Component }">
        <transition name="page" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </main>

    <Footer />
    <ScrollTop />
  </div>
</template>

<script>
import Navbar from './components/Navbar.vue';
import Footer from './components/Footer.vue';
import ScrollTop from './components/ScrollTop.vue';

export default {
  name: 'App',
  components: { Navbar, Footer, ScrollTop },
};
</script>