<template>
  <transition name="page">
    <div
      v-if="modelValue"
      class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
      @click.self="close"
    >
      <div
        class="bg-white rounded-2xl shadow-luxe w-full max-w-lg max-h-[90vh] overflow-hidden flex flex-col animate-slide-up"
      >
        <!-- Header -->
        <div class="flex items-center justify-between p-6 border-b border-soft-200">
          <div>
            <h3 class="text-xl font-bold text-dark-900">{{ title }}</h3>
            <p v-if="subtitle" class="text-dark-400 text-xs mt-1">{{ subtitle }}</p>
          </div>
          <button
            @click="close"
            class="w-9 h-9 rounded-lg bg-soft-100 hover:bg-soft-200 flex items-center justify-center transition-colors"
          >
            <i class="fa-solid fa-xmark text-dark-600"></i>
          </button>
        </div>

        <!-- Body -->
        <div class="p-6 overflow-y-auto flex-1">
          <slot />
        </div>

        <!-- Footer -->
        <div v-if="$slots.footer" class="p-6 border-t border-soft-200 bg-soft-50">
          <slot name="footer" />
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
export default {
  name: 'Modal',
  props: {
    modelValue: { type: Boolean, default: false },
    title: { type: String, default: '' },
    subtitle: { type: String, default: '' },
  },
  emits: ['update:modelValue'],
  methods: {
    close() {
      this.$emit('update:modelValue', false);
    },
  },
};
</script>