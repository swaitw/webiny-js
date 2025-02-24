import { createZodError, mdbid } from "@webiny/utils";

/**
 * Package deep-equal does not have types.
 */
// @ts-expect-error
import deepEqual from "deep-equal";
import { createTopic } from "@webiny/pubsub";
import WebinyError from "@webiny/error";
import { NotFoundError } from "@webiny/handler-graphql";
import {
    GetTeamParams,
    ListTeamsParams,
    PermissionsTenantLink,
    Security,
    SecurityConfig,
    Team,
    TeamInput
} from "~/types";
import NotAuthorizedError from "../NotAuthorizedError";
import {
    type ListTeamsFromPluginsParams,
    listTeamsFromProvider as baseListTeamsFromPlugins
} from "./groupsTeamsPlugins/listTeamsFromProvider";
import {
    type GetTeamFromPluginsParams,
    getTeamFromProvider as baseGetTeamFromPlugins
} from "./groupsTeamsPlugins/getTeamFromProvider";
import zod from "zod";

const createDataModelValidation = zod.object({
    name: zod.string().min(3),
    slug: zod.string().min(3),
    description: zod.string().max(500).optional().default(""),
    groups: zod.array(zod.string())
});

const updateDataModelValidation = zod.object({
    name: zod.string().min(3).optional(),
    description: zod.string().max(500).optional(),
    groups: zod.array(zod.string()).optional()
});

async function checkPermission(security: Security): Promise<void> {
    const permission = await security.getPermission("security.team");

    if (!permission) {
        throw new NotAuthorizedError();
    }
}

async function updateTenantLinks(
    security: Security,
    tenant: string,
    updatedTeam: Team
): Promise<void> {
    const links = await security.listTenantLinksByType<PermissionsTenantLink>({
        tenant,

        // With 5.37.0, these tenant links not only contain group-related permissions,
        // but teams-related too. The `type=group` hasn't been changed, just so the
        // data migrations are easier.
        type: "group"
    });

    if (!links.length) {
        return;
    }

    const relevantLinks = links.filter(link => {
        const linkTeams = link.data?.teams;
        if (Array.isArray(linkTeams) && linkTeams.length > 0) {
            return linkTeams.some(team => team.id === updatedTeam.id);
        }

        return false;
    });

    if (!relevantLinks.length) {
        return;
    }

    const teamGroups = await security.listGroups({ where: { id_in: updatedTeam.groups } });

    await security.updateTenantLinks(
        relevantLinks.map(link => {
            // We know the `link.data` is not undefined, because we filtered out all links that don't have any teams.
            const linkTeams = link.data!.teams;

            return {
                ...link,
                data: {
                    ...link.data,
                    teams: linkTeams.map(linkTeam => {
                        if (linkTeam.id !== updatedTeam.id) {
                            return linkTeam;
                        }

                        return {
                            id: updatedTeam.id,
                            groups: teamGroups.map(group => ({
                                id: group.id,
                                permissions: group.permissions
                            }))
                        };
                    })
                }
            };
        })
    );
}

