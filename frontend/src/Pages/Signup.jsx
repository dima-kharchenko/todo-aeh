function Signup() {
  return (
    <div className="h-screen flex items-center justify-center p-6">
      <div className="w-sm bg-surface-a10 p-6 rounded-2xl">
        <p className="text-2xl font-semibold text-center text-primary-a0 mb-6">
          Sign Up 
        </p>
        <form className="space-y-4 text-white">
            <input
              type="text"
              id="username"
              className="w-full px-4 py-2 rounded-lg bg-surface-a20 placeholder-surface-a50 focus:outline-none focus:ring-2 focus:ring-primary-a0 transition"
              placeholder="Username"
            />
            <input
              type="password"
              id="password"
              className="w-full px-4 py-2 rounded-lg bg-surface-a20 placeholder-surface-a50 focus:outline-none focus:ring-2 focus:ring-primary-a0 transition"
              placeholder="Password"
            />
            <button
              type="submit"
              className="w-full py-2 mt-4 rounded-lg bg-primary-a0 hover:bg-primary-a30 transition">
              Sign Up 
            </button>
            <a className="text-primary-a0 hover:text-primary-a30 transition text-sm" href="/login">Already have an account?</a>
        </form>
      </div>
    </div>  
    );
}

export default Signup;

