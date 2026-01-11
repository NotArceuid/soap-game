<script lang="ts">
	import { UpgradesData } from "../../../Game/Soap/Upgrades.svelte";
	import type { IUpgradesInfo } from "../../Components/UpgradesInfo.svelte.ts";
	import UpgradesInfo from "../../Components/UpgradesInfo.svelte";
	import { DevHacks } from "../../../Game/Game.svelte.ts";
	import ActionButton from "../../Components/ActionButton.svelte";
	import { log } from "console";

	let currUpgrade = $state<IUpgradesInfo>();
	let showMaxxedUpgrades = $state(false);
</script>

<div class="absolute pr-4 w-full flex flex-col h-9/12">
	<div class="flex flex-row ml-auto">
		<label for="checkbox" class="mr-2"> Show Max Upgrades</label>
		<input type="checkbox" bind:checked={showMaxxedUpgrades} />
	</div>
	<div class="flex flex-wrap">
		{#each Object.entries(UpgradesData) as upgrade}
			{#if (upgrade[1].ShowCondition() && (showMaxxedUpgrades || upgrade[1].count < upgrade[1].maxCount)) || DevHacks.skipUnlock}
				<ActionButton
					buttonClass="w-64 h-12 shrink-0 m-2"
					disabled={!upgrade[1].Requirements[1]()}
					onclick={() => (currUpgrade = upgrade[1])}
				>
					{#snippet content()}
						<span>
							{upgrade[1].name} ({upgrade[1].count}/{upgrade[1].maxCount})
						</span>
					{/snippet}
				</ActionButton>
			{/if}
		{/each}
	</div>
	<!-- Bottom frag -->
	<div class="mt-auto">
		<UpgradesInfo upgrade={currUpgrade} />
	</div>
</div>
