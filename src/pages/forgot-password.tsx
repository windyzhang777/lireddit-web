import { Box, Button } from "@chakra-ui/react";
import { Formik, Form } from "formik";
import { withUrqlClient } from "next-urql";
import { useRouter } from "next/router";
import React, { useState } from "react";
import InputField from "../components/InputField";
import Wrapper from "../components/Wrapper";
import { useForgotPasswordMutation } from "../generated/graphql";
import { createUrqlClient } from "../utils/createUrqlClient";
// import * as Yup from "yup";

const initialValues = { email: "" };

const ForgotPassword: React.FC<{}> = () => {
  const router = useRouter();
  const [complete, setComplete] = useState(false);
  const [, forgotPassword] = useForgotPasswordMutation();
  return (
    <Wrapper variant="small">
      <Formik
        initialValues={initialValues}
        // validationSchema={Yup.object().shape({
        //   email: Yup.string().email("Invalid email address").required("Required"),
        // })}
        onSubmit={async (values) => {
          await forgotPassword({ email: values.email });
          setComplete(true);
        }}
      >
        {({ isSubmitting }) =>
          complete ? (
            <>
              <Box fontSize={12} my={4}>
                We'll send a reset-password link to your email if an account with this email exists.
              </Box>
              <Button type="button" onClick={() => router.push("/")} colorScheme="teal">
                Go Back
              </Button>
            </>
          ) : (
            <Form>
              <InputField label="email" name="email" placeholder="email" />

              <Button type="submit" isLoading={isSubmitting} colorScheme="teal">
                forgot password
              </Button>
            </Form>
          )
        }
      </Formik>
    </Wrapper>
  );
};
export default withUrqlClient(createUrqlClient)(ForgotPassword);
