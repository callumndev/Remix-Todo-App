import { LoaderFunctionArgs } from "@remix-run/node";
import { Form, Link, useNavigate } from "@remix-run/react";

import { Button, TextInput, Title, Text, Anchor, Box, Alert, Checkbox } from "@mantine/core";
import { useForm } from "@mantine/form";
import { zodResolver } from "mantine-form-zod-resolver";
import { redirectWithInfo } from "remix-toast";

import { authClient } from "~/lib/auth.client";
import { auth } from "~/lib/auth.server";
import { registerFormSchema } from "~/lib/schemas";

export async function loader({ request }: LoaderFunctionArgs) {
    const authSession = await auth.api.getSession({
        headers: request.headers,
    });

    if (authSession)
        return redirectWithInfo("/", "You are already logged in!");

    return null;
}

export default function Register() {
    const navigate = useNavigate();

    const form = useForm({
        mode: "uncontrolled",
        initialValues: {
            name: "",
            email: "",
            password: "",
            confirmPassword: "",
            termsOfService: false,
        },
        validate: zodResolver(registerFormSchema),
    });

    const register = async (values: typeof form.values) => {
        await authClient.signUp.email(
            {
                email: values.email,
                password: values.password,
                name: values.name,
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
                Register
            </Title>
            <Text
                size="sm"
                ta="center"
                mb={50}
            >
                Or{" "}
                <Anchor component={Link} to="/login">login to existing account</Anchor>
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
                    onSubmit={form.onSubmit(register)}
                >
                    <TextInput type="text" label="Name" name="name" {...form.getInputProps("name")} required mt="md" />
                    <TextInput type="email" label="Email" name="email" {...form.getInputProps("email")} required mt="md" />
                    <TextInput type="password" label="Password" name="password" {...form.getInputProps("password")} required mt="md" />
                    <TextInput type="password" label="Confirm password" name="confirm-password" {...form.getInputProps("confirmPassword")} required mt="md" />

                    <Checkbox
                        label="I have read and agree to the Terms of Service and Privacy Policy"
                        key={form.key("termsOfService")}
                        {...form.getInputProps("termsOfService", { type: "checkbox" })}
                        mt="md"
                    />

                    <Button
                        type="submit"
                        mt="md"
                        w="100%"
                    >
                        Register
                    </Button>
                </Form>
            </Box >
        </>
    );
}