export const createTeamsMethods = ({
    getTenant: initialGetTenant,
    storageOperations,
    teamsProvider
}: SecurityConfig) => {
    const getTenant = () => {
        const tenant = initialGetTenant();
        if (!tenant) {
            throw new WebinyError("Missing tenant.");
        }
        return tenant;
    };

    const listTeamsFromPlugins = (
        params: Pick<ListTeamsFromPluginsParams, "where">
    ): Promise<Team[]> => {
        return baseListTeamsFromPlugins({
            ...params,
            teamsProvider
        });
    };
    const getTeamFromPlugins = (params: Pick<GetTeamFromPluginsParams, "where">): Promise<Team> => {
        return baseGetTeamFromPlugins({
            ...params,
            teamsProvider
        });
    };

    return {
        onTeamBeforeCreate: createTopic("security.onTeamBeforeCreate"),
        onTeamAfterCreate: createTopic("security.onTeamAfterCreate"),
        onTeamBeforeBatchCreate: createTopic("security.onTeamBeforeBatchCreate"),
        onTeamAfterBatchCreate: createTopic("security.onTeamAfterBatchCreate"),
        onTeamBeforeUpdate: createTopic("security.onTeamBeforeUpdate"),
        onTeamAfterUpdate: createTopic("security.onTeamAfterUpdate"),
        onTeamBeforeDelete: createTopic("security.onTeamBeforeDelete"),
        onTeamAfterDelete: createTopic("security.onTeamAfterDelete"),

        async getTeam(this: Security, { where }: GetTeamParams): Promise<Team> {
            await checkPermission(this);

            let team: Team | null = null;
            try {
                const whereWithTenant = { ...where, tenant: where.tenant || getTenant() };
                const teamFromPlugins = await getTeamFromPlugins({ where: whereWithTenant });

                if (teamFromPlugins) {
                    team = teamFromPlugins;
                } else {
                    team = await storageOperations.getTeam({ where: whereWithTenant });
                }
            } catch (ex) {
                throw new WebinyError(
                    ex.message || "Could not get team.",
                    ex.code || "GET_TEAM_ERROR",
                    where
                );
            }
            if (!team) {
                throw new NotFoundError(`Unable to find team : ${JSON.stringify(where)}`);
            }
            return team;
        },

        async listTeams(this: Security, { where }: ListTeamsParams = {}) {
            await checkPermission(this);
            try {
                const whereWithTenant = { ...where, tenant: getTenant() };

                const teamsFromDatabase = await storageOperations.listTeams({
                    where: whereWithTenant,
                    sort: ["createdOn_ASC"]
                });

                const teamsFromPlugins = await listTeamsFromPlugins({ where: whereWithTenant });

                // We don't have to do any extra sorting because, as we can see above, `createdOn_ASC` is
                // hardcoded, and teams coming from plugins don't have `createdOn`, meaning they should
                // always be at the top of the list.
                return [...teamsFromPlugins, ...teamsFromDatabase];
            } catch (ex) {
                throw new WebinyError(
                    ex.message || "Could not list teams.",
                    ex.code || "LIST_TEAM_ERROR"
                );
            }
        },

        async createTeam(this: Security, input: TeamInput): Promise<Team> {
            await checkPermission(this);

            const identity = this.getIdentity();
            const currentTenant = getTenant();

            const validation = createDataModelValidation.safeParse({
                ...input,
                tenant: currentTenant
            });
            if (!validation.success) {
                throw createZodError(validation.error);
            }

            const existing = await storageOperations.getTeam({
                where: {
                    tenant: currentTenant,
                    slug: input.slug
                }
            });

            if (existing) {
                throw new WebinyError(
                    `Team with slug "${input.slug}" already exists.`,
                    "TEAM_EXISTS"
                );
            }

            const team: Team = {
                id: mdbid(),
                tenant: currentTenant,
                ...validation.data,
                system: input.system === true,
                webinyVersion: process.env.WEBINY_VERSION as string,
                createdOn: new Date().toISOString(),
                createdBy: identity
                    ? {
                          id: identity.id,
                          displayName: identity.displayName,
                          type: identity.type
                      }
                    : null
            };

            try {
                await this.onTeamBeforeCreate.publish({ team });
                const result = await storageOperations.createTeam({ team });
                await this.onTeamAfterCreate.publish({ team: result });

                return result;
            } catch (ex) {
                throw new WebinyError(
                    ex.message || "Could not create team.",
                    ex.code || "CREATE_TEAM_ERROR",
                    {
                        team
                    }
                );
            }
        },

        async updateTeam(this: Security, id: string, input: Record<string, any>): Promise<Team> {
            await checkPermission(this);

            const validation = updateDataModelValidation.safeParse(input);
            if (!validation.success) {
                throw createZodError(validation.error);
            }

            const original = await this.getTeam({
                where: { tenant: getTenant(), id }
            });

            if (!original) {
                throw new NotFoundError(`Team "${id}" was not found!`);
            }

            // We can't proceed with the update if one of the following is true:
            // 1. The group is system group.
            // 2. The group is created via a plugin.
            if (original.system) {
                throw new WebinyError(`Cannot update system teams.`, "CANNOT_UPDATE_SYSTEM_TEAMS");
            }

            if (original.plugin) {
                throw new WebinyError(
                    `Cannot update teams created via plugins.`,
                    "CANNOT_UPDATE_PLUGIN_TEAMS"
                );
            }

            const team: Team = {
                ...original
            };
            for (const key in validation.data) {
                // @ts-expect-error
                const value = validation.data[key];
                if (value === undefined) {
                    continue;
                }
                // @ts-expect-error
                team[key] = value;
            }

            const groupsChanged = !deepEqual(team.groups, original.groups);

            try {
                await this.onTeamBeforeUpdate.publish({ original, team });
                const result = await storageOperations.updateTeam({ original, team });
                if (groupsChanged) {
                    await updateTenantLinks(this, getTenant(), result);
                }
                await this.onTeamAfterUpdate.publish({ original, team: result });

                return result;
            } catch (ex) {
                throw new WebinyError(
                    ex.message || "Could not update team.",
                    ex.code || "UPDATE_TEAM_ERROR",
                    {
                        team
                    }
                );
            }
        },

        async deleteTeam(this: Security, id: string): Promise<void> {
            await checkPermission(this);

            const team = await this.getTeam({ where: { tenant: getTenant(), id } });
            if (!team) {
                throw new NotFoundError(`Team "${id}" was not found!`);
            }

            // We can't proceed with the deletion if one of the following is true:
            // 1. The group is system group.
            // 2. The group is created via a plugin.
            // 3. The group is being used by one or more tenant links.
            // 4. The group is being used by one or more teams.
            if (team.system) {
                throw new WebinyError(`Cannot delete system teams.`, "CANNOT_DELETE_SYSTEM_TEAMS");
            }

            if (team.plugin) {
                throw new WebinyError(
                    `Cannot delete teams created via plugins.`,
                    "CANNOT_DELETE_PLUGIN_TEAMS"
                );
            }

            const usagesInTenantLinks = await storageOperations
                .listTenantLinksByType({
                    tenant: getTenant(),
                    type: "group"
                })
                .then(links =>
                    links.filter(link => {
                        const linkTeams = link.data?.teams;
                        if (Array.isArray(linkTeams) && linkTeams.length > 0) {
                            return linkTeams.some(linkTeam => linkTeam.id === id);
                        }
                        return false;
                    })
                );

            if (usagesInTenantLinks.length > 0) {
                let foundUsages = "(found 1 usage)";
                if (usagesInTenantLinks.length > 1) {
                    foundUsages = `(found ${usagesInTenantLinks.length} usages)`;
                }

                throw new WebinyError(
                    `Cannot delete "${team.name}" team because it is currently being used in tenant links ${foundUsages}.`,
                    "CANNOT_DELETE_TEAM_USED_IN_TENANT_LINKS",
                    { tenantLinksCount: usagesInTenantLinks.length }
                );
            }

            try {
                await this.onTeamBeforeDelete.publish({ team });
                await storageOperations.deleteTeam({ team });
                await this.onTeamAfterDelete.publish({ team });
            } catch (ex) {
                throw new WebinyError(
                    ex.message || "Could not delete team.",
                    ex.code || "DELETE_TEAM_ERROR",
                    {
                        team
                    }
                );
            }
        }
    };
};
