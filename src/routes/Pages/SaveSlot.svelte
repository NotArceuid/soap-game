<script lang="ts">
	import { slide } from "svelte/transition";
	import { CollapsibleCard } from "svelte5-collapsible";
	import { SaveSystem } from "../../Game/Saves";
	import { _ } from "svelte-i18n";

	let { saveStatus = $bindable() } = $props();
	let isOpen = $state(false);
	function slidedown() {
		isOpen = !isOpen;
	}

	let text = $state("");
	async function load() {
		try {
			if (text) {
				const success = await SaveSystem.importFromString(text);
				saveStatus = success
					? $_("settings.saves.loadsave")
					: $_("settings.saves.savefailed");
			} else {
				saveStatus = $_("settings.saves.emptyclipboard");
			}
			setTimeout(() => (saveStatus = ""), 2000);
		} catch {}

		function loadFromFile(event: Event) {
			const input = event.target as HTMLInputElement;
			const file = input.files?.[0];
			if (!file) return;

			const reader = new FileReader();
			reader.onload = async (e) => {
				try {
					const content = e.target?.result as string;
					if (content) {
						const success = await SaveSystem.importFromString(content);
						saveStatus = success
							? $_("settings.saves.loadsave")
							: $_("settings.saves.loadfailed");
					}
				} catch {
					saveStatus = $_("settings.saves.loadfailed");
				}
				setTimeout(() => (saveStatus = ""), 2000);
			};
			reader.readAsText(file);
			input.value = "";
		}
	}
</script>

<div class="border p-2">
	<div>
		<h1 class="text-left">Save Slot 1</h1>
	</div>
	<div class="flex flex-row space-x-2">
		<button class="w-full">Save</button>
		<button class="w-full">Load</button>
		<button class="w-full" onclick={slidedown}>Edit</button>
	</div>
	<CollapsibleCard transition={{ transition: slide }} {isOpen}>
		{#snippet header()}
			<br />
		{/snippet}
		{#snippet body()}
			<div class="flex flex-row">
				<input
					type="text"
					bind:value={text}
					class="border h-6 w-10/12"
					placeholder="Paste your save here"
				/>
				<button
					class="h-6 w-2/12"
					onclick={load}
					style="padding: 0px; padding-left: 5px; padding-right: 5px;"
					>Load
				</button>
			</div>
			<div class="flex flex-row">
				<input type="file" value="save" class="w-10/12 h-6 border" />
			</div>
		{/snippet}
	</CollapsibleCard>
</div>
