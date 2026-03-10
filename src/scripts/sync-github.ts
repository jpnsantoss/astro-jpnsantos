import { createClient } from "@sanity/client";
import "dotenv/config";

// 1. Initialize the Sanity Client
const sanity = createClient({
  projectId: "dbowprqv", // Your project ID
  dataset: "production",
  useCdn: false,
  apiVersion: "2024-03-10",
  token: process.env.SANITY_API_TOKEN,
});

const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const USERNAME = "jpnsantoss"; // Your GitHub username

const getHeaders = (isRaw = false) => ({
  Accept: isRaw ? "application/vnd.github.v3.raw" : "application/vnd.github.v3+json",
  "User-Agent": "Astro-Portfolio-Sync",
  ...(GITHUB_TOKEN ? { Authorization: `Bearer ${GITHUB_TOKEN}` } : {}),
});

// Helper: Fetch README
async function fetchRepoReadme(owner: string, repo: string): Promise<string | null> {
  try {
    const res = await fetch(`https://api.github.com/repos/${owner}/${repo}/readme`, { headers: getHeaders(true) });
    if (!res.ok) return null;
    return await res.text();
  } catch {
    return null;
  }
}

function extractMetadata(readme: string | null) {
  if (!readme) return {};
  
  const regex = new RegExp('');
  const match = readme.match(regex);
  
  if (!match) return {};
  try {
    return JSON.parse(match[1].trim());
  } catch {
    return {};
  }
}

async function syncProjects() {
  console.log(`Fetching repositories for ${USERNAME}...`);
  
  try {
    // 1. Fetch ALL repos for the user directly (More reliable than the search API)
    const reposRes = await fetch(`https://api.github.com/users/${USERNAME}/repos?per_page=100&sort=updated`, { headers: getHeaders() });
    if (!reposRes.ok) throw new Error(`GitHub API Error: ${reposRes.statusText}`);
    
    const allRepos = await reposRes.json();
    
    // Filter repos that have 'portfolio' or 'portfolio-full' as a topic
    const portfolioRepos = allRepos.filter((repo: any) => 
      repo.topics?.includes('portfolio') || repo.topics?.includes('portfolio-full')
    );

    console.log(`Found ${portfolioRepos.length} portfolio projects on GitHub.`);

    // 2. Query Sanity for existing GitHub URLs to prevent duplicates
    const existingUrls: string[] = await sanity.fetch(`*[_type == "project"].githubUrl`);

    for (const repo of portfolioRepos) {
      // If the URL already exists in Sanity (published or draft), skip it!
      if (existingUrls.includes(repo.html_url)) {
         console.log(`⏭️  Skipping (already exists in Sanity): ${repo.name}`);
         continue;
      }

      console.log(`📥 Processing: ${repo.name}...`);
      
      // Fetch extra data from README
      const readme = await fetchRepoReadme(USERNAME, repo.name);
      const metadata = extractMetadata(readme);

      // Prepare tools (prefer metadata, fallback to github topics excluding 'portfolio')
      const tools = metadata.tools || repo.topics?.filter((t: string) => !t.includes('portfolio')) || [];

      // If a thumbnail URL exists in the metadata, upload the image to Sanity!
      let imageAsset = undefined;
      if (metadata.thumbnail) {
        console.log(`   🖼️  Uploading thumbnail for ${repo.name}...`);
        try {
          const imageRes = await fetch(metadata.thumbnail);
          if (imageRes.ok) {
            const buffer = await imageRes.arrayBuffer();
            // Upload the image buffer directly to Sanity Assets
            const asset = await sanity.assets.upload('image', Buffer.from(buffer), { filename: `${repo.name}-thumbnail` });
            imageAsset = { _type: 'image', asset: { _type: 'reference', _ref: asset._id } };
          }
        } catch (err) {
          console.log(`   ⚠️  Failed to upload thumbnail for ${repo.name}`);
        }
      }

      // 3. Create Draft Document
      const sanityDocument = {
        _id: `drafts.github-project-${repo.id}`, // The 'drafts.' prefix makes it unpublished!
        _type: "project",
title: metadata.title || repo.name.replace(/-/g, " ").replace(/\b\w/g, (char: any) => char.toUpperCase()),        name: repo.name,
        description: metadata.description || repo.description || "",
        detailedDescription: metadata.detailedDescription || "",
        tools: tools,
        githubUrl: repo.html_url,
        liveUrl: repo.homepage || "",
        ...(imageAsset && { thumbnail: imageAsset }) // Attach image if it was uploaded
      };

      // Create it ONLY if the ID doesn't already exist
      await sanity.createIfNotExists(sanityDocument);
      console.log(`✅ Created Draft: ${repo.name}`);
    }

    console.log("🎉 Sync complete!");
  } catch (error) {
    console.error("❌ Sync failed:", error);
  }
}

syncProjects();