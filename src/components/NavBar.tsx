import { Box, Button, Flex, Link } from "@chakra-ui/react";
import React from "react";
import { useLogoutMutation, useMeQuery } from "../generated/graphql";
import NavLink from "next/link";
import { isServer } from "../utils/isServer";

interface NavBarProps {}

export const NavBar: React.FC<NavBarProps> = ({}) => {
  const [{ fetching: userFetching, data }] = useMeQuery({ pause: isServer() });
  const [{ fetching: logoutFetching }, logout] = useLogoutMutation();
  let content;
  if (userFetching) {
    // loading
    return null;
  } else if (data?.me) {
    // logged in
    content = (
      <Flex>
        <Box mr={2}>{data?.me?.username}</Box>
        <Button
          variant="link"
          onClick={() => logout()}
          isLoading={logoutFetching}
        >
          Logout
        </Button>
      </Flex>
    );
  } else {
    // not logged in
    content = (
      <>
        <NavLink href="/login">
          <Link mr={2}>Login</Link>
        </NavLink>
        <NavLink href="/register">
          <Link>Register</Link>
        </NavLink>
      </>
    );
  }
  return (
    <Flex position="sticky" top={0} zIndex="99" bg="tan" p={4}>
      <Box ml={"auto"}>{content}</Box>
    </Flex>
  );
};
