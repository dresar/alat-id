export default function Footer() {
  return (
    <footer className="border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-center md:text-left">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              © {new Date().getFullYear()} Alat.id - Free Online Tools
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-500 mt-1">
              Dibuat oleh <span className="font-semibold text-gray-700 dark:text-gray-300">Eka Syarif Maulana</span>
            </p>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Built with Next.js, TypeScript, and Tailwind CSS
          </p>
        </div>
      </div>
    </footer>
  )
}

