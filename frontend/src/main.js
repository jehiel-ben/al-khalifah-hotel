import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import './style.css';

// 👇 NOUVEAU POUR LES NOTIFICATIONS
import Toast from 'vue-toastification/dist/index.mjs';
import 'vue-toastification/dist/index.css';

const app = createApp(App);

// 👇 OPTIONS DES NOTIFICATIONS
app.use(Toast, {
  position: 'top-right',
  timeout: 4000,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
});

app.use(router);

// AOS
import AOS from 'aos';
import 'aos/dist/aos.css';
AOS.init({ duration: 700, easing: 'ease-out-cubic', once: true, offset: 80 });

app.mount('#app');