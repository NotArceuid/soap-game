<script>
	import { AchievementsData } from "../../../Game/Achievements/Achievements.svelte";
	import { OfflineProps } from "../../../Game/Game.svelte";
	import AchievementsCard from "./AchievementsCard.svelte";
</script>

<div
	class="absolute m-2 overflow-scroll h-full {OfflineProps.calculating
		? 'invisible'
		: 'visible'}"
>
	<div class="flex flex-wrap items-center content-center">
		{#each Object.entries(AchievementsData) as achievement}
			<AchievementsCard idx={parseInt(achievement[0])} />
		{/each}
	</div>
</div>
