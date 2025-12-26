import { getCountryData } from '@/lib/country-service';
import CountryDetails from '@/components/features/CountryDetails';
import { Metadata } from 'next';
import Link from 'next/link';

type Props = {
    params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { slug } = await params;
    const country = await getCountryData(slug);
    if (!country) return { title: 'Country Not Found' };

    return {
        title: country.name,
        description: country.overview,
        openGraph: {
            title: `${country.name} | Travellum`,
            description: country.overview,
            images: [{ url: '/icon.png' }],
        }
    }
}

export default async function Page({ params }: Props) {
    const { slug } = await params;
    const country = await getCountryData(slug);

    if (!country) {
        return (
            <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center">
                <h1 className="text-3xl font-bold text-red-500 mb-4">Are you sure that exists?</h1>
                <p className="text-gray-400 mb-8">Could not generate data for {slug}</p>
                <Link href="/dashboard" className="px-6 py-3 bg-white/10 rounded-full hover:bg-white/20 transition">Go Back</Link>
            </div>
        );
    }

    const plainCountry = JSON.parse(JSON.stringify(country));

    return <CountryDetails initialData={plainCountry} slug={slug} />
}
