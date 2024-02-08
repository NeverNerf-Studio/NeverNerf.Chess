import {
  createRouter,
  createWebHistory,
  createMemoryHistory,
  createWebHashHistory,
} from 'vue-router';
import routes from './routes';
import { usePassportStore } from 'src/stores/passport-store'; // Import Passport store
import { useAssetStore } from 'src/stores/asset-store'; // Import Asset store

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
    const requiresAuth = to.matched.some((record) => record.meta.requiresAuth);
    const publicAltRoute = to.meta.publicAltRoute;
    const token_id = to.params.token_id as string;
    const from_token_id = from.params.token_id as string;
    if (token_id !== from_token_id)
      await useAssetStore().loadMetadata(token_id);

    // if (process.env.DEV) {
    //   console.group('Router.beforeEach debug:');
    //   console.log('route to: ');
    //   console.log(to);
    //   console.log('route from: ');
    //   console.log(from);
    //   console.log('passport: ');
    //   console.log(passport);
    //   console.log('isAuthenticated: ' + isAuthenticated);
    //   console.log('requiresAuth: ' + requiresAuth);
    //   console.log('publicAltRoute: ' + publicAltRoute);
    //   console.log('token_id: ' + token_id);
    //   console.groupEnd();
    // }

    if (to.path == '/logout') next(`/${token_id}/asset`);

    //Enforce route requiresAuth, use the publicAlt if available, redirect to tokenID root if has one otherwise /
    if (requiresAuth && !isAuthenticated) {
      if (publicAltRoute && typeof publicAltRoute === 'string') {
        next({ name: publicAltRoute });
      } else {
        if (token_id) {
          next(`/${token_id}/asset`);
        } else {
          next('/');
        }
      }
    } else {
      next(); // Proceed as normal
    }
  });

  return Router;
}
