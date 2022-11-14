import { Button } from "@chakra-ui/button";
import { Form, Formik } from "formik";
import React from "react";
import InputField from "../components/InputField";
import Wrapper from "../components/Wrapper";
import { useRegisterMutation } from "../generated/graphql";
import { toErrorMap } from "../utils/toErrorMap";
import { userResponseSchema } from "../utils/yupSchemas";
import { useRouter } from "next/router";
import { createUrqlClient } from "../utils/createUrqlClient";
import { withUrqlClient } from "next-urql";

interface RegisterProps {}

const initialValues = { email: "", username: "", password: "" };

const Register: React.FC<RegisterProps> = ({}) => {
  const router = useRouter();
  const [, register] = useRegisterMutation();
  return (
    <Wrapper variant="small">
      <Formik
        initialValues={initialValues}
        validationSchema={userResponseSchema}
        validateOnChange
        onSubmit={async (values, { setErrors }) => {
          const response = await register({ options: values });
          if (response?.data?.register?.errors) {
            setErrors(toErrorMap(response?.data?.register?.errors));
          } else if (response?.data?.register?.user) {
            // submitted successfully and re-route
            router.push("/");
          }
        }}
      >
        {({ isSubmitting }) => (
          <Form>
            <InputField name="email" label="email" placeholder="email" />
            <InputField name="username" label="username" placeholder="username" />
            <InputField name="password" label="password" placeholder="password" type="password" />
            <Button isLoading={isSubmitting} type="submit" mt={4} colorScheme="teal">
              Register
            </Button>
          </Form>
        )}
      </Formik>
    </Wrapper>
  );
};

export default withUrqlClient(createUrqlClient)(Register);
