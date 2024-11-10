export type SortDirection = 'asc' | 'desc';

export type FilterAndSortOptions = 'name' | 'height' | 'type' | 'createdAt';

export type Filter = { key: FilterAndSortOptions; value: string };
export type Sort = { key: FilterAndSortOptions; direction: SortDirection };
