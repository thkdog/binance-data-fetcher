import { redirect } from 'next/navigation';

export default function HomeRedirect() {
  redirect('/spot-klines');
}
