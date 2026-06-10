import charterRaw from '../docs/charter.md?raw';

function extractDraft(md: string): string {
  const match = md.slice(0, 400).match(/\*\*(.+?Draft.*?)\*\*/);
  return match ? match[1] : 'Current Draft';
}

export const charterDraft = extractDraft(charterRaw);
