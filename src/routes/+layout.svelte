<script lang="ts">
	import favicon from "$lib/assets/favicon.svg";
	import { getLocaleFromNavigator, init, waitLocale } from "svelte-i18n";
	import "../app.css";
	import { RegisterLocales } from "../Locales/i18n";
	import { onMount } from "svelte";
	import {
		CalculateOfflineTick,
		OfflineProps,
		RunOfflineCalculations,
	} from "../Game/Game.svelte";
	import { Settings } from "./Pages/Settings.svelte.ts";
	import { log } from "console";
	import { MainPageHandler, PagesEnum } from "./Pages/Pages.svelte.ts";
	let { children } = $props();

	RegisterLocales();
	init({
		initialLocale: getLocaleFromNavigator() || "en",
		fallbackLocale: "en",
	});

	waitLocale();
	onMount(() => {
		window.addEventListener("beforeunload", () => {
			//localStorage.setItem("savedate", new Date().getTime().toString());
		});
	});

	onMount(() => {
		let time = localStorage.getItem("savedate");
		if (time === "") return;

		let realTime = CalculateOfflineTick(new Date().getTime() - Number(time));
		RunOfflineCalculations(realTime);

		document.querySelectorAll("button").forEach((button) => {
			button.addEventListener("click", () => {
				const audio = new Audio("/click.wav");
				if (Settings.Sounds) audio.play();
			});
		});
	});
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

<div
	class="w-full h-full transition-colors duration-300 bg-bg text-font border-border"
>
	<main class="w-full h-full">
		{@render children?.()}
	</main>
</div>
