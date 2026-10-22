<template>
  <div class="space-y-6">
    <!-- Header actions -->
    <div class="flex flex-wrap items-center justify-between gap-4">
      <div class="flex items-center gap-2 bg-white rounded-xl px-4 py-2.5 shadow-soft w-full md:w-80">
        <i class="fa-solid fa-magnifying-glass text-dark-400"></i>
        <input
          v-model="search"
          type="text"
          placeholder="Rechercher un type..."
          class="bg-transparent outline-none text-sm flex-1 text-dark-700"
        />
      </div>
      <button @click="openCreate" class="btn-primary text-sm">
        <i class="fa-solid fa-plus mr-2"></i>
        Nouveau type
      </button>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="flex justify-center py-20">
      <div class="animate-spin rounded-full h-12 w-12 border-4 border-primary-400 border-t-transparent"></div>
    </div>

    <!-- Table -->
    <div v-else class="bg-white rounded-2xl shadow-card overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full text-sm">
          <thead class="bg-soft-100">
            <tr>
              <th class="text-left py-4 px-6 font-bold text-dark-700 uppercase text-xs tracking-wider">Nom</th>
              <th class="text-left py-4 px-6 font-bold text-dark-700 uppercase text-xs tracking-wider">Description</th>
              <th class="text-center py-4 px-6 font-bold text-dark-700 uppercase text-xs tracking-wider">Capacité</th>
              <th class="text-right py-4 px-6 font-bold text-dark-700 uppercase text-xs tracking-wider">Prix base</th>
              <th class="text-right py-4 px-6 font-bold text-dark-700 uppercase text-xs tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="t in filteredTypes"
              :key="t.id"
              class="border-t border-soft-200 hover:bg-soft-50 transition-colors"
            >
              <td class="py-4 px-6 font-semibold text-dark-900">
                <i class="fa-solid fa-door-open text-primary-400 mr-2"></i>
                {{ t.name }}
              </td>
              <td class="py-4 px-6 text-dark-500 text-xs max-w-xs truncate">
                {{ t.description }}
              </td>
              <td class="py-4 px-6 text-center text-dark-600">
                <i class="fa-solid fa-user-group text-primary-400 mr-1"></i>
                {{ t.capacity }}
              </td>
              <td class="py-4 px-6 text-right font-bold text-primary-500">
                {{ t.base_price }}€
              </td>
              <td class="py-4 px-6 text-right">
                <div class="flex items-center justify-end gap-2">
                  <button
                    @click="openEdit(t)"
                    class="w-9 h-9 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-600 flex items-center justify-center transition-colors"
                  >
                    <i class="fa-solid fa-pen"></i>
                  </button>
                  <button
                    @click="openDelete(t)"
                    class="w-9 h-9 rounded-lg bg-red-50 hover:bg-red-100 text-red-600 flex items-center justify-center transition-colors"
                  >
                    <i class="fa-solid fa-trash"></i>
                  </button>
                </div>
              </td>
            </tr>
            <tr v-if="filteredTypes.length === 0">
              <td colspan="5" class="py-12 text-center text-dark-400">
                <i class="fa-solid fa-door-open text-3xl mb-2 block"></i>
                Aucun type de chambre trouvé
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Modal Create/Edit -->
    <Modal
      v-model="modalOpen"
      :title="editing ? 'Modifier le type' : 'Nouveau type de chambre'"
      :subtitle="editing ? 'Mettez à jour les informations' : 'Créez une nouvelle catégorie'"
    >
      <div class="space-y-4">
        <div>
          <label class="text-xs font-semibold text-dark-600 uppercase mb-1 block">Nom *</label>
          <input v-model="form.name" type="text" class="input-field" placeholder="Single, Double, Suite..." />
          <p v-if="errors.name" class="text-red-500 text-xs mt-1">{{ errors.name }}</p>
        </div>
        <div>
          <label class="text-xs font-semibold text-dark-600 uppercase mb-1 block">Description</label>
          <textarea v-model="form.description" rows="3" class="input-field" placeholder="Description..."></textarea>
        </div>
        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="text-xs font-semibold text-dark-600 uppercase mb-1 block">Prix de base (€) *</label>
            <input v-model.number="form.base_price" type="number" min="0" class="input-field" placeholder="45" />
            <p v-if="errors.base_price" class="text-red-500 text-xs mt-1">{{ errors.base_price }}</p>
          </div>
          <div>
            <label class="text-xs font-semibold text-dark-600 uppercase mb-1 block">Capacité *</label>
            <input v-model.number="form.capacity" type="number" min="1" class="input-field" placeholder="2" />
            <p v-if="errors.capacity" class="text-red-500 text-xs mt-1">{{ errors.capacity }}</p>
          </div>
        </div>
      </div>

      <template #footer>
        <div class="flex justify-end gap-3">
          <button @click="modalOpen = false" class="btn-outline !px-5 !py-2.5 text-sm">
            Annuler
          </button>
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
      title="Supprimer ce type ?"
      :message="`Voulez-vous vraiment supprimer '${selected?.name}' ? Impossible si des chambres l'utilisent.`"
      @confirm="deleteItem"
    />
  </div>
</template>

<script>
import { roomTypesApi } from '../../services/api';
import Modal from '../../components/Modal.vue';
import ConfirmDialog from '../../components/ConfirmDialog.vue';

export default {
  name: 'StaffRoomTypes',
  components: { Modal, ConfirmDialog },
  data() {
    return {
      loading: true,
      saving: false,
      types: [],
      search: '',
      modalOpen: false,
      confirmOpen: false,
      editing: false,
      selected: null,
      form: { name: '', description: '', base_price: 0, capacity: 1 },
      errors: {},
    };
  },
  computed: {
    filteredTypes() {
      if (!this.search) return this.types;
      const q = this.search.toLowerCase();
      return this.types.filter((t) => t.name.toLowerCase().includes(q));
    },
  },
  async mounted() {
    await this.fetch();
  },
  methods: {
    async fetch() {
      this.loading = true;
      try {
        const res = await roomTypesApi.getAll();
        this.types = res.data;
      } catch (err) {
        console.error(err);
      } finally {
        this.loading = false;
      }
    },
    openCreate() {
      this.editing = false;
      this.selected = null;
      this.form = { name: '', description: '', base_price: 0, capacity: 1 };
      this.errors = {};
      this.modalOpen = true;
    },
    openEdit(t) {
      this.editing = true;
      this.selected = t;
      this.form = { ...t };
      this.errors = {};
      this.modalOpen = true;
    },
    openDelete(t) {
      this.selected = t;
      this.confirmOpen = true;
    },
    validate() {
      this.errors = {};
      if (!this.form.name?.trim()) this.errors.name = 'Le nom est obligatoire';
      if (!this.form.base_price || this.form.base_price <= 0) this.errors.base_price = 'Prix invalide';
      if (!this.form.capacity || this.form.capacity < 1) this.errors.capacity = 'Capacité invalide';
      return Object.keys(this.errors).length === 0;
    },
    async submit() {
      if (!this.validate()) return;
      this.saving = true;
      try {
        const payload = {
          name: this.form.name,
          description: this.form.description,
          base_price: this.form.base_price,
          capacity: this.form.capacity,
        };
        if (this.editing) {
          await roomTypesApi.update(this.selected.id, payload);
        } else {
          await roomTypesApi.create(payload);
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
        await roomTypesApi.delete(this.selected.id);
        await this.fetch();
      } catch (err) {
        alert(err.response?.data?.error || 'Impossible de supprimer');
      }
    },
  },
};
</script>