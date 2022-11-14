import { Button } from "@chakra-ui/button";
import { Form, Formik } from "formik";
import { withUrqlClient } from "next-urql";
import { useRouter } from "next/router";
import React from "react";
import InputField from "../components/InputField";
import { Layout } from "../components/Layout";
import { useCreatePostMutation } from "../generated/graphql";
import { createUrqlClient } from "../utils/createUrqlClient";
import { useIsAuth } from "../utils/useIsAuth";

const initialValues = { title: "", text: "" };

const CreatePost: React.FC<{}> = ({}) => {
  const router = useRouter();
  // redirect if not in fetching && not logged in
  useIsAuth();

  const [, createPost] = useCreatePostMutation();
  return (
    <Layout variant="small">
      <Formik
        initialValues={initialValues}
        onSubmit={async (values) => {
          const { error } = await createPost({ inputs: values });
          if (!error) {
            router.push("/");
          }
        }}
      >
        {({ isSubmitting }) => (
          <Form>
            <InputField name="title" label="Title" placeholder="Title" />
            <InputField textarea name="text" label="Text" placeholder="Text" />
            <Button
              isLoading={isSubmitting}
              type="submit"
              mt={4}
              colorScheme="teal"
            >
              create post
            </Button>
          </Form>
        )}
      </Formik>
    </Layout>
  );
};

export default withUrqlClient(createUrqlClient)(CreatePost);
