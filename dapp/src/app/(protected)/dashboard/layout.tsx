import Sidebar from "@/components/sidebar.component";
import { getServerSession } from "next-auth";
import { authOptions } from "../../api/auth/[...nextauth]/authOptions";
import { redirect } from "next/navigation";

export default async function Layout({ children }: { children: React.ReactNode }) {

  // protecting this route information
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect('/api/auth/signin?callbackUrl=/dashboard')

    // return (
    //   <div role="alert" className="w-96 items-center m-auto mt-16">
    //     <div className="bg-red-500 text-white font-bold rounded-t px-4 py-2 text-center">
    //       Unuthenticate User
    //     </div>
    //     <div className="border border-t-0 border-red-400 rounded-b bg-red-100 px-4 py-3 text-red-700  text-center">
    //       <p>You will be redirected to the sign in page.</p>
    //     </div>
    //   </div>
    // )

  } else {
    return (
      <div className="flex h-screen flex-col  bg-secondImg bg-cover">
        <div className="w-full flex-none p-6">
          <Sidebar />
        </div>
        <div className="flex-grow md:overflow-y-auto ml-16 mt-4 text-white">{children}</div>
      </div>
    );
  }

}

