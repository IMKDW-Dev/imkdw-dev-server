import { GithubOAuthToken } from '../../../../@types/auth/oauth/github.type';
import { GithubUserInfo } from '../../../../@types/auth/oauth/google.type';

// eslint-disable-next-line import/prefer-default-export
export const createGithubOAuthToken = (): GithubOAuthToken => {
  return {
    access_token: '',
    token_type: '',
    scope: '',
  };
};

export const createGithubUserInfo = (email: string): GithubUserInfo => {
  return {
    login: 'string',
    id: 1,
    node_id: 'string',
    avatar_url: 'string',
    gravatar_id: 'string',
    url: 'string',
    html_url: 'string',
    followers_url: 'string',
    following_url: 'string',
    gists_url: 'string',
    starred_url: 'string',
    subscriptions_url: 'string',
    organizations_url: 'string',
    repos_url: 'string',
    events_url: 'string',
    received_events_url: 'string',
    type: 'string',
    site_admin: false,
    name: 'string',
    company: 'string',
    blog: 'string',
    location: 'string',
    email,
    hireable: null,
    bio: 'string',
    twitter_username: null,
    public_repos: 1,
    public_gists: 1,
    followers: 1,
    following: 1,
    created_at: 'string',
    updated_at: 'string',
    private_gists: 1,
    total_private_repos: 1,
    owned_private_repos: 1,
    disk_usage: 1,
    collaborators: 1,
    two_factor_authentication: true,
    plan: {
      name: 'string',
      space: 1,
      collaborators: 1,
      private_repos: 1,
    },
  };
};
