<template>
  <div class="space-y-6">
    <!-- Header actions -->
    <div class="flex flex-wrap items-center justify-between gap-4">
      <div class="flex items-center gap-2 bg-white rounded-xl px-4 py-2.5 shadow-soft w-full md:w-80">
        <i class="fa-solid fa-magnifying-glass text-dark-400"></i>
        <input
          v-model="search"
          type="text"
          placeholder="Rechercher un service..."
          class="bg-transparent outline-none text-sm flex-1 text-dark-700"
        />
      </div>
      <button @click="openCreate" class="btn-primary text-sm">
        <i class="fa-solid fa-plus mr-2"></i>
        Nouveau service
      </button>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="flex justify-center py-20">
      <div class="animate-spin rounded-full h-12 w-12 border-4 border-primary-400 border-t-transparent"></div>
    </div>

    <!-- Cards grid -->
    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <div
        v-for="s in filteredServices"
        :key="s.id"
        class="bg-white rounded-2xl shadow-card p-5 hover:shadow-luxe transition-all"
      >
        <div class="flex items-start justify-between mb-3">
          <div class="w-12 h-12 rounded-xl bg-primary-50 flex items-center justify-center">
            <i :class="s.icon" class="text-primary-500 text-lg"></i>
          </div>
          <div class="flex gap-1">
            <button
              @click="openEdit(s)"
              class="w-8 h-8 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-600 flex items-center justify-center transition-colors"
            >
              <i class="fa-solid fa-pen text-xs"></i>
            </button>
            <button
              @click="openDelete(s)"
              class="w-8 h-8 rounded-lg bg-red-50 hover:bg-red-100 text-red-600 flex items-center justify-center transition-colors"
            >
              <i class="fa-solid fa-trash text-xs"></i>
            </button>
          </div>
        </div>
        <h3 class="font-bold text-dark-900 mb-1">{{ s.name }}</h3>
        <p class="text-dark-500 text-xs mb-3 line-clamp-2 min-h-[32px]">{{ s.description }}</p>
        <div class="flex items-center justify-between pt-3 border-t border-soft-200">
          <span class="text-primary-500 font-extrabold text-xl">{{ s.price }}€</span>
          <span
            class="badge"
            :class="s.is_active ? 'badge-green' : 'badge-gray'"
          >
            {{ s.is_active ? 'Actif' : 'Inactif' }}
          </span>
        </div>
      </div>

      <div v-if="filteredServices.length === 0" class="col-span-full py-12 text-center text-dark-400">
        <i class="fa-solid fa-concierge-bell text-3xl mb-2 block"></i>
        Aucun service trouvé
      </div>
    </div>

    <!-- Modal Create/Edit -->
    <Modal
      v-model="modalOpen"
      :title="editing ? 'Modifier le service' : 'Nouveau service'"
      :subtitle="editing ? 'Mettez à jour les informations' : 'Ajoutez un nouveau service'"
    >
      <div class="space-y-4">
        <div>
          <label class="text-xs font-semibold text-dark-600 uppercase mb-1 block">Nom *</label>
          <input v-model="form.name" type="text" class="input-field" placeholder="Petit-déjeuner, Spa..." />
          <p v-if="errors.name" class="text-red-500 text-xs mt-1">{{ errors.name }}</p>
        </div>
        <div>
          <label class="text-xs font-semibold text-dark-600 uppercase mb-1 block">Description</label>
          <textarea v-model="form.description" rows="3" class="input-field" placeholder="Description..."></textarea>
        </div>
        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="text-xs font-semibold text-dark-600 uppercase mb-1 block">Prix (€) *</label>
            <input v-model.number="form.price" type="number" min="0" step="0.5" class="input-field" placeholder="12" />
            <p v-if="errors.price" class="text-red-500 text-xs mt-1">{{ errors.price }}</p>
          </div>
          <div>
            <label class="text-xs font-semibold text-dark-600 uppercase mb-1 block">
              Icône Font Awesome
            </label>
            <input v-model="form.icon" type="text" class="input-field" placeholder="fa-solid fa-mug-hot" />
            <p class="text-dark-400 text-[10px] mt-1">Ex: fa-solid fa-spa, fa-solid fa-car</p>
          </div>
        </div>
        <div>
          <label class="flex items-center gap-2 cursor-pointer">
            <input v-model="form.is_active" type="checkbox" class="w-4 h-4 accent-primary-400" />
            <span class="text-sm text-dark-700">Service actif (visible par les clients)</span>
          </label>
        </div>
      </div>

      <template #footer>
        <div class="flex justify-end gap-3">
          <button @click="modalOpen = false" class="btn-outline !px-5 !py-2.5 text-sm">Annuler</button>
          <button @click="submit" :disabled="saving" class="btn-primary !px-5 !py-2.5 text-sm">
            <span v-if="saving"><i class="fa-solid fa-spinner fa-spin mr-2"></i>Enregistrement...</span>
            <span v-else>{{ editing ? 'Mettre à jour' : 'Créer' }}</span>
          </button>
        </div>
      </template>
    </Modal>

    <!-- Confirm delete -->
    <ConfirmDialog
      v-model="confirmOpen"
      title="Supprimer ce service ?"
      :message="`Voulez-vous vraiment supprimer '${selected?.name}' ?`"
      @confirm="deleteItem"
    />
  </div>
