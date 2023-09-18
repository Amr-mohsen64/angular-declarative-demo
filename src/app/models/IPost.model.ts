export interface IPost {
  id?: string;
  categoryId: string;
  categoryName?: string;
  description: string;
  title: string;
}

export interface CRUDAction<T> {
  action: 'add' | 'update' | 'delete';
  data: T;
}
