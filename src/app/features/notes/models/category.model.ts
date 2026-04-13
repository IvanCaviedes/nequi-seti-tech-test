export type CategoryStatus = 'active' | 'disabled';
export interface Category {
  id: string;
  name: string;
  color: string;
  icon: string;

  status: CategoryStatus;

  createdAt: number;
  updatedAt: number;
}

export type CategoryWithCount = Category & {
  notesCount: number;
  completedCount: number;
  canDelete: boolean;
};
