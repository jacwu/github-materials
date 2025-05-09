import { Octokit } from '@octokit/rest';

export class GitHubOrgManager {
    private octokit: Octokit;

    constructor(authToken: string) {
        this.octokit = new Octokit({
            auth: authToken
        });
    }

    /**
     * Create a new organization
     * @param orgName Organization name
     * @param adminEmail Admin email
     * @param billingEmail Billing email
     * @returns Created organization information
     */
    async createOrganization(orgName: string, adminEmail: string, billingEmail: string) {
        try {
            const response = await this.octokit.request('POST /admin/organizations', {
                login: orgName,
                admin_email: adminEmail,
                billing_email: billingEmail
            });
            return response.data;
        } catch (error) {
            throw new Error(`Failed to create organization: ${error.message}`);
        }
    }

    /**
     * Create a team in the specified organization
     * @param orgName Organization name
     * @param teamName Team name
     * @param description Team description
     * @param privacy Team visibility (secret or closed)
     * @returns Created team information
     */
    async createTeam(orgName: string, teamName: string, description: string, privacy: 'secret' | 'closed' = 'secret') {
        try {
            const response = await this.octokit.teams.create({
                org: orgName,
                name: teamName,
                description: description,
                privacy: privacy,
                permission: 'pull' // Default permission
            });
            return response.data;
        } catch (error) {
            throw new Error(`Failed to create team: ${error.message}`);
        }
    }

    /**
     * Add a member to the team
     * @param orgName Organization name
     * @param teamSlug Team slug
     * @param username GitHub username of the user to be added
     * @param role Member role (member or maintainer)
     * @returns Operation result
     */
    async addTeamMember(orgName: string, teamSlug: string, username: string, role: 'member' | 'maintainer' = 'member') {
        try {
            const response = await this.octokit.teams.addOrUpdateMembershipForUserInOrg({
                org: orgName,
                team_slug: teamSlug,
                username: username,
                role: role
            });
            return response.data;
        } catch (error) {
            throw new Error(`Failed to add team member: ${error.message}`);
        }
    }

    /**
     * Get the list of team members
     * @param orgName Organization name
     * @param teamSlug Team slug
     * @returns List of team members
     */
    async listTeamMembers(orgName: string, teamSlug: string) {
        try {
            const response = await this.octokit.teams.listMembersInOrg({
                org: orgName,
                team_slug: teamSlug
            });
            return response.data;
        } catch (error) {
            throw new Error(`Failed to list team members: ${error.message}`);
        }
    }
}