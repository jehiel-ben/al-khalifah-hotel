import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import './style.css';

// AOS
import AOS from 'aos';
import 'aos/dist/aos.css';

const app = createApp(App);

app.use(router);

AOS.init({
  duration: 700,
  easing: 'ease-out-cubic',
  once: true,
  offset: 80,
});

app.mount('#app');