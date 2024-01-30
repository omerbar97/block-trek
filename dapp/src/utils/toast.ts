import { signIn } from "next-auth/react";
import { toast } from "sonner";


export const unauthenticatedAccessToast = () => {
    toast("Unauthorized Access", {
        description: "Failed to retrive user credentials. Redirecting to sign in page",
        action: {
            label: "Go to sign in page",
            onClick: () => signIn(),
        },
    })
}


export const goalAmountCannotBeNegative = () => {
    toast("Goal Amount Cannot be Negative", {
        description: "The goal amount can be only positive floating point number",
    })
}