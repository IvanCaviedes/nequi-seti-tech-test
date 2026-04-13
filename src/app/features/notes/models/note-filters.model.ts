import type { NoteStatus } from './note.model';

export interface NoteFilters {
  search: string;
  categoryIds: string[];
  status: NoteStatus;
  isFavorite?: boolean;
}
