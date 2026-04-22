import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "ระบบลงทะเบียนผู้รับเหมา | Fuji Seal Packaging (Thailand)",
  description: "ระบบลงทะเบียนผู้รับเหมาก่อนเข้าปฏิบัติงานในพื้นที่บริษัท",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="th">
      <body className={`${inter.className} bg-slate-50 min-h-screen flex flex-col`}>
        <header className="bg-emerald-700 text-white shadow-md">
          <div className="container mx-auto px-4 py-4 flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="bg-white p-1 rounded-sm">
                {/* Placeholder for Logo, using simple text styled as logo if image not available */}
                <div className="text-emerald-800 font-bold text-xl px-2">FS</div>
              </div>
              <h1 className="text-xl font-semibold tracking-wide">
                Fuji Seal Packaging (Thailand) Co.,Ltd.
              </h1>
            </div>
            <nav className="flex items-center gap-2 text-sm font-medium w-full md:w-auto justify-center md:justify-end">
              <a href="/" className="bg-emerald-600/50 hover:bg-emerald-600 border border-emerald-500/30 transition px-4 py-2 rounded-md shadow-sm">
                📝 ลงทะเบียน (User)
              </a>
              <a href="/track" className="bg-emerald-700/60 hover:bg-emerald-600 border border-emerald-500/30 transition px-4 py-2 rounded-md shadow-sm">
                🔍 ติดตามสถานะ
              </a>
              <a href="/admin" className="bg-emerald-800/60 hover:bg-emerald-800 border border-emerald-900/30 transition px-4 py-2 rounded-md shadow-sm">
                ⚙️ ระบบจัดการ (Admin)
              </a>
            </nav>
          </div>
        </header>
        <main className="flex-grow container mx-auto px-4 py-8">
          {children}
        </main>
        <footer className="bg-slate-800 text-slate-400 py-6 text-center text-sm">
          <p>&copy; {new Date().getFullYear()} Fuji Seal Packaging (Thailand) Co.,Ltd. All rights reserved.</p>
        </footer>
      </body>
    </html>
  );
}
