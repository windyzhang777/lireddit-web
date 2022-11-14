import * as Yup from "yup";

export const userResponseSchema = Yup.object().shape({
  email: Yup.string().email("Invalid email address").required("Required"),
  username: Yup.string().min(3, "Must be 3 characters or more").required("Required"),
  password: Yup.string().min(3, "Must be 3 characters or more").required("Required"),
});
