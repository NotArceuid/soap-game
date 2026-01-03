<script lang="ts">
	import type { IAchievement } from "../../../Game/Achievements/Achievements.svelte";

	let { idx, achievement }: { idx: number; achievement: IAchievement } =
		$props();
	let unlocked = $derived(achievement.unlocked ? "bg-green-100/10" : "");
</script>

<div class="border {unlocked} m-2 p-2 min-w-xs min-h-24 max-w-xs">
	<div class="flex flex-row">
		<h1 class="border-b w-full">{achievement.name}</h1>
		<h1>#{idx}</h1>
	</div>
	<h1>{achievement.description}</h1>
</div>
