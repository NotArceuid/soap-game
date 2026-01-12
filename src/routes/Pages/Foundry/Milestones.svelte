<script lang="ts">
	import { onMount } from "svelte";
	import { Player } from "../../../Game/Player.svelte";
	import { SaveSystem } from "../../../Game/Saves";
	import { PageHandler } from "../Pages";
	import { DevHacks } from "../../../Game/Game.svelte";

	interface MilestoneSaves {
		ticketunlocked: boolean;
		chargeunlocked: boolean;
		assemblerunlocked: boolean;
	}

	let ticketUnlocked = $state(false);
	let chargeunlocked = $state(false);
	let assemblerunlocked = $state(false);
	let saveKey = "milestones";
	SaveSystem.SaveCallback<MilestoneSaves>(saveKey, () => {
		return {
			ticketunlocked: ticketUnlocked,
			chargeunlocked: chargeunlocked,
			assemblerunlocked: assemblerunlocked,
		};
	});

	SaveSystem.LoadCallback<MilestoneSaves>(saveKey, (data) => {
		ticketUnlocked = data.ticketunlocked;
		chargeunlocked = data.chargeunlocked;
		assemblerunlocked = data.assemblerunlocked;
	});

	let pageHandler = new PageHandler(false);
	onMount(() => {
		let elements = document.getElementById("foundry-milestones")?.children;

		if (elements) {
			pageHandler.RegisterPages(0, elements[0] as HTMLElement);
			pageHandler.RegisterPages(1, elements[1] as HTMLElement);
			pageHandler.RegisterPages(2, elements[2] as HTMLElement);
		}
	});

	$effect(() => {
		if (Player.Charge.gt(0)) chargeunlocked = true;
	});
</script>

<h1 class="p-2 font-bold border-b">Milestones</h1>
<div class="p-1 w-full h-11">
	<div class="flex flex-row">
		{#if ticketUnlocked || DevHacks.skipUnlock}
			<button class="grow">Ticket</button>
		{/if}
		{#if chargeunlocked || DevHacks.skipUnlock}
			<button class="grow">Charge</button>
		{/if}
		{#if chargeunlocked || DevHacks.skipUnlock}
			<button class="grow">Assembler</button>
		{/if}
	</div>

	<div id="foundry-milestones">
		<div><h1>Charge</h1></div>
		<div><h1>Ticket</h1></div>
		<div><h1>Assembler</h1></div>
	</div>
</div>
