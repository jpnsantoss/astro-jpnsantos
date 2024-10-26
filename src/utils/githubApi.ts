interface ProjectDetails {
  title?: string;
  description?: string;
  thumbnail?: string;
  tools?: string[];
}

interface Project {
  id: number;
  name: string;
  description: string;
  html_url: string;
  homepage: string;
  project_details?: ProjectDetails;
}

const GITHUB_TOKEN = import.meta.env.GITHUB_TOKEN;

async function fetchGitHubRepos(username: string): Promise<Project[]> {
  const searchUrlFull = `https://api.github.com/search/repositories?q=user:${username}+topic:portfolio-full`;
  const searchUrlPartial = `https://api.github.com/search/repositories?q=user:${username}+topic:portfolio`;

  try {
    // Fetch repositories with the topic "portfolio-full"
    const responseFull = await fetch(searchUrlFull, {
      headers: {
        Accept: "application/vnd.github.v3+json",
        Authorization: `token ${GITHUB_TOKEN}`,
      },
    });

    if (!responseFull.ok) {
      throw new Error(
        `Failed to fetch repositories: ${responseFull.statusText}`
      );
    }

    const dataFull = await responseFull.json();
    const repositoriesFull: Project[] = dataFull.items;

    // Fetch repositories with the topic "portfolio"
    const responsePartial = await fetch(searchUrlPartial, {
      headers: {
        Accept: "application/vnd.github.v3+json",
        Authorization: `token ${GITHUB_TOKEN}`,
      },
    });

    if (!responsePartial.ok) {
      throw new Error(
        `Failed to fetch repositories: ${responsePartial.statusText}`
      );
    }

    const dataPartial = await responsePartial.json();
    const repositoriesPartial: Project[] = dataPartial.items;

    // Combine both sets of repositories, ensuring no duplicates
    const repositories: Project[] = [
      ...repositoriesFull,
      ...repositoriesPartial.filter(
        (repo) =>
          !repositoriesFull.some((fullRepo: Project) => fullRepo.id === repo.id)
      ),
    ];

    // Fetch README for each repository with the topic "portfolio-full"
    for (const repo of repositoriesFull) {
      try {
        const readme = await fetchRepoReadme(username, repo.name);
        if (readme) {
          repo.project_details = extractMetadataFromReadme(readme);
        }
      } catch (error) {
        console.error(`Error fetching README for ${repo.name}:`, error);
      }
    }

    return repositories.map((repo: Project) => ({
      id: repo.id,
      name: repo.name,
      description: repo.description,
      html_url: repo.html_url,
      homepage: repo.homepage,
      project_details: repo.project_details,
    }));
  } catch (error) {
    console.error("Error fetching repositories:", error);
    return [];
  }
}

async function fetchRepoReadme(
  owner: string,
  repo: string
): Promise<string | null> {
  const url = `https://api.github.com/repos/${owner}/${repo}/readme`;

  try {
    const response = await fetch(url, {
      headers: {
        Accept: "application/vnd.github.v3.raw",
        Authorization: `token ${GITHUB_TOKEN}`,
      },
    });

    if (!response.ok) {
      if (response.status === 404) {
        // README not found
        return null;
      }
      throw new Error(`Failed to fetch README: ${response.statusText}`);
    }

    return await response.text();
  } catch (error) {
    console.error(`Error fetching README for ${owner}/${repo}:`, error);
    return null;
  }
}

function extractMetadataFromReadme(readme: string | null): ProjectDetails {
  if (!readme) return {};

  const metadataMatch = readme.match(/<!-- portfolio-metadata([\s\S]*?)-->/);
  if (!metadataMatch) return {};

  try {
    const metadata = JSON.parse(metadataMatch[1].trim());
    return {
      title: metadata.title,
      description: metadata.description,
      thumbnail: metadata.thumbnail,
      tools: metadata.tools,
    };
  } catch (error) {
    console.error("Error parsing metadata:", error);
    return {};
  }
}

export { extractMetadataFromReadme, fetchGitHubRepos, fetchRepoReadme };
