import { sanityClient } from "sanity:client";

const SKILLS_QUERY = `*[_type == "skill"] | order(orderRank) {
  _id,
  title,
  skills
}`;

export interface Skill {
  _id: string;
  title: string;
  skills: string[];
}

export async function getSkills(): Promise<Skill[]> {
  const data = await sanityClient.fetch(SKILLS_QUERY);
  return data;
}

// Education Query and Interface
const EDUCATION_QUERY = `*[_type == "education"] | order(orderRank) {
  _id,
  title,
  institution {
    name,
    "logo": logo.asset->url
  },
  location,
  startDate,
  endDate
}`;

export interface Education {
  _id: string;
  title: string;
  institution: {
    name: string;
    logo: string;
  };
  location: string;
  startDate: string;
  endDate: string;
}

export async function getEducation(): Promise<Education[]> {
  const data = await sanityClient.fetch(EDUCATION_QUERY);
  return data;
}

// Experience Query and Interface
const EXPERIENCE_QUERY = `*[_type == "experience"] | order(orderRank) {
  _id,
  title,
  company {
    name,
    "logo": logo.asset->url
  },
  location,
  startDate,
  endDate,
  description
}`;

export interface Experience {
  _id: string;
  title: string;
  company: {
    name: string;
    logo: string;
  };
  location: string;
  startDate: string;
  endDate: string;
  description: string;
}

export async function getExperience(): Promise<Experience[]> {
  const data = await sanityClient.fetch(EXPERIENCE_QUERY);
  return data;
}

const PROJECTS_QUERY = `*[_type == "project"] | order(orderRank) {
  _id,
  title,
  name,
  description,
  detailedDescription,
  tools,
  githubUrl,
  liveUrl,
  "thumbnail": thumbnail.asset->url
}`;

export interface Project {
  _id: string;
  title?: string;
  name?: string;
  description?: string;
  detailedDescription?: string;
  tools?: string[];
  githubUrl?: string;
  liveUrl?: string;
  thumbnail?: string;
}

export async function getProjects(): Promise<Project[]> {
  const data = await sanityClient.fetch(PROJECTS_QUERY);
  return data;
}

const PERSONAL_INFO_QUERY = `*[_type == "personalInfo"][0] {
  name,
  "profilePicture": profilePicture.asset->url,
  location,
  email,
  description,
  "resume": resume.asset->url,
  github,
  linkedin,
  instagram,
  twitter,
  aboutMe
}`;

export interface PersonalInfo {
  name: string;
  profilePicture: string;
  location: string;
  email: string;
  description: string;
  resume: string;
  github: string;
  linkedin: string;
  instagram: string;
  twitter: string;
  aboutMe: any[];
}

export async function getPersonalInfo(): Promise<PersonalInfo> {
  const data = await sanityClient.fetch(PERSONAL_INFO_QUERY);
  return data;
}