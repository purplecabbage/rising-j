"use client"

import { usePathname } from "next/navigation"
import ConvertkitSignupForm from "@/components/ConvertkitSignupForm"
import Footer from "@/components/footer"

export default function PublicFooter() {
  const pathname = usePathname()
  const isAdmin = pathname.startsWith("/admin") || pathname.startsWith("/auth")
  const isCollab = pathname.startsWith("/collab")

  if (isAdmin) return null

  if (isCollab) return <Footer />

  return (
    <>
      <div className='bg-indigo-200 dark:bg-indigo-950 min-w-full mt-20 px-5 sm:px-20'>
        <ConvertkitSignupForm formId="" />
      </div>
      <Footer />
    </>
  )
}
