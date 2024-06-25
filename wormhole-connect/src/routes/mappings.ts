import { Route } from 'config/types';

// SDKv2
import { routes } from '@wormhole-foundation/sdk';
import { SDKv2Route } from './sdkv2/route';

// Legacy routes
import { RouteAbstract } from './abstracts/routeAbstract';
import { ETHBridge } from './porticoBridge/ethBridge';
import { wstETHBridge } from './porticoBridge/wstETHBridge';
import { NttManual, NttRelay } from './ntt';

import config from 'config';

export function getRoute(route: Route): RouteAbstract {
  switch (route) {
    // Migrated routes:
    case Route.Bridge:
      return new SDKv2Route(
        config.network,
        routes.TokenBridgeRoute,
        Route.Bridge,
      );
    case Route.Relay:
      return new SDKv2Route(
        config.network,
        routes.AutomaticTokenBridgeRoute,
        Route.Bridge,
      );

    // Legacy routes:
    case Route.ETHBridge:
      return new ETHBridge();
    case Route.wstETHBridge:
      return new wstETHBridge();
    case Route.NttManual:
      return new NttManual();
    case Route.NttRelay:
      return new NttRelay();
    // TODO SDKV2
    default:
      return new SDKv2Route(
        config.network,
        routes.TokenBridgeRoute,
        Route.Bridge,
      );
  }
}
