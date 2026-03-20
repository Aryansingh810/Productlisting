export default function Footer() {
  return (
    <footer className="mt-12 border-t border-white/10 bg-slate-950/40">
      <div className="mx-auto flex max-w-6xl flex-col gap-2 px-4 py-6 sm:flex-row sm:items-center sm:justify-between">
        <div className="text-sm text-white/70">
          ProductHub &copy; {new Date().getFullYear()}
        </div>
        <div className="text-sm text-white/70">
          <a className="hover:text-white" href="#">
            Privacy
          </a>{" "}
          |{" "}
          <a className="hover:text-white" href="#">
            Terms
          </a>{" "}
          |{" "}
          <a className="hover:text-white" href="#">
            Contact
          </a>
        </div>
      </div>
    </footer>
  );
}

