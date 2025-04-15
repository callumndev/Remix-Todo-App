import { LoaderFunctionArgs } from "@remix-run/node";
import { Form, Link, useNavigate } from "@remix-run/react";

import { Button, TextInput, Title, Text, Anchor, Box, Alert } from "@mantine/core";
import { useForm } from "@mantine/form";
import { zodResolver } from "mantine-form-zod-resolver";
import { redirectWithInfo } from "remix-toast";

import { authClient } from "~/lib/auth.client";
import { auth } from "~/lib/auth.server";
import { loginFormSchema } from "~/lib/schemas";

export async function loader({ request }: LoaderFunctionArgs) {
    const authSession = await auth.api.getSession({
        headers: request.headers,
    });

    if (authSession)
        return redirectWithInfo("/", "You are already logged in!");

    return null;
}

export default function Login() {
    const navigate = useNavigate();

    const form = useForm({
        mode: "uncontrolled",
        initialValues: {
            email: "",
            password: "",
        },
        validate: zodResolver(loginFormSchema),
    });

    const login = async (values: typeof form.values) => {
        await authClient.signIn.email(
            {
                email: values.email,
                password: values.password,
            },
            {
                onSuccess: () => navigate("/"),
                onError: (ctx) => {
                    let errorField: string = "global";
                    switch (ctx.error.code) {
                        case "USER_NOT_FOUND":
                        case "INVALID_EMAIL":
                        case "USER_EMAIL_NOT_FOUND":
                        case "USER_ALREADY_EXISTS":
                        case "ACCOUNT_NOT_FOUND":
                            errorField = "email";
                            break;

                        case "INVALID_PASSWORD":
                        case "PASSWORD_TOO_SHORT":
                        case "PASSWORD_TOO_LONG":
                            errorField = "password";
                            break;
                    }
                    form.setErrors({ [errorField]: ctx.error.message });
                },
            },
        );
    };

    return (
        <>
            <Title
                ta="center"
                mt={75}
            >
                Login
            </Title>
            <Text
                size="sm"
                ta="center"
                mb={50}
            >
                Or{" "}
                <Anchor component={Link} to="/register">register an account</Anchor>
            </Text>

            <Box
                p="xl"
                mx="auto"
                maw={700}
            >
                {form.errors.global && (
                    <Alert color="red" mb={20}>
                        {form.errors.global}
                    </Alert>
                )}

                <Form
                    method="post"
                    onSubmit={form.onSubmit(login)}
                >
                    <TextInput type="email" label="Email" name="email" {...form.getInputProps("email")} required mt="md" />
                    <TextInput type="password" label="Password" name="password" {...form.getInputProps("password")} required mt="md" />

                    <Button
                        type="submit"
                        mt="md"
                        w="100%"
                    >
                        Log In
                    </Button>
                </Form>
            </Box >
        </>
    );
}
