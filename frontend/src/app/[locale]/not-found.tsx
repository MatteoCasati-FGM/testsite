import Link from 'next/link';

export default function NotFound() {
  return (
    <section className="block" style={{ textAlign: 'center' }}>
      <h1>404</h1>
      <p>Pagina non trovata.</p>
      <Link className="btn" href="/">
        Torna alla home
      </Link>
    </section>
  );
}
