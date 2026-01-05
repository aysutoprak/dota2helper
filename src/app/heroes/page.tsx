'use client';
import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function Heroes() {
	type Hero = {
		id: number;
		name: string;
		localized_name: string;
		primary_attr?: string;
		attack_type?: string;
		roles?: string[];
	};

	const [heroes, setHeroes] = useState<Hero[]>([]);

	async function fetchHeroes() {
		try {
			const res = await fetch('https://api.opendota.com/api/heroes');
			if (!res.ok) throw new Error('Network response was not ok');
			const data: Hero[] = await res.json();
			setHeroes(data);
		} catch (err) {
			console.error('Failed to fetch heroes', err);
		}
	}

	useEffect(() => {
		fetchHeroes();
	}, []);

	const getSlug = (hero: Hero) =>
		hero.name.replace(/^npc_dota_hero_/, '').toLowerCase();

	return (
		<div className="w-full max-w-full h-screen grid grid-rows-[8rem_1fr]">
			<p className="mb-5 mx-auto text-[5rem]">Heroes Page</p>
			<div className="grid grid-cols-[repeat(auto-fill,minmax(200px,1fr))] gap-4 p-4">
				{heroes.map((hero) => {
					const slug = getSlug(hero);
					return (
						<Link
							href={`/heroes/${slug}`}
							key={hero.id}
							className={`rounded-lg p-6 text-center shadow ${
								hero.primary_attr === 'int'
									? 'bg-blue-300'
									: hero.primary_attr === 'str'
									? 'bg-red-300'
									: hero.primary_attr === 'agi'
									? 'bg-green-300'
									: 'bg-orange-300'
							}`}
						>
							{hero.localized_name}
						</Link>
					);
				})}
			</div>
		</div>
	);
}
