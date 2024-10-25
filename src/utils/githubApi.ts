export async function fetchGitHubRepos(username: string, topic: string) {
  const url = `https://api.github.com/search/repositories?q=user:${username}+topic:${topic}`;

  try {
    const response = await fetch(url, {
      headers: {
        Accept: "application/vnd.github.v3+json",
        // Uncomment the following line if you need to use a personal access token
        // 'Authorization': `token YOUR_GITHUB_PERSONAL_ACCESS_TOKEN`
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch repositories");
    }

    const data = await response.json();
    console.log(data);
    return data.items;
  } catch (error) {
    console.error("Error fetching repositories:", error);
    return [];
  }
}

export async function fetchRepoReadme(owner: string, repo: string) {
  const url = `https://api.github.com/repos/${owner}/${repo}/readme`;

  try {
    const response = await fetch(url, {
      headers: {
        Accept: "application/vnd.github.v3.raw",
        // Uncomment the following line if you need to use a personal access token
        // 'Authorization': `token YOUR_GITHUB_PERSONAL_ACCESS_TOKEN`
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch README");
    }

    const readme = await response.text();
    return readme;
  } catch (error) {
    console.error("Error fetching README:", error);
    return null;
  }
}
