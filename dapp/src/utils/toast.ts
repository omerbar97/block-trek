
import { signIn } from "next-auth/react"
import { toast } from "sonner"


export const unauthenticatedAccessToast = () => {
  toast("Unauthorized Access", {
    description: "Failed to retrive user credentials. Redirecting to sign in page",
    action: {
      label: "Go to sign in page",
      onClick: () => signIn(),
    },
    duration: 5000
  })
}


export const goalAmountCannotBeNegativeToast = () => {
  toast("Goal Amount Cannot be Negative", {
    description: "The goal amount can be only positive floating point number",
    duration: 5000
  })
}

export const donationAmountCannotBeNegativeToast = () => {
  toast("Donation Amount Cannot be Negative", {
    description: "The donation amount can be only positive floating point number",
    duration: 5000
  })
}