import Link from 'next/link';
import { ModeToggle } from "@/components/mode-toggle"
import { Logo } from "@/components/logo"
import SocialLinks from '@/components/social-links';
// import AuthButton from '@/components/AuthButton';


export default function Header() {
  return (
    <header className="z-50 bg-white/20 backdrop-blur-md dark:bg-gray-900/50 fixed top-0 left-0 right-0">
      <div className="max-w-screen-xl flex items-center justify-between mx-auto p-4">
        <Logo />
        <nav className="mr-10 font-medium space-x-6 flex flex-row">
          {/* {allPages.map((page) => ( ))} */}
          <SocialLinks />
          {/* <Link className="block py-2 px-3 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent" href={'/songs'}>
            Songs
          </Link>
          <Link className="block py-2 px-3 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent" href={'/about'}>
            Blog
          </Link> */}
          <Link className="hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent pt-1" href={'/collab'}>
            Collab
          </Link>
          <Link className="hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent pt-1" href={'/about'}>
            About
          </Link>
          <ModeToggle />
          {/* <AuthButton /> */}
        </nav>
      </div>

    </header>
  )
}