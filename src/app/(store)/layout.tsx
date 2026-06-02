import { AnnouncementBar } from '@/components/layout/AnnouncementBar'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { CartDrawer } from '@/components/store/CartDrawer'
import { MobileBottomNav } from '@/components/layout/MobileBottomNav'

export default function StoreLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <AnnouncementBar />
      <Navbar />
      <main className="pb-16 md:pb-0">{children}</main>
      <Footer />
      <CartDrawer />
      <MobileBottomNav />
    </>
  )
}
