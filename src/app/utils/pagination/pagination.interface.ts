export interface IPaginationOptions {
  page: string | number;
  limit: string | number;
  sortBy: string;
  orderBy: string;
}

export interface IPagination {
  page: number;
  limit: number;
  skip: number;
  sortBy: string;
  orderBy: string;
}
