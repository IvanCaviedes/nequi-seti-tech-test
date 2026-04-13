import type { Category } from './category.model';

export type NoteStatus = 'active' | 'completed' | 'deleted' | 'all';

export interface Note {
  id: string;
  title: string;
  content: string;
  categoryIds?: string[];
  status: NoteStatus;
  isFavorite: boolean;
  createdAt: number;
  updatedAt: number;
  reminderAt?: number;
}

export type NoteWithCategory = Note & {
  categories: (Category | undefined)[];
};
