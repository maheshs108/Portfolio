/**
 * GitHub API - fetches public profile and repos (no token needed for public data).
 * Makes the portfolio dynamic and impressive.
 */

const GITHUB_USER = 'maheshs108';
const GITHUB_API = 'https://api.github.com';

export async function fetchGitHubProfile() {
  try {
    const res = await fetch(`${GITHUB_API}/users/${GITHUB_USER}`);
    if (!res.ok) throw new Error('GitHub profile fetch failed');
    const data = await res.json();
    return {
      avatarUrl: data.avatar_url,
      name: data.name,
      bio: data.bio,
      publicRepos: data.public_repos,
      followers: data.followers,
      following: data.following,
      htmlUrl: data.html_url,
      blog: data.blog,
      location: data.location,
    };
  } catch (err) {
    console.warn('GitHub profile:', err.message);
    return null;
  }
}

export async function fetchGitHubRepos(limit = 6) {
  try {
    const res = await fetch(
      `${GITHUB_API}/users/${GITHUB_USER}/repos?sort=updated&per_page=${limit}`
    );
    if (!res.ok) throw new Error('GitHub repos fetch failed');
    const data = await res.json();
    return data.map((repo) => ({
      id: repo.id,
      name: repo.name,
      description: repo.description,
      htmlUrl: repo.html_url,
      homepage: repo.homepage,
      language: repo.language,
      stargazersCount: repo.stargazers_count,
      forksCount: repo.forks_count,
    }));
  } catch (err) {
    console.warn('GitHub repos:', err.message);
    return [];
  }
}
