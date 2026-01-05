type Hero = {
	id: number;
	name: string;
	localized_name: string;
	primary_attr?: string;
	attack_type?: string;
	roles?: string[];
};

type Item = {
	start_game_items: number;
	early_game_items: string;
	mid_game_items: string;
	late_game_items: string;
};

export default async function HeroDetails({
	params,
}: {
	params: { slug: string };
}) {
	const { slug } = await params;
	const targetName = `${slug}`;

	const res = await fetch('https://api.opendota.com/api/heroes');
	if (!res.ok) throw new Error('Failed to fetch hero data');
	const heroes: Hero[] = await res.json();
	const hero = heroes.find((h) => h.localized_name === targetName);

	if (!hero) {
		return <div>Hero not found</div>;
	}

	return (
		<div className="p-6">
			<h1 className="text-2xl mb-2">{hero.localized_name}</h1>
			<p>Roles: {(hero.roles || []).join(', ')}</p>
		</div>
	);
}
