"use client";

export default function Footer() {
  return (
    <footer className="hidden md:flex flex-wrap gap-6 rounded-lg px-8 border-2 h-10 fixed bottom-0 right-10 bg-white">
      <a
        className="flex items-center gap-2 hover:underline hover:underline-offset-4"
        href="https://www.linkedin.com/in/brauliopf/"
        target="_blank"
        rel="noopener noreferrer"
      >
        <p>by @brauliopf</p>
      </a>
    </footer>
  );
}
