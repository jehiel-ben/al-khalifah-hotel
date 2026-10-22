<template>
  <div class="space-y-6">
    <div class="flex flex-wrap items-center justify-between gap-4">
      <div class="flex items-center gap-2 bg-white rounded-xl px-4 py-2.5 shadow-soft w-full md:w-80">
        <i class="fa-solid fa-magnifying-glass text-dark-400"></i>
        <input
          v-model="search"
          type="text"
          placeholder="Rechercher une chambre..."
          class="bg-transparent outline-none text-sm flex-1 text-dark-700"
        />
      </div>
      <button @click="openCreate" class="btn-primary text-sm">
        <i class="fa-solid fa-plus mr-2"></i>
        Nouvelle chambre
      </button>
    </div>

    <div v-if="loading" class="flex justify-center py-20">
      <div class="animate-spin rounded-full h-12 w-12 border-4 border-primary-400 border-t-transparent"></div>
    </div>

    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <div
        v-for="room in filteredRooms"
        :key="room.id"
        class="bg-white rounded-2xl shadow-card overflow-hidden hover:shadow-luxe transition-all"
      >
        <div class="relative h-40">
          <img :src="room.image_url || 'https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=600'" :alt="room.room_number" class="w-full h-full object-cover" />
          <div class="absolute top-3 left-3 bg-white/95 backdrop-blur px-2.5 py-1 rounded-lg text-xs font-bold text-dark-700">
            N° {{ room.room_number }}
          </div>
          <div class="absolute top-3 right-3">
             <select
             :value="room.status"
             @change="changeStatus(room, $event.target.value)"
             @click.stop
             class="text-xs font-semibold rounded-lg border-2 px-2 py-1 cursor-pointer outline-none"
             :class="statusSelectClass(room.status)"
                >
             <option value="available">Disponible</option>
                <option value="occupied">Occupée</option>
             <option value="maintenance">Maintenance</option>
            </select>
            </div>
        </div>
        <div class="p-4">
          <div class="text-xs font-bold text-primary-500 uppercase mb-1">{{ room.type_name }}</div>
          <h3 class="font-bold text-dark-900 mb-2">Chambre {{ room.room_number }}</h3>
          <div class="flex flex-wrap gap-2 text-xs mb-3">
            <span class="bg-soft-200 px-2 py-1 rounded-md text-dark-600">
              <i class="fa-solid fa-layer-group text-primary-400 mr-1"></i>{{ room.floor }}
            </span>
            <span class="bg-soft-200 px-2 py-1 rounded-md text-dark-600">
              <i class="fa-solid fa-user-group text-primary-400 mr-1"></i>{{ room.capacity }}
            </span>
          </div>
          <div class="flex items-center justify-between pt-3 border-t border-soft-200">
            <span class="font-extrabold text-primary-500">{{ room.base_price }}€</span>
            <div class="flex gap-1">
              <button
                @click="openEdit(room)"
                class="w-8 h-8 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-600 flex items-center justify-center transition-colors"
              >
                <i class="fa-solid fa-pen text-xs"></i>
              </button>
              <button
                @click="openDelete(room)"
                class="w-8 h-8 rounded-lg bg-red-50 hover:bg-red-100 text-red-600 flex items-center justify-center transition-colors"
              >
                <i class="fa-solid fa-trash text-xs"></i>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div v-if="filteredRooms.length === 0" class="col-span-full py-12 text-center text-dark-400">
        <i class="fa-solid fa-bed text-3xl mb-2 block"></i>
        Aucune chambre trouvée
      </div>
    </div>

    <Modal
      v-model="modalOpen"
      :title="editing ? 'Modifier la chambre' : 'Nouvelle chambre'"
      :subtitle="editing ? 'Mettez à jour les informations' : 'Ajoutez une nouvelle chambre'"
    >
      <div class="space-y-4">
        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="text-xs font-semibold text-dark-600 uppercase mb-1 block">N° chambre *</label>
            <input v-model="form.room_number" type="text" class="input-field" placeholder="101" />
            <p v-if="errors.room_number" class="text-red-500 text-xs mt-1">{{ errors.room_number }}</p>
          </div>
          <div>
            <label class="text-xs font-semibold text-dark-600 uppercase mb-1 block">Étage</label>
            <input v-model.number="form.floor" type="number" min="0" class="input-field" placeholder="1" />
          </div>
        </div>
        <div>
          <label class="text-xs font-semibold text-dark-600 uppercase mb-1 block">Type de chambre *</label>
          <select v-model.number="form.room_type_id" class="input-field">
            <option value="">-- Choisir --</option>
            <option v-for="t in roomTypes" :key="t.id" :value="t.id">
              {{ t.name }} ({{ t.base_price }}€)
            </option>
          </select>
          <p v-if="errors.room_type_id" class="text-red-500 text-xs mt-1">{{ errors.room_type_id }}</p>
        </div>
        <div>
          <label class="text-xs font-semibold text-dark-600 uppercase mb-1 block">Statut</label>
          <select v-model="form.status" class="input-field">
            <option value="available">Disponible</option>
            <option value="occupied">Occupée</option>
            <option value="maintenance">Maintenance</option>
          </select>
        </div>
        <div>
          <label class="text-xs font-semibold text-dark-600 uppercase mb-1 block">URL image</label>
          <input v-model="form.image_url" type="text" class="input-field" placeholder="https://..." />
        </div>
        <div>
          <label class="text-xs font-semibold text-dark-600 uppercase mb-1 block">Description</label>
          <textarea v-model="form.description" rows="2" class="input-field"></textarea>
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

    <ConfirmDialog
      v-model="confirmOpen"
      title="Supprimer cette chambre ?"
      :message="`Voulez-vous vraiment supprimer la chambre ${selected?.room_number} ?`"
      @confirm="deleteItem"
    />
  </div>
