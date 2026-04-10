export type NoteStatus = 'active' | 'archived' | 'deleted';

export interface Note {
  id: string;
  title: string;
  content: string;

  // Relaciones
  categoryId?: string;
  tagIds?: string[];

  // Estado
  status: NoteStatus;
  isFavorite: boolean;

  // Metadata
  createdAt: number;
  updatedAt: number;

  // Opcional (extra pro)
  reminderAt?: number;
}
