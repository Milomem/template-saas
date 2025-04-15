import { handleAuth } from "@/app/actions/handle-auth";
import { auth } from "@/app/lib/auth";
import { redirect } from "next/navigation";

export default async function Dashboard() {
    const session = await auth()
    
    if(!session) {
        redirect("/login")
    }

    return (
        <div className=" flex flex-col items-center justify-center h-screen">
            <h1 className=" text-4xl font-bold">Dashboard</h1>
            <p className=" text-lg">Welcome to the dashboard!</p>
            <p className=" text-lg">Email: {session?.user?.email}</p>
            {session?.user?.email && (
                <form
                action={handleAuth}
                >
                    <button 
                    type="submit" 
                    className="mt-4 px-4 cursor-pointer py-2 bg-blue-500 text-white rounded"
                    >
                        Signout
                    </button>
                </form>
            )}
        </div>
    );
}