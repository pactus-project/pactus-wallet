import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

/**
 * Reads a markdown file and returns its content and frontmatter
 * @param filename - The name of the markdown file (without extension)
 * @returns The content and frontmatter of the markdown file
 */
export function getMarkdownContent(filename: string) {
  const contentDirectory = path.join(process.cwd(), 'src/content');
  const fullPath = path.join(contentDirectory, `${filename}.md`);

  try {
    const fileContents = fs.readFileSync(fullPath, 'utf8');
    const { data: frontmatter, content } = matter(fileContents);

    return {
      content,
      frontmatter,
    };
  } catch (error) {
    console.error(`Error reading markdown file: ${filename}.md`, error);
    return {
      content: '',
      frontmatter: {},
    };
  }
}
