import { ChevronDownIcon, ChevronUpIcon } from "@chakra-ui/icons";
import { Flex, IconButton, Text } from "@chakra-ui/react";
import React, { useState } from "react";
import { PostsQuery, useVoteMutation } from "../generated/graphql";

interface UpdootSectionProps {
  post: PostsQuery["posts"]["posts"][0];
}

export const UpdootSection: React.FC<UpdootSectionProps> = ({ post }) => {
  const [loading, setLoading] = useState<
    "updoot-loading" | "downdoot-loading" | "not-loading"
  >("not-loading");
  const [{ fetching, operation }, vote] = useVoteMutation();

  return (
    <Flex direction="column" justify="center" align="center" mr={4}>
      <IconButton
        onClick={async () => {
          setLoading("updoot-loading");
          await vote({ postId: post.id, value: 1 });
          setLoading("not-loading");
        }}
        isLoading={loading === "updoot-loading"}
        aria-label="updoot post"
        icon={<ChevronUpIcon boxSize="24px" />}
      />

      <Text>{post.points}</Text>
      <IconButton
        onClick={async () => {
          setLoading("downdoot-loading");
          await vote({ postId: post.id, value: -1 });
          setLoading("not-loading");
        }}
        isLoading={loading === "downdoot-loading"}
        aria-label="downdoot post"
        icon={<ChevronDownIcon boxSize="24px" />}
      />
    </Flex>
  );
};
