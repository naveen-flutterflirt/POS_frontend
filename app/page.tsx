import { redirect } from "next/navigation";
import Link from "next/link";

export default function RootPage() {
  return(
    <main>
      <div>
        <div><Link href="/admin/login">admin</Link></div>
        <div><Link href="/cashier/login">cashier</Link></div>
        <div><Link href="/inventory/login">inventory</Link></div>
      </div>
    </main>
  )
}
