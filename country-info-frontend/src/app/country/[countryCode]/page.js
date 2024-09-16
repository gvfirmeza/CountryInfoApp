"use client";

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import dynamic from 'next/dynamic';

// Importação dos componentes e registro das escalas e elementos necessários do Chart.js
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

// Registrar os componentes necessários
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const Chart = dynamic(() =>
  import('react-chartjs-2').then((mod) => mod.Chart), { ssr: false }
);

export default function CountryInfo() {
  const { countryCode } = useParams();
  const [countryInfo, setCountryInfo] = useState(null);
  const [chartData, setChartData] = useState(null);

  useEffect(() => {
    if (!countryCode) return;

    async function fetchCountryInfo() {
      const countryInfoRes = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/country/${countryCode}`);
      const countryInfoData = await countryInfoRes.json();
      setCountryInfo(countryInfoData);

      const labels = countryInfoData.populationHistory.map((item) => item.year);
      const data = countryInfoData.populationHistory.map((item) => item.value);

      setChartData({
        labels,
        datasets: [
          {
            label: 'Population Over Time',
            data,
            fill: false,
            borderColor: 'rgb(75, 192, 192)',
            tension: 0.1,
          },
        ],
      });
    }

    fetchCountryInfo();
  }, [countryCode]);

  if (!countryInfo) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="info-div">
      <h1 className="country-name">{countryInfo.name}</h1>
      <img src={countryInfo.flagUrl} alt={`${countryInfo.name} Flag`} className="flag" />

      <h2 className="text-xl font-semibold mb-2">Border Countries</h2>
      <ul className="list-inside list-disc mb-4">
        {countryInfo.borders.map((borderCountry) => (
          <li key={borderCountry.countryCode}>
            <a href={`/country/${borderCountry.countryCode}`}>
              <span className="text-blue-500 hover:underline">{borderCountry.commonName}</span>
            </a>
          </li>
        ))}
      </ul>

      <h2 className="text-xl font-semibold mb-2">Population Chart</h2>

      <div className="w-full sm:w-[500px] md:w-[600px] lg:w-[800px]">
        {chartData && <Chart type="line" data={chartData} />}
      </div>
    </div>
  );
}