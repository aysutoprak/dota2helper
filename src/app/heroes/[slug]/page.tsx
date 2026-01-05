'use client';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';

type Hero = {
	id: number;
	name: string;
	localized_name: string;
	primary_attr?: string;
	attack_type?: string;
	roles?: string[];
};

// replace ItemPopularityRaw / ItemName / ItemPopularityMapped and items state
type ItemPopularityRaw = {
	start_game_items: Record<string, number>;
	early_game_items: Record<string, number>;
	mid_game_items: Record<string, number>;
	late_game_items: Record<string, number>;
};

type ItemNameCount = { id: number; dname: string; count: number };
type ItemPopularityMapped = {
	start_game_items: ItemNameCount[];
	early_game_items: ItemNameCount[];
	mid_game_items: ItemNameCount[];
	late_game_items: ItemNameCount[];
};

export default function HeroDetails() {
	const params = useParams();
	const slug = params?.slug;
	const targetName = `npc_dota_hero_${slug}`;

	const [hero, setHero] = useState<Hero | undefined>();
	const [items, setItems] = useState<ItemPopularityMapped | undefined>();
	const [loading, setLoading] = useState(false);

	// replace fetchPopularItems implementation
	async function fetchPopularItems(hero_id: number) {
		try {
			const [resPopularity, resConstants] = await Promise.all([
				fetch(`https://api.opendota.com/api/heroes/${hero_id}/itemPopularity`),
				fetch('https://api.opendota.com/api/constants/items'),
			]);

			if (!resPopularity.ok) throw new Error('Failed to fetch itemPopularity');
			if (!resConstants.ok) throw new Error('Failed to fetch item constants');

			const raw: ItemPopularityRaw = await resPopularity.json();
			const constants: Record<string, { id: number; dname?: string }> =
				await resConstants.json();

			const idToDname: Record<number, string> = {};
			for (const key in constants) {
				const it = constants[key];
				if (typeof it?.id === 'number')
					idToDname[it.id] = it.dname ?? 'Unknown';
			}

			const mapRecord = (
				rec: Record<string, number> | undefined
			): ItemNameCount[] =>
				Object.entries(rec || {})
					.map(([idStr, count]) => {
						const id = Number(idStr);
						return { id, dname: idToDname[id] ?? 'Unknown', count };
					})
					.sort((a, b) => b.count - a.count);

			const mapped: ItemPopularityMapped = {
				start_game_items: mapRecord(raw.start_game_items),
				early_game_items: mapRecord(raw.early_game_items),
				mid_game_items: mapRecord(raw.mid_game_items),
				late_game_items: mapRecord(raw.late_game_items),
			};

			setItems(mapped);
		} catch (err) {
			console.error('Failed to fetch items or constants', err);
		}
	}

	useEffect(() => {
		if (!slug) return;
		const load = async () => {
			setLoading(true);
			try {
				const res = await fetch('https://api.opendota.com/api/heroes');
				if (!res.ok) throw new Error('Network response was not ok');
				const heroes: Hero[] = await res.json();
				const found = heroes.find((h) => h.name === targetName);
				if (!found) {
					setHero(undefined);
					return;
				}
				setHero(found);
				await fetchPopularItems(found.id);
			} catch (err) {
				console.error('Failed to fetch heroes', err);
			} finally {
				setLoading(false);
			}
		};
		load();
	}, [slug]);

	if (!hero) return <div>Hero not found</div>;

	return (
		<div className="p-6">
			<h1 className="text-2xl mb-2">{hero.localized_name}</h1>
			<p>Roles: {(hero.roles || []).join(', ')}</p>

			{loading && <p>Loading items...</p>}

			{!loading && items ? (
				<div className="mt-4">
					<div className="grid grid-cols-[1fr_1fr_1fr_1fr] gap-3">
						<div className="">
							<p className="bg-blue-200/25">Start</p>
							<div className="grid max-h-20 gap-4">
								{items.start_game_items.map((i) => {
									return (
										<p key={i.id}>
											{i.dname} ({i.count})
										</p>
									);
								})}
							</div>
						</div>
						<div className="">
							<p className="bg-blue-200/50">Early</p>
							<div className="grid max-h-20 gap-4">
								{items.early_game_items.map((i) => {
									return (
										<p key={i.id}>
											{i.dname} ({i.count})
										</p>
									);
								})}
							</div>
						</div>
						<div className="">
							<p className="bg-blue-200/25">Mid</p>
							<div className="grid max-h-20 gap-4">
								{items.mid_game_items.map((i) => {
									return (
										<p key={i.id}>
											{i.dname} ({i.count})
										</p>
									);
								})}
							</div>
						</div>
						<div className="">
							<p className="bg-blue-200/50">Late</p>
							<div className="grid max-h-20 gap-4">
								{items.late_game_items.map((i) => {
									return (
										<p key={i.id}>
											{i.dname} ({i.count})
										</p>
									);
								})}
							</div>
						</div>
					</div>
				</div>
			) : (
				!loading && <p>No item popularity data available.</p>
			)}
		</div>
	);
}
