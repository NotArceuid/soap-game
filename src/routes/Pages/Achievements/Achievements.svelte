<script>
	import { AchievementsData } from "../../../Game/Achievements/Achievements.svelte";
	import AchievementsCard from "./AchievementsCard.svelte";
</script>

<div class="absolute m-2 overflow-scroll h-full">
	<div class="flex flex-wrap items-center content-center">
		{#each AchievementsData as achievement}
			<AchievementsCard achievement={achievement[1]} idx={achievement[0]} />
		{/each}
	</div>
</div>
