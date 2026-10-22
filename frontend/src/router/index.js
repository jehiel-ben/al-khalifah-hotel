import { createRouter, createWebHistory } from 'vue-router';

// Layout client
import Home from '../views/client/Home.vue';
import RoomList from '../views/client/RoomList.vue';
import Booking from '../views/client/Booking.vue';
import Payment from '../views/client/Payment.vue';
import Confirmation from '../views/client/Confirmation.vue';
import Invoice from '../views/client/Invoice.vue';
import MyReservations from '../views/client/MyReservations.vue';

// Layout staff
import StaffLayout from '../views/staff/StaffLayout.vue';
import StaffDashboard from '../views/staff/Dashboard.vue';
import NotFound from '../views/client/NotFound.vue';
import ServicesPage from '../views/client/Services.vue';
import ContactPage from '../views/client/Contact.vue';

const routes = [
  // ==================== CLIENT ====================
  { path: '/', name: 'home', component: Home, meta: { layout: 'client', title: 'Accueil' } },
  { path: '/rooms', name: 'rooms', component: RoomList, meta: { layout: 'client', title: 'Nos Chambres' } },
  { path: '/booking/:roomId', name: 'booking', component: Booking, meta: { layout: 'client', title: 'Réservation' } },
  { path: '/payment/:reservationId', name: 'payment', component: Payment, meta: { layout: 'client', title: 'Paiement' } },
  { path: '/confirmation/:reservationId', name: 'confirmation', component: Confirmation, meta: { layout: 'client', title: 'Confirmation' } },
  { path: '/invoice/:reservationId', name: 'invoice', component: Invoice, meta: { layout: 'client', title: 'Facture' } },
  { path: '/my-reservations', name: 'my-reservations', component: MyReservations, meta: { layout: 'client', title: 'Mes réservations' } },

  // ==================== STAFF ====================
  {
    path: '/staff',
    component: StaffLayout,
    children: [
      {
        path: '',
        name: 'staff-dashboard',
        component: StaffDashboard,
        meta: { title: 'Dashboard', subtitle: 'Vue d\'ensemble de l\'activité' },
      },
      // Routes à venir (placeholders dans les prochaines étapes)
      {
        path: 'reservations',
        name: 'staff-reservations',
        component: () => import('../views/staff/Reservations.vue'),
        meta: { title: 'Réservations', subtitle: 'Gestion des réservations' },
      },
      {
        path: 'payments',
        name: 'staff-payments',
        component: () => import('../views/staff/Payments.vue'),
        meta: { title: 'Paiements', subtitle: 'Suivi des paiements' },
      },
      {
        path: 'rooms',
        name: 'staff-rooms',
        component: () => import('../views/staff/Rooms.vue'),
        meta: { title: 'Chambres', subtitle: 'Gestion des chambres' },
      },
      {
        path: 'room-types',
        name: 'staff-room-types',
        component: () => import('../views/staff/RoomTypes.vue'),
        meta: { title: 'Types de chambres', subtitle: 'Catégories d\'hébergement' },
      },
      {
  path: '/services',
  name: 'services',
  component: ServicesPage,
  meta: { layout: 'client', title: 'Services' },
},
{
  path: '/contact',
  name: 'contact',
  component: ContactPage,
  meta: { layout: 'client', title: 'Contact' },
},

        // ==================== 404 ====================
      {
        path: '/:pathMatch(.*)*',
        name: 'not-found',
        component: NotFound,
        meta: { layout: 'client', title: 'Page introuvable' },
      },
    ],
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior() {
    return { top: 0 };
  },
});

router.afterEach((to) => {
  document.title = to.meta.title
    ? `🏨 ${to.meta.title} — Al Khalifah Hotel`
    : '🏨 Al Khalifah Hotel';
});

export default router;