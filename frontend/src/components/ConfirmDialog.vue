<template>
  <transition name="page">
    <div
      v-if="modelValue"
      class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
      @click.self="cancel"
    >
      <div class="bg-white rounded-2xl shadow-luxe w-full max-w-md p-6 text-center animate-slide-up">
        <div class="w-16 h-16 mx-auto mb-4 rounded-full bg-red-100 flex items-center justify-center">
          <i class="fa-solid fa-triangle-exclamation text-red-500 text-2xl"></i>
        </div>
        <h3 class="text-xl font-bold text-dark-900 mb-2">{{ title }}</h3>
        <p class="text-dark-500 mb-6">{{ message }}</p>
        <div class="flex gap-3 justify-center">
          <button @click="cancel" class="btn-outline !px-5 !py-2.5 text-sm">
            Annuler
          </button>
          <button
            @click="confirm"
            class="bg-red-500 hover:bg-red-600 text-white font-semibold px-5 py-2.5 rounded-xl transition-all"
          >
            <i class="fa-solid fa-trash mr-2"></i>
            Supprimer
          </button>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
export default {
  name: 'ConfirmDialog',
  props: {
    modelValue: { type: Boolean, default: false },
    title: { type: String, default: 'Confirmer la suppression' },
    message: { type: String, default: 'Êtes-vous sûr ? Cette action est irréversible.' },
  },
  emits: ['update:modelValue', 'confirm'],
  methods: {
    cancel() {
      this.$emit('update:modelValue', false);
    },
    confirm() {
      this.$emit('confirm');
      this.$emit('update:modelValue', false);
    },
  },
};
</script>