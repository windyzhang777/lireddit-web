import { Cache, QueryInput } from "@urql/exchange-graphcache";

export function betterUpdateQuery<Mutation, Query>(
  cache: Cache,
  qi: QueryInput,
  result: any,
  fn: (_result: Mutation, _query: Query) => Query
) {
  return cache.updateQuery(qi, (data: any) => fn(result, data) as any);
}