</template>

<script>
import { roomsApi, roomTypesApi } from '../../services/api';
import Modal from '../../components/Modal.vue';
import ConfirmDialog from '../../components/ConfirmDialog.vue';

export default {
  name: 'StaffRooms',
  components: { Modal, ConfirmDialog },
  data() {
    return {
      loading: true,
      saving: false,
      rooms: [],
      roomTypes: [],
      search: '',
      modalOpen: false,
      confirmOpen: false,
      editing: false,
      selected: null,
      form: {
        room_number: '',
        room_type_id: '',
        floor: 1,
        status: 'available',
        image_url: '',
        description: '',
      },
      errors: {},
    };
  },
  computed: {
    filteredRooms() {
      if (!this.search) return this.rooms;
      const q = this.search.toLowerCase();
      return this.rooms.filter(
        (r) =>
          r.room_number.toLowerCase().includes(q) ||
          r.type_name.toLowerCase().includes(q)
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
        const [roomsRes, typesRes] = await Promise.all([
          roomsApi.getAll(),
          roomTypesApi.getAll(),
        ]);
        this.rooms = roomsRes.data;
        this.roomTypes = typesRes.data;
      } catch (err) {
        console.error(err);
      } finally {
        this.loading = false;
      }
    },
    openCreate() {
      this.editing = false;
      this.selected = null;
      this.form = {
        room_number: '',
        room_type_id: '',
        floor: 1,
        status: 'available',
        image_url: '',
        description: '',
      };
      this.errors = {};
      this.modalOpen = true;
    },
    openEdit(room) {
      this.editing = true;
      this.selected = room;
      this.form = {
        room_number: room.room_number,
        room_type_id: room.room_type_id,
        floor: room.floor,
        status: room.status,
        image_url: room.image_url,
        description: room.description,
      };
      this.errors = {};
      this.modalOpen = true;
    },
    openDelete(room) {
      this.selected = room;
      this.confirmOpen = true;
    },
    validate() {
      this.errors = {};
      if (!this.form.room_number?.trim()) this.errors.room_number = 'Numéro obligatoire';
      if (!this.form.room_type_id) this.errors.room_type_id = 'Type obligatoire';
      return Object.keys(this.errors).length === 0;
    },
    async submit() {
      if (!this.validate()) return;
      this.saving = true;
      try {
        if (this.editing) {
          await roomsApi.update(this.selected.id, this.form);
        } else {
          await roomsApi.create(this.form);
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
        await roomsApi.delete(this.selected.id);
        await this.fetch();
      } catch (err) {
        alert(err.response?.data?.error || 'Impossible de supprimer');
      }
    },
    statusBadge(status) {
      const map = {
        available: { class: 'badge-green', label: 'Disponible' },
        occupied: { class: 'badge-red', label: 'Occupée' },
        maintenance: { class: 'badge-gray', label: 'Maintenance' },
      };
      return map[status] || { class: 'badge-gray', label: status };
    },
  },
};
</script>