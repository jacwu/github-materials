import axios from 'axios';

/**
 * GitHub API client configuration
 */
interface GitHubClientConfig {
    token: string;
    orgName: string;
    baseUrl?: string;
}

/**
 * Result of GitHub API operations
 */
interface GitHubApiResult {
    success: boolean;
    username: string;
    status?: string;
    role?: string;
    error?: string;
}

/**
 * Add a user to the GitHub organization
 * @param config - GitHub client configuration
 * @param username - GitHub username to add
 * @param role - Role for the user (default: member)
 * @returns Promise with the result of the operation
 */
async function addUserToOrganization(
    config: GitHubClientConfig,
    username: string,
    role: 'admin' | 'member' = 'member'
): Promise<GitHubApiResult> {
    try {
        const baseUrl = config.baseUrl || 'https://api.github.com';
        const url = `${baseUrl}/orgs/${config.orgName}/memberships/${username}`;
        
        const response = await axios.put(
            url, 
            { role },
            {
                headers: {
                    'Authorization': `token ${config.token}`,
                    'Accept': 'application/vnd.github.v3+json',
                },
            }
        );
        
        return {
            success: true,
            username,
            status: response.data.state,
            role: response.data.role
        };
    } catch (error) {
        console.error(`Failed to add user ${username}:`, error.response?.data || error.message);
        return {
            success: false,
            username,
            error: error.response?.data?.message || error.message
        };
    }
}

/**
 * Add a user to a team in the organization
 * @param config - GitHub client configuration
 * @param username - GitHub username to add
 * @param teamSlug - Team slug or name
 * @param role - Role for the user in the team (default: member)
 * @returns Promise with the result of the operation
 */
async function addUserToTeam(
    config: GitHubClientConfig,
    username: string,
    teamSlug: string,
    role: 'maintainer' | 'member' = 'member'
): Promise<GitHubApiResult> {
    try {
        const baseUrl = config.baseUrl || 'https://api.github.com';
        const url = `${baseUrl}/orgs/${config.orgName}/teams/${teamSlug}/memberships/${username}`;
        
        const response = await axios.put(
            url,
            { role },
            {
                headers: {
                    'Authorization': `token ${config.token}`,
                    'Accept': 'application/vnd.github.v3+json',
                },
            }
        );
        
        return {
            success: true,
            username,
            status: response.data.state,
            role: response.data.role
        };
    } catch (error) {
        console.error(`Failed to add user ${username} to team ${teamSlug}:`, error.response?.data || error.message);
        return {
            success: false,
            username,
            error: error.response?.data?.message || error.message
        };
    }
}

/**
 * Add multiple users to organization and specific team
 */
async function addUsersToOrganizationAndTeam() {
    // Replace with your actual GitHub token, organization name, and team slug
    const config: GitHubClientConfig = {
        token: process.env.GITHUB_TOKEN || 'your-github-token',
        orgName: process.env.GITHUB_ORG || 'your-organization-name',
        baseUrl: 'https://api.github.com'
    };
    
    const teamSlug = process.env.GITHUB_TEAM || 'your-team-slug';
    
    // Sample usernames to add
    const sampleUsers = [
        'user1',
        'user2',
        'user3',
        'user4',
        'user5',
        'user6',
        'user7',
        'user8',
        'user9',
        'user10'
    ];
    
    console.log(`Adding ${sampleUsers.length} users to organization: ${config.orgName} and team: ${teamSlug}`);
    
    // Process each user sequentially to avoid rate limits
    for (const username of sampleUsers) {
        console.log(`Processing user: ${username}...`);
        
        // First add the user to the organization
        const orgResult = await addUserToOrganization(config, username);
        
        if (orgResult.success) {
            console.log(`✅ Added ${username} to organization as ${orgResult.role}`);
            
            // Then add the user to the team
            const teamResult = await addUserToTeam(config, username, teamSlug);
            
            if (teamResult.success) {
                console.log(`✅ Added ${username} to team ${teamSlug} as ${teamResult.role}`);
            } else {
                console.log(`❌ Failed to add ${username} to team: ${teamResult.error}`);
            }
        } else {
            console.log(`❌ Failed to add ${username} to organization: ${orgResult.error}`);
        }
        
        // Add a small delay to prevent hitting rate limits
        await new Promise(resolve => setTimeout(resolve, 1000));
    }
    
    console.log('Finished adding users to the organization and team');
}

// Run the main function
if (require.main === module) {
    addUsersToOrganizationAndTeam().catch(error => {
        console.error('Error in main process:', error);
        process.exit(1);
    });
}
