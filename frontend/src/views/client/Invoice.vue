<template>
  <div class="bg-soft-100 min-h-screen py-10">
    <div class="max-w-4xl mx-auto px-4">
      <!-- Loading -->
      <div v-if="loading" class="flex justify-center py-20">
        <div class="animate-spin rounded-full h-14 w-14 border-4 border-primary-400 border-t-transparent"></div>
      </div>

      <!-- Erreur -->
      <div v-else-if="error" class="text-center py-20">
        <i class="fa-solid fa-triangle-exclamation text-5xl text-red-500 mb-4"></i>
        <p class="text-dark-600">{{ error }}</p>
      </div>

      <div v-else>
        <!-- Boutons d'action (cachés à l'impression) -->
        <div class="flex flex-wrap items-center justify-between gap-3 mb-6 no-print">
          <router-link :to="`/confirmation/${reservation.id}`" class="text-dark-500 hover:text-primary-500 text-sm transition-colors">
            <i class="fa-solid fa-arrow-left mr-2"></i>
            Retour à la confirmation
          </router-link>
          <div class="flex gap-2">
            <button @click="print" class="btn-outline text-sm !px-4 !py-2">
              <i class="fa-solid fa-print mr-2"></i>
              Imprimer
            </button>
            <button @click="download" class="btn-primary text-sm !px-4 !py-2">
              <i class="fa-solid fa-download mr-2"></i>
              Télécharger PDF
            </button>
          </div>
        </div>

        <!-- FACTURE (imprimable) -->
        <div id="invoice" class="bg-white rounded-2xl shadow-luxe overflow-hidden">
          <!-- Header facture -->
          <div class="bg-dark-900 text-white p-8 md:p-10">
            <div class="flex items-start justify-between flex-wrap gap-4">
              <div>
                <div class="flex items-center gap-3 mb-2">
                  <div class="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center">
                    <i class="fa-solid fa-hotel text-white text-xl"></i>
                  </div>
                  <div>
                    <div class="font-bold text-xl">Al Khalifah Hôtel</div>
                    <div class="text-xs text-primary-400 tracking-widest">LUXURY & HOSPITALITY</div>
                  </div>
                </div>
                <div class="text-white/60 text-xs mt-3 leading-relaxed">
                  Q. Kigobe,Avenue de l'Indépendance, BP 45<br>
                  Burundi, Bujumbura-Mairie<br>
                  +257 65 19 60 31
                </div>
              </div>
              <div class="text-right">
                <div class="text-primary-400 text-xs font-bold uppercase tracking-widest mb-1">Facture</div>
                <div class="text-3xl font-extrabold mb-1">
                  #{{ invoiceNumber }}
                </div>
                <div class="text-white/60 text-xs">
                  Émise le {{ formatDate(new Date(), true) }}
                </div>
              </div>
            </div>
          </div>

          <!-- Infos client + réservation -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6 p-8 md:p-10 border-b border-soft-200">
            <div>
              <div class="text-xs font-bold text-primary-500 uppercase tracking-widest mb-3">
                Facturé à
              </div>
              <div class="font-bold text-dark-900 text-lg mb-1">{{ reservation.customer_name }}</div>
              <div class="text-dark-500 text-sm">{{ reservation.customer_email }}</div>
              <div class="text-dark-500 text-sm">{{ reservation.customer_phone }}</div>
            </div>
            <div>
              <div class="text-xs font-bold text-primary-500 uppercase tracking-widest mb-3">
                Détails du séjour
              </div>
              <div class="text-sm space-y-1">
                <div class="flex justify-between">
                  <span class="text-dark-500">Référence</span>
                  <span class="font-semibold text-dark-800">{{ reservation.reference }}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-dark-500">Arrivée</span>
                  <span class="font-semibold text-dark-800">{{ formatDate(reservation.check_in) }}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-dark-500">Départ</span>
                  <span class="font-semibold text-dark-800">{{ formatDate(reservation.check_out) }}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-dark-500">Voyageurs</span>
                  <span class="font-semibold text-dark-800">{{ reservation.guests }}</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Tableau des lignes -->
          <div class="p-8 md:p-10">
            <div class="overflow-x-auto">
              <table class="w-full text-sm">
                <thead>
                  <tr class="border-b-2 border-dark-900">
                    <th class="text-left py-3 font-bold text-dark-900 uppercase text-xs tracking-wider">Description</th>
                    <th class="text-center py-3 font-bold text-dark-900 uppercase text-xs tracking-wider">Qté</th>
                    <th class="text-right py-3 font-bold text-dark-900 uppercase text-xs tracking-wider">Prix unitaire</th>
                    <th class="text-right py-3 font-bold text-dark-900 uppercase text-xs tracking-wider">Total</th>
                  </tr>
                </thead>
                <tbody>
                  <!-- Chambre -->
                  <tr class="border-b border-soft-200">
                    <td class="py-4">
                      <div class="font-semibold text-dark-900">
                        Chambre {{ reservation.room_number }} — {{ reservation.type_name }}
                      </div>
                      <div class="text-dark-400 text-xs">
                        Du {{ formatDate(reservation.check_in) }} au {{ formatDate(reservation.check_out) }}
                      </div>
                    </td>
                    <td class="text-center py-4 text-dark-600">{{ nights }} nuit(s)</td>
                    <td class="text-right py-4 text-dark-600">
                      {{ (reservation.total_amount - servicesTotal) / nights }}€
                    </td>
                    <td class="text-right py-4 font-semibold text-dark-900">
                      {{ roomTotal }}€
                    </td>
                  </tr>

                  <!-- Services -->
                  <tr
                    v-for="s in reservation.services"
                    :key="s.id"
                    class="border-b border-soft-200"
                  >
                    <td class="py-4">
                      <div class="font-semibold text-dark-900">
                        <i :class="s.icon" class="text-primary-400 mr-2"></i>
                        {{ s.service_name }}
                      </div>
                    </td>
                    <td class="text-center py-4 text-dark-600">{{ s.quantity }}</td>
                    <td class="text-right py-4 text-dark-600">{{ s.unit_price }}€</td>
                    <td class="text-right py-4 font-semibold text-dark-900">
                      {{ s.unit_price * s.quantity }}€
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <!-- Totaux -->
            <div class="flex justify-end mt-8">
              <div class="w-full md:w-80 space-y-3">
                <div class="flex justify-between text-sm">
                  <span class="text-dark-500">Sous-total chambre</span>
                  <span class="font-semibold text-dark-800">{{ roomTotal }}€</span>
                </div>
                <div v-if="servicesTotal > 0" class="flex justify-between text-sm">
                  <span class="text-dark-500">Sous-total services</span>
                  <span class="font-semibold text-dark-800">{{ servicesTotal }}€</span>
                </div>
                <div class="flex justify-between text-sm">
                  <span class="text-dark-500">Taxes (incluses)</span>
                  <span class="font-semibold text-dark-800">0€</span>
                </div>
                <div class="border-t-2 border-dark-900 pt-3 flex justify-between items-center">
                  <span class="font-bold text-dark-900 text-lg">TOTAL</span>
                  <span class="font-extrabold text-primary-500 text-2xl">
                    {{ reservation.total_amount }}€
                  </span>
                </div>
              </div>
            </div>

            <!-- Statut paiement -->
            <div v-if="reservation.payment" class="mt-8 bg-green-50 border border-green-200 rounded-xl p-5 flex items-start gap-3">
              <i class="fa-solid fa-circle-check text-green-600 text-xl mt-0.5"></i>
              <div class="flex-1">
                <div class="font-bold text-green-800 mb-1">Paiement confirmé</div>
                <div class="text-green-700 text-sm">
                  Méthode : <strong class="capitalize">{{ methodLabel }}</strong> —
                  Réf. paiement : <strong>{{ reservation.payment.reference }}</strong>
                </div>
                <div class="text-green-600 text-xs mt-1">
                  Payé le {{ formatDate(reservation.payment.paid_at, true) }}
                </div>
              </div>
            </div>

            <!-- Signature / remerciements -->
            <div class="mt-10 pt-8 border-t border-soft-200 text-center">
              <p class="text-dark-500 text-sm">
                Merci de votre confiance. Nous avons hâte de vous accueillir au <strong>Al Khalifah Hotel</strong> !
              </p>
              <p class="text-dark-400 text-xs mt-2">
                Pour toute question, contactez-nous à contact@alkhalifah.com
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { reservationsApi } from '../../services/api';

