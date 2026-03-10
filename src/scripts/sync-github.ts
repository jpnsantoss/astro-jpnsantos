import { createClient } from "@sanity/client";
import "dotenv/config";
import { GoogleGenerativeAI } from "@google/generative-ai";

const sanity = createClient({
  projectId: "dbowprqv",
  dataset: "production",
  useCdn: false,
  apiVersion: "2024-03-10",
  token: process.env.SANITY_API_TOKEN,
});

// Initialize Gemini only if key is present
const genAI = process.env.GEMINI_API_KEY ? new GoogleGenerativeAI(process.env.GEMINI_API_KEY) : null;
const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const USERNAME = "jpnsantoss";

const getHeaders = (isRaw = false) => ({
  Accept: isRaw ? "application/vnd.github.v3.raw" : "application/vnd.github.v3+json",
  "User-Agent": "Astro-Portfolio-Sync",
  ...(GITHUB_TOKEN ? { Authorization: `Bearer ${GITHUB_TOKEN}` } : {}),
});

async function fetchRepoReadme(owner: string, repo: string): Promise<string | null> {
  try {
    const res = await fetch(`https://api.github.com/repos/${owner}/${repo}/readme`, { headers: getHeaders(true) });
    return res.ok ? await res.text() : null;
  } catch { return null; }
}

async function processWithGemini(readme: string, repoName: string): Promise<any> {
  if (!genAI) return null;
  try {
    console.log(`   🤖 Sending ${repoName} to Gemini...`);
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
    const result = await model.generateContent(`Analyze README for "${repoName}". Return JSON: {"title": string, "description": string, "detailedDescription": string, "tools": string[]}. README: ${readme.substring(0, 2000)}`);
    const cleanJson = result.response.text().replace(/```json\n?|\n?```/g, "").trim();
    return JSON.parse(cleanJson);
  } catch (e: any) {
    console.error(`   ❌ GEMINI ERROR (${repoName}):`, e.message);
    return null;
  }
}

async function syncProjects() {
  console.log(`🚀 Starting sync for ${USERNAME}...`);

  try {
    const reposRes = await fetch(`https://api.github.com/users/${USERNAME}/repos?per_page=100`, { headers: getHeaders() });
    const allRepos = await reposRes.json();
    const portfolioRepos = allRepos.filter((r: any) => r.topics?.includes('portfolio') || r.topics?.includes('portfolio-full'));
    
    const existingProjects = await sanity.fetch(`*[_type == "project"]{_id, name, detailedDescription, githubUrl}`);

    for (const repo of portfolioRepos) {
      const existingDoc = existingProjects.find((p: any) => p.githubUrl === repo.html_url);
      
      // SKIP if we already have a detailed description
      if (existingDoc?.detailedDescription) {
        console.log(`⏭️  Skipping: ${repo.name} (Already complete)`);
        continue;
      }

      console.log(`📥 Processing: ${repo.name}...`);
      const readme = await fetchRepoReadme(USERNAME, repo.name);
      const aiMetadata = readme ? await processWithGemini(readme, repo.name) : null;

      const sanityDocument = {
        _id: existingDoc?._id || `drafts.github-project-${repo.id}`,
        _type: "project",
        title: aiMetadata?.title || repo.name.replace(/-/g, " ").replace(/\b\w/g, (c: any) => c.toUpperCase()),
        name: repo.name,
        description: aiMetadata?.description || repo.description || "",
        detailedDescription: aiMetadata?.detailedDescription || "",
        tools: aiMetadata?.tools || repo.topics?.filter((t: string) => !t.includes('portfolio')) || [],
        githubUrl: repo.html_url,
      };

      await sanity.createOrReplace(sanityDocument);
      console.log(`✅ Synced: ${repo.name}`);
      
      // Throttle to 4 seconds to avoid hitting API limits
      await new Promise(resolve => setTimeout(resolve, 4000));
    }
    console.log("🎉 All done!");
  } catch (error) {
    console.error("❌ Critical sync failure:", error);
  }
}

syncProjects();