'use client';
import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import rockTexture from '../../../public/rock-texture.jpg';

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
	const [selectedRoles, setSelectedRoles] = useState<string[]>([]);

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

	const roles = useMemo(() => {
		const s = new Set<string>();
		heroes.forEach((h) => h.roles?.forEach((r) => s.add(r)));
		return Array.from(s).sort();
	}, [heroes]);

	const toggleRole = (role: string) =>
		setSelectedRoles((prev) =>
			prev.includes(role) ? prev.filter((r) => r !== role) : [...prev, role],
		);

	const clearRoles = () => setSelectedRoles([]);

	const filteredHeroes = useMemo(() => {
		if (selectedRoles.length === 0) return heroes;
		return heroes.filter((h) =>
			// AND semantics: hero must include every selected role
			selectedRoles.every((role) => (h.roles || []).includes(role)),
		);
	}, [heroes, selectedRoles]);

	return (
		<div className="w-full max-w-full h-full grid grid-rows-[15rem_1fr] bg-linear-65 from-slate-950 to-rose-950">
			<div className="flex flex-col items-center gap-4 mb-4">
				<div
					className="w-full text-center bg-cover bg-bottom h-[140px]"
					style={{ backgroundImage: `url("rock-texture-v2.jpg")` }}
				>
					<p className="my-3 text-[5rem] font-optimus">Heroes Page</p>
				</div>
				<div className="flex items-center gap-7 flex-wrap">
					{roles.map((role) => {
						const checked = selectedRoles.includes(role);
						return (
							<label
								key={role}
								className="flex items-center gap-2 cursor-pointer hover:bg-gray-600/50 p-2 rounded-xl"
							>
								<input
									type="checkbox"
									checked={checked}
									onChange={() => toggleRole(role)}
									className="w-4 h-4 cursor-pointer"
								/>
								<span className="text-sm ">{role}</span>
							</label>
						);
					})}
				</div>
				<div>
					<button
						onClick={clearRoles}
						className="text-sm text-blue-600 underline cursor-pointer"
						disabled={selectedRoles.length === 0}
					>
						Clear filters
					</button>
				</div>
			</div>

			<div className="grid grid-cols-[repeat(auto-fill,minmax(200px,1fr))] max-h-20 gap-4 p-4">
				{filteredHeroes.map((hero) => {
					const slug = getSlug(hero);
					return (
						<Link
							href={`/heroes/${slug}`}
							key={hero.id}
							className={`cursor-pointer rounded-lg p-6 text-center font-bold shadow ${
								hero.primary_attr === 'int'
									? 'bg-blue-300/50'
									: hero.primary_attr === 'str'
										? 'bg-red-300/50'
										: hero.primary_attr === 'agi'
											? 'bg-green-300/50'
											: 'bg-orange-300/50'
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
