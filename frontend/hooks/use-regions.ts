import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api-client';

export interface Region {
  id: string;
  name: string;
  currencyCode: string;
  taxRate: number;
  countries: { code: string; name: string }[];
}

export function useRegions() {
  return useQuery({
    queryKey: ['regions'],
    queryFn: () => api.get<Region[]>('/store/regions'),
  });
}
