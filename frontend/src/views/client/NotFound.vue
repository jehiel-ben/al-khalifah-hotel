<template>
  <div class="min-h-screen bg-soft-100 flex items-center justify-center px-4 py-20">
    <div class="text-center max-w-lg">
      <div class="text-9xl font-extrabold text-primary-400 mb-4">404</div>
      <h1 class="text-3xl md:text-4xl font-extrabold text-dark-900 mb-3">
        Page introuvable
      </h1>
      <p class="text-dark-500 mb-8">
        Désolé, la page que vous cherchez n'existe pas ou a été déplacée.
      </p>
      <div class="flex flex-col sm:flex-row gap-3 justify-center">
        <router-link to="/" class="btn-primary">
          <i class="fa-solid fa-house mr-2"></i>
          Retour à l'accueil
        </router-link>
        <router-link to="/rooms" class="btn-outline">
          <i class="fa-solid fa-bed mr-2"></i>
          Voir les chambres
        </router-link>
      </div>
    </div>
  </div>
</template>

<script>
export default { name: 'NotFound' };
</script>