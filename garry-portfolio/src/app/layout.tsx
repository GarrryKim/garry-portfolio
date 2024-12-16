import type { Metadata } from 'next'
import '@/app/styles/global.scss'
import Navbar from './components/layout/Navbar/Navbar'
export const metadata: Metadata = {
  title: '김재훈의 포트폴리오',
  description: '프론트엔드 개발자 김재훈의 포트폴리오 페이지',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>
        <Navbar />
        {children}
      </body>
    </html>
  )
}
