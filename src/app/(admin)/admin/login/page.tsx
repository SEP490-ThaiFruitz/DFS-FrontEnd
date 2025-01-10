import { GoogleIcon } from "@/app/icon/google-icon";
import type { SVGProps } from "react";

export default function HalfSidedGlassMorphismAuthentication() {
  return (
    <section className=" relative flex size-full max-h-full items-center justify-center bg-[url('https://images.unsplash.com/photo-1692606674482-effe67e384d9?q=80&w=3560&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')] bg-cover px-2 py-6 md:px-12  lg:p-0 ">
      <div className="relative z-10 flex flex-1 flex-col rounded-3xl border-white/50 border-t bg-white/60 px-4 py-10 backdrop-blur-2xl sm:justify-center md:flex-none md:px-20 lg:rounded-r-none lg:border-t-0 lg:border-l lg:py-24">
        <div className="mx-auto w-full max-w-md sm:px-4 md:w-96 md:max-w-sm md:px-0">
          <h1 className="font-semibold text-3xl text-neutral-900 tracking-tighter">
            Copy paste component, <br />
            <span className="text-neutral-600">in seconds</span>
          </h1>
          <p className="mt-4 font-medium text-base text-neutral-500">
            A simple and easy way to copy paste components from the web.
          </p>

          <div className="mt-8">
            <button
              aria-label="Sign in with Google"
              className="inline-flex h-12 w-full items-center justify-center gap-3 rounded-xl bg-white px-5 py-3 font-medium duration-200 hover:bg-white/50 focus:ring-2 focus:ring-amber-500 focus:ring-offset-2"
              type="button"
            >
              <GoogleIcon className="size-6" />
              <span>Sign in with Google</span>
            </button>
            <div className="relative py-3">
              <div className="relative flex justify-center">
                <span className="before:-translate-y-1/2 after:-translate-y-1/2 px-2 text-neutral-500 text-sm before:absolute before:top-1/2 before:left-0 before:h-px before:w-4/12 after:absolute after:top-1/2 after:right-0 after:h-px after:w-4/12 sm:after:bg-neutral-300 sm:before:bg-neutral-300">
                  Or continue with
                </span>
              </div>
            </div>
          </div>
          <form>
            <div className="space-y-3">
              <div>
                <label
                  className="mb-3 block font-medium text-black text-sm"
                  htmlFor="name"
                >
                  First name
                </label>
                <input
                  className="block h-12 w-full appearance-none rounded-xl bg-white px-4 py-2 text-amber-500 placeholder-neutral-300 duration-200 focus:outline-none focus:ring-neutral-300 sm:text-sm"
                  id="name"
                  placeholder="Your name"
                  type="text"
                />
              </div>
              <div className="col-span-full">
                <label
                  className="mb-3 block font-medium text-black text-sm"
                  htmlFor="password"
                >
                  Password
                </label>
                <input
                  className="block h-12 w-full appearance-none rounded-xl bg-white px-4 py-2 text-amber-500 placeholder-neutral-300 duration-200 focus:outline-none focus:ring-neutral-300 sm:text-sm"
                  id="password"
                  placeholder="Type password here..."
                  type="password"
                />
              </div>
              <div className="col-span-full">
                <button
                  className="inline-flex h-12 w-full items-center justify-center gap-3 rounded-xl bg-neutral-900 px-5 py-3 font-medium text-white duration-200 hover:bg-neutral-700 focus:ring-2 focus:ring-black focus:ring-offset-2"
                  type="submit"
                >
                  Sign in
                </button>
              </div>
            </div>
            <div className="mt-6">
              <p className="mx-auto flex text-center font-medium text-black text-sm leading-tight">
                Not have a password?
                <a
                  className="ml-auto text-amber-500 hover:text-black"
                  href="/forms/signup"
                >
                  Sign up now
                </a>
              </p>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}
