import Link from 'next/link'

export default function Home() {
  return (
    <>
      <div>main</div>
      <Link href={'/login'}>Login</Link>
    </>
  )
}
