import { Button, Flex, Link } from "@chakra-ui/react";
import { Formik, Form } from "formik";
import { useRouter } from "next/router";
import React from "react";
import InputField from "../components/InputField";
import Wrapper from "../components/Wrapper";
import { useLoginMutation } from "../generated/graphql";
import { withUrqlClient } from "next-urql";
import { createUrqlClient } from "../utils/createUrqlClient";
import { toErrorMap } from "../utils/toErrorMap";
import NextLink from "next/link";

interface LoginProps {}

const initialValues = { emailOrUsername: "", password: "" };

const Login: React.FC<LoginProps> = ({}) => {
  const router = useRouter();
  const [, login] = useLoginMutation();
  return (
    <Wrapper variant="small">
      <Formik
        initialValues={initialValues}
        onSubmit={async (values, { setErrors }) => {
          const response = await login(values);
          if (response?.data?.login?.errors) {
            setErrors(toErrorMap(response?.data?.login?.errors));
          } else {
            // submitted successfully and re-route
            // console.log('------- router : ', router)
            if (typeof router?.query?.next === "string") {
              router.push(router.query.next);
            } else {
              router.push("/");
            }
          }
        }}
      >
        {({ isSubmitting }) => (
          <Form>
            <InputField
              name="emailOrUsername"
              label="Email or Username"
              placeholder="Email or Username"
            />
            <InputField
              name="password"
              label="Password"
              placeholder="Password"
              type="password"
            />
            <Flex mt={2} fontSize={12}>
              <NextLink href="/forgot-password">
                <Link ml="auto">forgot password?</Link>
              </NextLink>
            </Flex>
            <Button
              isLoading={isSubmitting}
              type="submit"
              mt={4}
              colorScheme="teal"
            >
              Login
            </Button>
          </Form>
        )}
      </Formik>
    </Wrapper>
  );
};

export default withUrqlClient(createUrqlClient)(Login);
