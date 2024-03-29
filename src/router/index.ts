import {
  createRouter,
  createWebHistory,
  createMemoryHistory,
  createWebHashHistory,
} from 'vue-router';
import routes from './routes';
import { usePassportStore } from 'src/stores/passport-store'; // Import Passport store
import { useAssetStore } from 'src/stores/asset-store'; // Import Asset store
import { useChessboardStore } from 'src/stores/chessboard-store';

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
    const requiresAuth = to.matched.some((record) => record.meta.requiresAuth);
    const publicAltRoute = to.meta.publicAltRoute;
    const token_id = to.params.token_id as string;
    const from_token_id = from.params.token_id as string;

    if (!useChessboardStore().fen) useChessboardStore().syncGameState();
    if (!useAssetStore().collection_id)
      await useAssetStore().loadCollection('default');

    if (!token_id) {
      await useAssetStore().loadMetadata('1');
    } else if (
      token_id !== '0' &&
      token_id !== 'undefined' &&
      token_id !== from_token_id
    ) {
      await useAssetStore().loadMetadata(token_id);
    }

    //Enforce route requiresAuth, use the publicAlt if available, redirect to tokenID root if has one otherwise /
    if (requiresAuth && !passport.isAuthenticated) {
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
