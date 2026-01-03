<script lang="ts">
	import {
		AchievementKey,
		InvokeAchievement,
	} from "../../../Game/Achievements/Achievements.svelte";
</script>

<div class="absolute m-2">
	<button
		onclick={() => {
			InvokeAchievement(AchievementKey.Cat);
		}}>This is a cat</button
	>
	<h1>OIIAI</h1>
</div>
