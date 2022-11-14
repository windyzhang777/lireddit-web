import React, { useState } from "react";
import { NextPage } from "next";
import Wrapper from "../../components/Wrapper";
import { Form, Formik } from "formik";
import InputField from "../../components/InputField";
import { Button } from "@chakra-ui/button";
import { useChangePasswordMutation } from "../../generated/graphql";
import { withUrqlClient } from "next-urql";
import { createUrqlClient } from "../../utils/createUrqlClient";
import { toErrorMap } from "../../utils/toErrorMap";
import { useRouter } from "next/router";
import { Box, Flex } from "@chakra-ui/layout";
import { Link } from "@chakra-ui/react";
import NextLink from "next/link";

const initialValues = { newPassword: "" };

const ChangePassword: NextPage<{}> = () => {
  const router = useRouter();
  // console.log("------- router : ", router);
  const [tokenError, setTokenError] = useState("");
  const [, changePassword] = useChangePasswordMutation();
  return (
    <Wrapper variant="small">
      <Formik
        initialValues={initialValues}
        onSubmit={async (values, { setErrors }) => {
          const response = await changePassword({
            token:
              typeof router?.query?.token === "string"
                ? router?.query?.token
                : "",
            newPassword: values.newPassword,
          });
          if (response?.data?.changePassword?.errors) {
            const errorMap = toErrorMap(response?.data?.changePassword?.errors);
            if ("token" in errorMap) {
              setTokenError(errorMap.token);
            }
            setErrors(errorMap);
          } else if (response?.data?.changePassword?.user) {
            router.push("/");
          }
        }}
      >
        {({ isSubmitting }) => (
          <Form>
            <InputField
              name="newPassword"
              label="newPassword"
              placeholder="newPassword"
              type="password"
            />
            {tokenError && (
              <Box>
                <Box color="red">{tokenError}</Box>
                <Flex fontSize={12}>
                  Go to
                  <NextLink href="/forgot-password">
                    <Link mx={1}>reset password</Link>
                  </NextLink>
                  again.
                </Flex>
              </Box>
            )}
            <Button
              type="submit"
              isLoading={isSubmitting}
              colorScheme="teal"
              mt={4}
            >
              Change Password
            </Button>
          </Form>
        )}
      </Formik>
    </Wrapper>
  );
};

// ChangePassword.getInitialProps = ({ query }) => ({
//   token: query.token as string,
// });

export default withUrqlClient(createUrqlClient)(ChangePassword as any);
