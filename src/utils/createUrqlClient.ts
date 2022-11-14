import {
  dedupExchange,
  fetchExchange,
  Exchange,
  stringifyVariables,
  gql,
} from "urql";
import { cacheExchange, Resolver } from "@urql/exchange-graphcache";
import {
  LoginMutation,
  MeDocument,
  RegisterMutation,
  MeQuery,
  VoteMutationVariables,
} from "../generated/graphql";
import { betterUpdateQuery } from "./betterUpdateQuery";
import { pipe, tap } from "wonka";
import Router from "next/router";

export const errorExchange: Exchange = ({ forward }) => (ops$) => {
  return pipe(
    forward(ops$),
    tap(({ error }) => {
      if (error) {
        if (error?.message?.includes("not authenticated")) {
          Router.replace("/login");
        }
      }
    })
  );
};

const cursorPagination = (): Resolver => {
  return (_parent, fieldArgs, cache, info) => {
    const { parentKey: entityKey, fieldName } = info; // Query, posts
    const allFields = cache.inspectFields(entityKey);
    const fieldInfos = allFields.filter((info) => info.fieldName === fieldName);

    // on first load
    if (fieldInfos.length === 0) return undefined;

    const fieldKey = `${fieldName}(${stringifyVariables(fieldArgs)})`; // posts({"limit":10, "cursor":null | <createdAt>})
    const isInCache = cache.resolve(
      cache.resolve(entityKey, fieldKey) as string,
      "posts"
    );

    // update cache
    info.partial = !isInCache;

    const results: string[] = [];
    let hasMore = true;
    fieldInfos.forEach((fieldInfo) => {
      const key = cache.resolve(
        entityKey, // Query
        fieldInfo.fieldKey // posts({"limit":50})
      ) as string; // Query.posts({"limit":50})
      const data = cache.resolve(key, "posts") as string[];
      const _hasMore = cache.resolve(key, "hasMore") as boolean;
      if (!_hasMore) hasMore = _hasMore;
      results.push(...data);
    });
    // console.log(`------- results :`, JSON.stringify(results, null, 2));
    return {
      __typename: "PaginatedPost",
      hasMore,
      posts: results,
    };
  };
};

export const createUrqlClient = (ssrExchange: any) => ({
  url: "http://localhost:4000/graphql",
  fetchOptions: { credentials: "include" as const },
  exchanges: [
    dedupExchange,
    cacheExchange({
      keys: {
        PaginatedPost: () => null,
      },
      resolvers: {
        Query: {
          posts: cursorPagination(),
        },
      },
      updates: {
        Mutation: {
          vote: (result, args, cache, info) => {
            const { postId, value } = args as VoteMutationVariables;
            const data = cache.readFragment(
              gql`
                fragment _ on Post {
                  id
                  points
                }
              `,
              { id: postId }
            );
            if (data) {
              cache.writeFragment(
                gql`
                  fragment _ on Post {
                    points
                  }
                `,
                { id: postId, points: value + data.points }
              );
            }
          },
          createPost: (result, args, cache, info) => {
            const allFields = cache.inspectFields("Query");
            const postsfield = allFields.filter(
              (field) => field.fieldName === "posts"
            );
            postsfield.forEach((field) => {
              cache.invalidate("Query", "posts", field.arguments || undefined);
            });
          },
          login: (result, args, cache, info) => {
            betterUpdateQuery<LoginMutation, MeQuery>(
              cache,
              { query: MeDocument },
              result,
              (_result, _query) => {
                if (_result?.login?.errors) {
                  return _query;
                } else {
                  return { me: _result.login.user };
                }
              }
            );
          },
          register: (result, args, cache, info) => {
            betterUpdateQuery<RegisterMutation, MeQuery>(
              cache,
              { query: MeDocument },
              result,
              (_result, _query) => {
                if (_result?.register?.errors) {
                  return _query;
                } else {
                  return { me: _result.register.user };
                }
              }
            );
          },
          logout: (result, args, cache, info) => {
            betterUpdateQuery(cache, { query: MeDocument }, result, () => {
              return { me: null };
            });
          },
        },
      },
    }),
    errorExchange,
    ssrExchange,
    fetchExchange,
  ],
});
