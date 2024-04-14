import fs from 'fs';
import { Repo, Files } from "@/files/interfaces";

export default function readFiles(currentPath: string) {
  try {
    const path = '/files' + currentPath; 
    const files = fs.readdirSync(
      process.cwd() + path
    );
    const markdown = files.filter(file => file.endsWith('.md'));
    return markdown.map((filename) => ({
      filename: filename,
      content: fs.readFileSync(`${path}/${filename}`, 'utf8')
    }));
  } catch (error) {
    console.error(error);
    return [];
  }
}

export async function getRepos() {
  try {
    const res = await fetch('https://api.github.com/users/leomosley/repos');
    if (!res.ok) {
      throw new Error('Failed to fetch repos');
    }
    const data = await res.json();
    return data as Repo[];
  } catch (error) {
    console.error('Error fetching repos:', error);
  }
}
export async function getShowcaseRepos() {
  const repos = await getRepos();
  if (repos) {
    const filtered = repos.filter(repo => repo.topics?.includes('showcase'));
    return filtered;
  }
}

export async function getFiles() {
  const files: Files = {
    "~": [],
    "/about": [],
    "/projects": [],
    "/contact": [],
  }

  const showcaseRepos = await getShowcaseRepos();
  if (showcaseRepos) {
    files["/projects"].push(...showcaseRepos.map((repo) => ({
      filename: repo.name ?? "filename"
    })));
  }
  
  const contact = readFiles("/contact");
  if (contact) {
    files["/about"].push(...contact);
  }
  return files;
};