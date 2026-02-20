export type NavLink = { label: string; href: string; id: string };

export type Chili = {
  name: string;
  region: string;
  species: string;
  notes: string;
  altitude?: string;
  harvest?: string;
};

export type JournalPost = {
  title: string;
  excerpt: string;
  date: string;
  href: string;
  tag: string;
};

export type Accent = 'earth' | 'red' | 'ink';

export type Pillar = {
  eyebrow: string;
  title: string;
  body: string;
  href: string;
  accent: Accent;
};
