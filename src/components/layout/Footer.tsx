export function Footer() {
  return (
    <footer className="flex h-16 w-full items-center justify-center border-t text-sm text-gray-500">
      &copy; {new Date().getFullYear()} FicTalk. All rights reserved.
    </footer>
  );
}
