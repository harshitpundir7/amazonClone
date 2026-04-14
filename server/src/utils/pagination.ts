interface PaginationQuery {
  page?: string;
  limit?: string;
  [key: string]: unknown;
}

export interface PaginationResult {
  page: number;
  limit: number;
  skip: number;
  take: number;
}

export const parsePagination = (query: PaginationQuery): PaginationResult => {
  const page = Math.max(1, parseInt(query.page ?? '1', 10) || 1);
  const limit = Math.min(100, Math.max(1, parseInt(query.limit ?? '20', 10) || 20));

  return {
    page,
    limit,
    skip: (page - 1) * limit,
    take: limit,
  };
};
