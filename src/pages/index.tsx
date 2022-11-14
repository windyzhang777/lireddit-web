import {
  Box,
  Button,
  Flex,
  Heading,
  IconButton,
  Link,
  Stack,
  Text,
} from "@chakra-ui/react";
import { ChevronUpIcon, ChevronDownIcon } from "@chakra-ui/icons";
import { withUrqlClient } from "next-urql";
import NavLink from "next/link";
import React, { useState } from "react";
import { Layout } from "../components/Layout";
import { usePostsQuery } from "../generated/graphql";
import { createUrqlClient } from "../utils/createUrqlClient";
import { UpdootSection } from "../components/UpdootSection";

const Index = () => {
  const [variables, setVariables] = useState({
    limit: 30,
    cursor: undefined as undefined | string,
  });
  const [{ data, fetching }] = usePostsQuery({ variables: variables });

  const handleLoadMore = () => {
    setVariables({
      ...variables,
      cursor: data?.posts?.posts?.slice(-1)[0].createdAt,
    });
  };

  let content;
  if (fetching && !data?.posts?.posts) {
    // loading
    content = "Fetching posts...";
  } else if (!fetching && !data?.posts?.posts) {
    // no posts found
    content = "No posts found";
  } else {
    content = (
      <Stack spacing={8}>
        {data!.posts.posts.map((post) => (
          <Flex key={post.id} p={5} shadow="md" borderWidth="1px">
            <UpdootSection post={post} />
            <Box>
              <Heading fontSize="xl">{post.title}</Heading>
              <Text>posted by {post.creator.username}</Text>
              <Text mt={4}>{post.textSnippet}...</Text>
            </Box>
          </Flex>
        ))}
      </Stack>
    );
  }

  return (
    <Layout>
      <Flex align="center">
        <Heading>Posts</Heading>
        <NavLink href="/create-post">
          <Link ml="auto">create post</Link>
        </NavLink>
      </Flex>
      <Box mt={2}>{content}</Box>
      {data?.posts?.hasMore && (
        <Flex>
          <Button
            onClick={handleLoadMore}
            isLoading={fetching}
            m="auto"
            my={8}
            colorScheme="telegram"
          >
            load more
          </Button>
        </Flex>
      )}
    </Layout>
  );
};

export default withUrqlClient(createUrqlClient, { ssr: true })(Index);
