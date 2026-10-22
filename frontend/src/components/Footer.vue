<template>
  <footer class="bg-dark-900 text-white pt-16 pb-8 mt-20">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
        <!-- Colonne 1 : Logo + description -->
        <div>
          <div class="flex items-center gap-2 mb-4">
            <div class="w-11 h-11 rounded-xl bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center">
              <i class="fa-solid fa-hotel text-white text-xl"></i>
            </div>
            <div>
              <div class="font-bold text-lg">Al Khalifah Hôtel</div>
              <div class="text-xs text-primary-400 tracking-widest">LUXURY & HOSPITALITY</div>
            </div>
          </div>
          <p class="text-dark-300 text-sm leading-relaxed mb-6">
            Vivez une expérience hôtelière inoubliable au cœur de la ville. Confort, élégance et service exceptionnel.
          </p>
          <div class="flex gap-3">
            <a v-for="s in socials" :key="s.icon" href="#" class="w-10 h-10 rounded-lg bg-dark-800 hover:bg-primary-400 flex items-center justify-center transition-colors">
              <i :class="s.icon"></i>
            </a>
          </div>
        </div>

        <!-- Colonne 2 : Liens -->
        <div>
          <h4 class="font-bold text-lg mb-4 text-primary-400">Navigation</h4>
          <ul class="space-y-3 text-dark-300 text-sm">
            <li><router-link to="/" class="hover:text-primary-400 transition-colors">Accueil</router-link></li>
            <li><router-link to="/rooms" class="hover:text-primary-400 transition-colors">Nos Chambres</router-link></li>
            <li><router-link to="/rooms" class="hover:text-primary-400 transition-colors">Services</router-link></li>
            <li><router-link to="/staff" class="hover:text-primary-400 transition-colors">Espace Staff</router-link></li>
          </ul>
        </div>

        <!-- Colonne 3 : Services -->
        <div>
          <h4 class="font-bold text-lg mb-4 text-primary-400">Nos Services</h4>
          <ul class="space-y-3 text-dark-300 text-sm">
            <li><i class="fa-solid fa-mug-hot mr-2 text-primary-400"></i>Petit-déjeuner</li>
            <li><i class="fa-solid fa-spa mr-2 text-primary-400"></i>Spa & Massage</li>
            <li><i class="fa-solid fa-car mr-2 text-primary-400"></i>Transfert aéroport</li>
            <li><i class="fa-solid fa-shirt mr-2 text-primary-400"></i>Blanchisserie</li>
          </ul>
        </div>

        <!-- Colonne 4 : Contact -->
        <div>
          <h4 class="font-bold text-lg mb-4 text-primary-400">Contact</h4>
          <ul class="space-y-3 text-dark-300 text-sm">
            <li class="flex items-start gap-3">
              <i class="fa-solid fa-location-dot text-primary-400 mt-1"></i>
              <span>Q.Kigobe, Avenue de l'Indépendance, BP 46<br>Burundi, Bujumbura-Mairie</span>
            </li>
            <li class="flex items-center gap-3">
              <i class="fa-solid fa-phone text-primary-400"></i>
              <span>+257 65 19 60 31</span>
            </li>
            <li class="flex items-center gap-3">
              <i class="fa-solid fa-envelope text-primary-400"></i>
              <span>contact@alkhalifahhotel.com</span>
            </li>
          </ul>
        </div>
      </div>

      <div class="border-t border-dark-800 pt-6 flex flex-col md:flex-row items-center justify-between gap-4 text-dark-400 text-sm">
        <p>© {{ year }} AL Khalifah Hôtel. Tous droits réservés.</p>
        <p>Conçu avec <i class="fa-solid fa-heart text-primary-400"></i> pour votre confort</p>
      </div>
    </div>
  </footer>
</template>

<script>
export default {
  name: 'Footer',
  data() {
    return {
      year: new Date().getFullYear(),
      socials: [
        { icon: 'fa-brands fa-facebook-f' },
        { icon: 'fa-brands fa-instagram' },
        { icon: 'fa-brands fa-twitter' },
        { icon: 'fa-brands fa-linkedin-in' },
      ],
    };
  },
};
</script>