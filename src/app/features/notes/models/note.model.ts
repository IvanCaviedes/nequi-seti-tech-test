import type { Category } from './category.model';

export type NoteStatus = 'active' | 'completed' | 'deleted' | 'all';

export interface Note {
  id: string;
  title: string;
  content: string;

  // Relaciones
  categoryIds?: string[];

  // Estado
  status: NoteStatus;
  isFavorite: boolean;

  // Metadata
  createdAt: number;
  updatedAt: number;

  // Opcional (extra pro)
  reminderAt?: number;
}

export type NoteWithCategory = Note & {
  categories: (Category | undefined)[];
};
