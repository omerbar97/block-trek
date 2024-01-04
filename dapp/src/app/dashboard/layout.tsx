import Sidebar from "@/components/sidebar.component";
 
export default function Layout({ children }: { children: React.ReactNode }) {

  return (
    <div className="flex h-screen flex-col bg-gray-50">
      <div className="w-full flex-none">
        <Sidebar/>
      </div>
      <div className="flex-grow md:overflow-y-auto ml-16 mt-4">{children}</div>
    </div>
  );
}