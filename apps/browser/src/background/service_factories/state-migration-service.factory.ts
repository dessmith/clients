import { StateFactory } from "@bitwarden/common/factories/stateFactory";
import { GlobalState } from "@bitwarden/common/models/domain/globalState";
import { StateMigrationService } from "@bitwarden/common/services/stateMigration.service";

import { Account } from "../../models/account";

import { CachedServices, factory, FactoryOptions } from "./factory-options";
import {
  diskStorageServiceFactory,
  DiskStorageServiceInitOptions,
  secureStorageServiceFactory,
  SecureStorageServiceInitOptions,
} from "./storage-service.factory";

type StateMigrationServiceFactoryOptions = FactoryOptions & {
  stateMigrationServiceOptions: {
    stateFactory: StateFactory<GlobalState, Account>;
  };
};

export type StateMigrationServiceInitOptions = StateMigrationServiceFactoryOptions &
  DiskStorageServiceInitOptions &
  SecureStorageServiceInitOptions;

export function stateMigrationServiceFactory(
  cache: { stateMigrationService?: StateMigrationService } & CachedServices,
  opts: StateMigrationServiceInitOptions
): StateMigrationService {
  return factory(
    cache,
    "stateMigrationService",
    opts,
    () =>
      new StateMigrationService(
        diskStorageServiceFactory(cache, opts),
        secureStorageServiceFactory(cache, opts),
        opts.stateMigrationServiceOptions.stateFactory
      )
  );
}
