import Footer from '@/components/footer/footer';
import Header from '@/components/header/header';

export default function ShellLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      <main>{children}</main>
      <Footer />
    </>
  );
}
