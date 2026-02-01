'use client';
import { useRouter } from 'next/navigation';
import Antigravity from './components/antiGravity';
import Image from 'next/image';

export default function Home() {
	const router = useRouter();

	return (
		<div className="flex min-h-screen bg-zinc-50 font-sans dark:bg-black">
			<main
				onClick={() => router.push('./heroes')}
				className="flex min-h-screen w-full relative bg-white dark:bg-black cursor-pointer"
			>
				<img
					src="./dota2_bg.jpg"
					alt="dota 2 background"
					className="absolute z-0"
				></img>
				<Antigravity
					count={300}
					magnetRadius={6}
					ringRadius={14}
					waveSpeed={0.6}
					waveAmplitude={0.5}
					particleSize={0.5}
					lerpSpeed={0.02}
					color="#f1787b"
					autoAnimate
					particleVariance={1}
					rotationSpeed={0}
					depthFactor={0.6}
					pulseSpeed={3}
					particleShape="sphere"
					fieldStrength={10}
				/>
			</main>
		</div>
	);
}
