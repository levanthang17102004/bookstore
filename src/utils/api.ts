import authenticationAPI from "@/apis/authApi";

export const loginAPI = async (email: string, password: string) => {
  return await authenticationAPI.HandleAuthentication(
    "/login",
    {
      email: email.trim(),
      password: password,
    },
    "post"
  );
};

