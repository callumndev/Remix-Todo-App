import type { MantineColor } from "@mantine/core";
import { notifications, type NotificationData } from "@mantine/notifications";
import type { ToastMessage } from "remix-toast";

export function getNotificationColourFromType(type: ToastMessage["type"]): MantineColor {
    switch (type) {
        case "error":
            return "red";

        case "warning":
            return "yellow";

        case "info":
            return "blue";

        case "success":
            return "green";

        default:
            return "gray";
    }
}

export const notificationDefaults: Partial<NotificationData> = {
    // Show at top middle of page
    position: "top-center",
    // Hide close button
    withCloseButton: true,
    // Enable border
    withBorder: true,
};

export async function showNotificationFromToastData(toast: ToastMessage): Promise<ReturnType<typeof notifications.show>> {
    return new Promise(resolve =>
        requestAnimationFrame(() =>
            resolve(notifications.show({
                // Add defaults
                ...notificationDefaults,
                // Set colour from toast type
                color: getNotificationColourFromType(toast.type),
                // Add message
                message: toast.message,
            }))
        )
    );
}
