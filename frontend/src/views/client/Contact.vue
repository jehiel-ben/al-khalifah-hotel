<template>
  <div>
    <!-- Bannière -->
    <section class="relative h-[45vh] min-h-[350px] flex items-center justify-center overflow-hidden">
      <div class="absolute inset-0 bg-cover bg-center"
        style="background-image: url('https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1920')">
      </div>
      <div class="absolute inset-0 bg-gradient-to-b from-dark-900/80 to-dark-900/60"></div>
      <div class="relative z-10 text-center text-white px-4" data-aos="fade-up">
        <div class="text-primary-400 uppercase tracking-widest text-sm font-bold mb-3">Contactez-nous</div>
        <h1 class="text-4xl md:text-6xl font-extrabold mb-4">Nous sommes là</h1>
        <p class="text-white/80 max-w-2xl mx-auto">
          Une question, une demande spéciale ? Notre équipe vous répond 24h/24.
        </p>
      </div>
    </section>

    <!-- Contenu -->
    <section class="py-20 bg-soft-100">
      <div class="max-w-7xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-2 gap-10">
        <!-- Formulaire -->
        <div class="bg-white rounded-2xl shadow-card p-8" data-aos="fade-right">
          <h2 class="text-2xl font-bold text-dark-900 mb-2">Envoyez-nous un message</h2>
          <p class="text-dark-500 text-sm mb-6">Nous vous répondrons sous 24h.</p>

          <form @submit.prevent="submit" class="space-y-4">
            <div>
              <label class="text-xs font-semibold text-dark-600 uppercase mb-1 block">Nom complet *</label>
              <input v-model="form.name" type="text" class="input-field" placeholder="Jean Dupont" />
            </div>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="text-xs font-semibold text-dark-600 uppercase mb-1 block">Email *</label>
                <input v-model="form.email" type="email" class="input-field" placeholder="jean@email.com" />
              </div>
              <div>
                <label class="text-xs font-semibold text-dark-600 uppercase mb-1 block">Téléphone</label>
                <input v-model="form.phone" type="tel" class="input-field" placeholder="+000 00 00 00 00" />
              </div>
            </div>
            <div>
              <label class="text-xs font-semibold text-dark-600 uppercase mb-1 block">Sujet *</label>
              <input v-model="form.subject" type="text" class="input-field" placeholder="Demande d'information" />
            </div>
            <div>
              <label class="text-xs font-semibold text-dark-600 uppercase mb-1 block">Message *</label>
              <textarea v-model="form.message" rows="5" class="input-field" placeholder="Votre message..."></textarea>
            </div>

            <div v-if="success" class="bg-green-50 border border-green-200 rounded-xl p-4 text-sm text-green-700">
              <i class="fa-solid fa-circle-check mr-2"></i>
              {{ success }}
            </div>

            <button type="submit" class="btn-primary w-full" :disabled="sending">
              <span v-if="sending"><i class="fa-solid fa-spinner fa-spin mr-2"></i>Envoi...</span>
              <span v-else><i class="fa-solid fa-paper-plane mr-2"></i>Envoyer le message</span>
            </button>
          </form>
        </div>

        <!-- Infos -->
        <div class="space-y-6" data-aos="fade-left">
          <div class="bg-white rounded-2xl shadow-card p-6 flex items-start gap-4">
            <div class="w-12 h-12 rounded-xl bg-primary-50 flex items-center justify-center flex-shrink-0">
              <i class="fa-solid fa-location-dot text-primary-500 text-xl"></i>
            </div>
            <div>
              <h3 class="font-bold text-dark-900 mb-1">Adresse</h3>
              <p class="text-dark-500 text-sm">Q. Kigobe, Avenue de l'Indépendance, BP 45<br>Burundi, Bujumbura-Mairie</p>
            </div>
          </div>

          <div class="bg-white rounded-2xl shadow-card p-6 flex items-start gap-4">
            <div class="w-12 h-12 rounded-xl bg-primary-50 flex items-center justify-center flex-shrink-0">
              <i class="fa-solid fa-phone text-primary-500 text-xl"></i>
            </div>
            <div>
              <h3 class="font-bold text-dark-900 mb-1">Téléphone</h3>
              <p class="text-dark-500 text-sm">+257 65 19 60 31<br>Disponible 24h/24</p>
            </div>
          </div>

          <div class="bg-white rounded-2xl shadow-card p-6 flex items-start gap-4">
            <div class="w-12 h-12 rounded-xl bg-primary-50 flex items-center justify-center flex-shrink-0">
              <i class="fa-solid fa-envelope text-primary-500 text-xl"></i>
            </div>
            <div>
              <h3 class="font-bold text-dark-900 mb-1">Email</h3>
              <p class="text-dark-500 text-sm">contact@alkhalifahhotel.com<br>reservation@alkhalifahhotel.com</p>
            </div>
          </div>

          <div class="bg-dark-900 text-white rounded-2xl shadow-luxe p-6">
            <h3 class="font-bold text-lg mb-2 text-primary-400">Horaires</h3>
            <ul class="space-y-1 text-sm text-white/80">
              <li class="flex justify-between"><span>Réception</span><span>24h/24</span></li>
              <li class="flex justify-between"><span>Restaurant</span><span>7h - 23h</span></li>
              <li class="flex justify-between"><span>Spa</span><span>9h - 21h</span></li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
export default {
  name: 'ContactPage',
  data() {
    return {
      form: { name: '', email: '', phone: '', subject: '', message: '' },
      sending: false,
      success: null,
    };
  },
  methods: {
    async submit() {
      if (!this.form.name || !this.form.email || !this.form.subject || !this.form.message) {
        alert('Veuillez remplir tous les champs obligatoires');
        return;
      }
      this.sending = true;
      this.success = null;

      // Simulation d'envoi (pas de vrai backend)
      await new Promise((r) => setTimeout(r, 1000));

      this.success = `Merci ${this.form.name} ! Votre message a bien été envoyé. Nous vous répondrons sous 24h.`;
      this.form = { name: '', email: '', phone: '', subject: '', message: '' };
      this.sending = false;
    },
  },
};
</script>