import {
  createRouter,
  createWebHistory,
  createMemoryHistory,
  createWebHashHistory,
} from 'vue-router';
import routes from './routes';
import { usePassportStore } from 'src/stores/passport-store'; // Import Passport store

export default function (/* { store, ssrContext } */) {
  const createHistory = process.env.SERVER
    ? createMemoryHistory
    : process.env.VUE_ROUTER_MODE === 'history'
    ? createWebHistory
    : createWebHashHistory;

  const Router = createRouter({
    history: createHistory(process.env.VUE_ROUTER_BASE),
    routes,
    scrollBehavior: () => ({ left: 0, top: 0 }),
  });

  Router.beforeEach(async (to, from, next) => {
    const passport = usePassportStore(); // Use the Passport store
    const isAuthenticated = await passport.getUserInfo(); // Check if the user is authenticated

    if (
      to.matched.some((record) => record.meta.requiresAuth) &&
      !isAuthenticated
    ) {
      next('/'); // Redirect to login page if not authenticated
    } else {
      next(); // Proceed as normal
    }
  });

  return Router;
}
