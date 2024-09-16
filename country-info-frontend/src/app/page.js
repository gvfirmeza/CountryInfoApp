import Link from 'next/link';

export default async function Home() {
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

  const res = await fetch(`${backendUrl}/api/countries`);

  if (!res.ok) {
    console.error("Error fetching countries:", res.status);
    throw new Error("Error fetching countries.");
  }

  const countries = await res.json();

  return (
    <div>
      <h1 className="text-5xl font-bold text-center m-5">Country List</h1>
      <h2 className="text-xl font-semibold mt-4 mb-8 text-center">Select a Country to Get more Info</h2>
      <ul className="country-list">
        {countries.map((country) => (
          <li className="list-item" key={country.countryCode}>
            <Link href={`/country/${country.countryCode}`}>
              <span className="list-text">{country.name}</span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}