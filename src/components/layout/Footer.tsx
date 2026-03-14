import { Logo } from "@/components/ui/logo";

export const Footer = () => {
  return (
    <footer className="border-t border-stone-800 bg-stone-950 px-6 py-12">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-center gap-6 md:flex-row">
        <div className="flex flex-col items-center gap-4 md:flex-row md:gap-8">
          <Logo className="opacity-40 transition-opacity hover:opacity-80" />
          <p className="text-xs text-stone-600">
            &copy; {new Date().getFullYear()} FicTalk. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};
