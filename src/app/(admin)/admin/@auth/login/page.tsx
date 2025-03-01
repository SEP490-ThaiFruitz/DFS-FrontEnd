import { Logo } from "@/components/global-components/logo";
import { AdminFormLogin } from "@/features/admin/admin-auth/admin-form-login";

export default function AdminLogin() {
  return (
    <section className=" relative flex size-full max-h-full items-center justify-center bg-[url('https://images.unsplash.com/photo-1692606674482-effe67e384d9?q=80&w=3560&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')] bg-cover px-2 py-6 md:px-12 lg:justify-center lg:p-0 ">
      <div className="relative z-10 flex flex-1 flex-col rounded-3xl border-white/50 border-t bg-white/60 px-4 py-10 backdrop-blur-2xl sm:justify-center md:flex-none md:px-20  lg:border-t-0 lg:border-l lg:py-24">
        <div className="mx-auto w-full max-w-md sm:px-4 md:w-96 md:max-w-sm md:px-0">
          <div className="mb-10">
            <Logo
              width={200}
              height={100}
              classNameLabel="text-xl lg:text-5xl"
            />
          </div>
          <AdminFormLogin />
        </div>
      </div>
    </section>
  );
}