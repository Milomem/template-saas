import { handleAuth } from "@/app/actions/handle-auth";

export default function Login() {
  return (
    <div className=" flex flex-col items-center justify-center h-screen">
      <h1 className=" text-4xl font-bold">Login Page</h1>
      <form
      action={handleAuth}
    >
      <button type="submit" className="mt-4 px-4 py-2 cursor-pointer bg-blue-500 text-white rounded">Signin with Google</button>
    </form>
    </div>
  );
}