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
	<div class="flex flex-wrap flex-row gap-2 mb-2">
		<button class="flex-1">Save</button>
		<button class="flex-1" onclick={slidedown}>Load</button>
	</div>
	<CollapsibleCard transition={{ transition: slide }} {isOpen}>
		{#snippet header()}
			<div class="h-2"></div>
		{/snippet}
		{#snippet body()}
			<div class="space-y-2">
				<div class="flex items-center gap-2">
					<input
						type="text"
						bind:value={text}
						class="border h-8 grow px-2"
						placeholder="Paste your save here"
					/>
					<button class="h-8 px-4 whitespace-nowrap" onclick={load}
						>Load
					</button>
				</div>
				<div class="flex items-center">
					<input type="file" value="save" class="w-full h-8 border px-2" />
				</div>
			</div>
		{/snippet}
	</CollapsibleCard>
</div>