export default {
  name: 'Invoice',
  data() {
    return {
      loading: true,
      error: null,
      reservation: {},
    };
  },
  computed: {
    nights() {
      if (!this.reservation.check_in || !this.reservation.check_out) return 0;
      const d1 = new Date(this.reservation.check_in);
      const d2 = new Date(this.reservation.check_out);
      return Math.max(1, Math.round((d2 - d1) / (1000 * 60 * 60 * 24)));
    },
    servicesTotal() {
      if (!this.reservation.services) return 0;
      return this.reservation.services.reduce(
        (sum, s) => sum + s.unit_price * s.quantity,
        0
      );
    },
    roomTotal() {
      return (this.reservation.total_amount || 0) - this.servicesTotal;
    },
    invoiceNumber() {
      return this.reservation.reference
        ? this.reservation.reference.replace('RES-', 'INV-')
        : 'INV-XXXX';
    },
    methodLabel() {
      const m = this.reservation.payment?.method;
      const map = { card: 'Carte bancaire', cash: 'Espèces', transfer: 'Virement' };
      return map[m] || m || '';
    },
  },
  async mounted() {
    const id = this.$route.params.reservationId;
    try {
      const res = await reservationsApi.getById(id);
      this.reservation = res.data;
    } catch (err) {
      this.error = 'Impossible de charger la facture.';
      console.error(err);
    } finally {
      this.loading = false;
    }
  },
  methods: {
    formatDate(dateStr, withTime = false) {
      if (!dateStr) return '';
      const d = new Date(dateStr);
      const opts = { day: '2-digit', month: 'long', year: 'numeric' };
      if (withTime) {
        opts.hour = '2-digit';
        opts.minute = '2-digit';
      }
      return d.toLocaleDateString('fr-FR', opts);
    },
    print() {
      window.print();
    },
    download() {
      // Ouvre la boîte de dialogue d'impression avec option "Enregistrer en PDF"
      alert('💡 Astuce : dans la fenêtre d\'impression, choisissez "Enregistrer au format PDF" comme destination.');
      setTimeout(() => window.print(), 100);
    },
  },
};
</script>

<style>
/* Styles pour l'impression */
@media print {
  .no-print {
    display: none !important;
  }
  body {
    background: white !important;
  }
  #invoice {
    box-shadow: none !important;
    border-radius: 0 !important;
  }
  .bg-dark-900 {
    background: #1A1A1A !important;
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }
}
</style>