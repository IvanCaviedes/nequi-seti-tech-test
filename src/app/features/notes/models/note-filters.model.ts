import type { NoteStatus } from './note.model';

export interface NoteFilters {
  query?: string;
  categoryId?: string;
  status?: NoteStatus;
  isFavorite?: boolean;
  tags?: string[];
}
