
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


export const failedToConnectToMetamaskWalletToast = () => {
  toast("Something was failing during the connection to metamask wallet", {
    description: "Please try again later",
    duration: 5000
  })
}

export const successToConnectToMetamaskWalletToast = () => {
  toast("Connected to metamask successfully", {
    description: "Good job mate!",
    duration: 5000
  })
}

export const genericToast = (title: string, description: string, timeout=5000) => {
  toast(title, {
    description: description,
    duration: timeout
  })
}

export const waitingForSessionToBeResolvedToast = () => {
  toast("Please wait a few seconds for session to be resolved", {
    description: "...",
    duration: 5000
  })
}

export const uploadOnlyImagesToast = () => {
  toast("You can only upload image files here!", {
    description: "Don't try to beat the system dude..",
    duration: 5000
  })
}

export const uploadMaxImageSizeExceedsToast = () => {
  toast("Damm that's a heavy one", {
    description: "The max image size is 5MB.",
    duration: 5000
  })
}


export const uploadImageSuccessToast = () => {
  toast("That's a pretty good image!", {
    description: "Good job mate!",
    duration: 5000
  })
}

export const dateIsNotValidToast = () => {
  toast("Cannot select a day that already pass..", {
    description: "Bad job mate!",
    duration: 5000
  })
}

export const totalNumberOfDaysToast = (days: number) => {
  toast("This campaign will be running for " + days + " days!", {
    description: "That's crazy",
    duration: 5000
  })
}

export const totalNumberOfHoursToast = (hours: number) => {
  toast("This campaign will be running for " + hours + " hours!", {
    description: "That's very close!",
    duration: 5000
  })
}

export const failedToAttachOwnerToWalletToast = (hours: number) => {
  toast("Failed to attach a new owner to this wallet address", {
    description: "Please try again later",
    duration: 5000
  })
}