</template>

<script>
import { servicesApi } from '../../services/api';
import Modal from '../../components/Modal.vue';
import ConfirmDialog from '../../components/ConfirmDialog.vue';

export default {
  name: 'StaffServices',
  components: { Modal, ConfirmDialog },
  data() {
    return {
      loading: true,
      saving: false,
      services: [],
      search: '',
      modalOpen: false,
      confirmOpen: false,
      editing: false,
      selected: null,
      form: { name: '', description: '', price: 0, icon: 'fa-solid fa-star', is_active: 1 },
      errors: {},
    };
  },
  computed: {
    filteredServices() {
      if (!this.search) return this.services;
      const q = this.search.toLowerCase();
      return this.services.filter(
        (s) => s.name.toLowerCase().includes(q) || s.description.toLowerCase().includes(q)
      );
    },
  },
  async mounted() {
    await this.fetch();
  },
  methods: {
    async fetch() {
      this.loading = true;
      try {
        const res = await servicesApi.getAll();
        this.services = res.data;
      } catch (err) {
        console.error(err);
      } finally {
        this.loading = false;
      }
    },
    openCreate() {
      this.editing = false;
      this.selected = null;
      this.form = { name: '', description: '', price: 0, icon: 'fa-solid fa-star', is_active: 1 };
      this.errors = {};
      this.modalOpen = true;
    },
    openEdit(s) {
      this.editing = true;
      this.selected = s;
      this.form = { ...s, is_active: s.is_active ? 1 : 0 };
      this.errors = {};
      this.modalOpen = true;
    },
    openDelete(s) {
      this.selected = s;
      this.confirmOpen = true;
    },
    validate() {
      this.errors = {};
      if (!this.form.name?.trim()) this.errors.name = 'Le nom est obligatoire';
      if (this.form.price == null || this.form.price < 0) this.errors.price = 'Prix invalide';
      return Object.keys(this.errors).length === 0;
    },
    async submit() {
      if (!this.validate()) return;
      this.saving = true;
      try {
        const payload = {
          name: this.form.name,
          description: this.form.description,
          price: this.form.price,
          icon: this.form.icon,
          is_active: this.form.is_active ? 1 : 0,
        };
        if (this.editing) {
          await servicesApi.update(this.selected.id, payload);
        } else {
          await servicesApi.create(payload);
        }
        this.modalOpen = false;
        await this.fetch();
      } catch (err) {
        alert(err.response?.data?.error || 'Erreur');
      } finally {
        this.saving = false;
      }
    },
    async deleteItem() {
      try {
        await servicesApi.delete(this.selected.id);
        await this.fetch();
      } catch (err) {
        alert(err.response?.data?.error || 'Impossible de supprimer');
      }
    },
  },
};
</script>