<script lang="ts">
	import { Soaps, type SoapType } from "../../../Game/Soap/Soap.svelte.ts";
	import { DevHacks, Update } from "../../../Game/Game.svelte";
	import { Player } from "../../../Game/Player.svelte";
	import { SoapProducers } from "./SoapProducer.svelte.ts";
	import { CollapsibleCard } from "svelte5-collapsible";
	import { slide } from "svelte/transition";
	import { SaveSystem } from "../../../Game/Saves.ts";
	import {
		UpgradesData,
		UpgradesKey,
	} from "../../../Game/Soap/Upgrades.svelte.ts";
	import { Decimal } from "../../../Game/Shared/BreakInfinity/Decimal.svelte.ts";
	import { log } from "console";
	import ActionButton from "../../Components/ActionButton.svelte";

	let { type }: { type: SoapType } = $props();
	let producer = $derived(SoapProducers[type]);
	let soap = $derived(Soaps[type]!);

	const speedCostAmt = $derived(
		Math.min(
			Player.BulkAmount,
			producer.SpeedFormula.BuyMax(Player.Money, producer.SpeedCount),
		),
	);
	const qualityCostAmt = $derived(
		Math.min(
			Player.BulkAmount,
			producer.QualityFormula.BuyMax(Player.Money, producer.QualityCount),
		),
	);

	let amount = $derived(Decimal.min(Player.BulkAmount, soap.Amount));

	function Sell(): void {
		if (soap.CanSell(amount)) {
			soap.Sell(amount);
		}
	}

	function Offer(): void {}
	function Accelerate(): void {
		producer.DecelerateCount = Math.max(producer.DecelerateCount - 1, 0);
	}
	let counter = $state(0);
	let autosellCap = $derived(
		30 - 3 * UpgradesData[UpgradesKey.RedSoapAutoSeller].count,
	);

	const autobuyTick = 5;
	let qualityAutoBuyCount = $state(0);
	let qualityAutobuy = $state(true);
	let speedAutoBuyCount = $state(0);
	let speedAutobuy = $state(true);
	Update.add(() => {
		if (
			qualityAutoBuyCount < autobuyTick &&
			UpgradesData[UpgradesKey.RedQualityAutobuy].count > 0 &&
			qualityAutobuy
		) {
			qualityAutoBuyCount++;
		}

		if (qualityAutoBuyCount >= autobuyTick) {
			qualityAutoBuyCount = 0;
			producer.UpgradeQuality(qualityCostAmt);
		}
	});

	Update.add(() => {
		if (
			speedAutoBuyCount < autobuyTick &&
			UpgradesData[UpgradesKey.RedSpeedAutobuy].count > 0 &&
			speedAutobuy
		) {
			speedAutoBuyCount++;
		}

		if (speedAutoBuyCount >= autobuyTick) {
			speedAutoBuyCount = 0;
			producer.UpgradeSpeed(speedCostAmt);
		}
	});

	Update.add(() => {
		if (producer.Unlocked) {
			producer.AddProgress();
		}

		if (UpgradesData[UpgradesKey.RedSoapAutoSeller].count == 0) return;

		if (counter < autosellCap) {
			counter++;
		}

		if (counter >= autosellCap) {
			let sellPercentage =
				UpgradesData[UpgradesKey.RedSoapAutoSellBonus].count + 1;
			let sellAmount = soap.Amount.mul(sellPercentage).div(100);

			let reductionPercentage =
				UpgradesData[UpgradesKey.RedSoapAutoSellCostRed].count;
			let reductionAmount = sellAmount.mul(reductionPercentage).div(100);

			soap.Sell(sellAmount, reductionAmount);
			counter = 0;
		}
	});

	let eatenUnlocked = $state(false);
	let decelerateUnlocked = $state(false);
	$effect(() => {
		if (UpgradesData[UpgradesKey.EatRedSoapUpgrade].count > 0)
			eatenUnlocked = true;
		if (producer.Speed.gt(30)) decelerateUnlocked = true;
	});

	interface SoapProducerSave {
		eaten: boolean;
		decelerate: boolean;
	}

	// svelte-ignore state_referenced_locally
	let saveKey = `${type} producer`;
	// svelte-ignore state_referenced_locally
	SaveSystem.SaveCallback<SoapProducerSave>(saveKey, () => {
		return {
			eaten: eatenUnlocked,
			decelerate: decelerateUnlocked,
		};
	});

	// svelte-ignore state_referenced_locally
	SaveSystem.LoadCallback<SoapProducerSave>(saveKey, (data) => {
		eatenUnlocked = data.eaten;
		decelerateUnlocked = data.decelerate;
	});
</script>

<div class="border p-2">
	{#if producer.Unlocked}
		<div class="flex flex-row">
			<div class="flex flex-col">
				<div class="mb-3 w-full h-full flex flex-col relative">
					<div class="flex flex-row">
						<h1 class="mr-auto">Red Soap ({soap.Amount.format()}x)</h1>
						<h1 class="ml-auto">
							({producer.Progress.format()} /
							{producer.MaxProgress.format()})
						</h1>
					</div>
					<div class="h-2">
						<div
							class="bg-blue-300 absolute h-2"
							style="width: {producer.Progress.div(producer.MaxProgress).mul(
								100,
							)}%"
						></div>
						<div class="border w-full h-full z-10"></div>
					</div>
				</div>

				<div class="grid grid-cols-2 gap-1">
					<div class="flex flex-col">
						<ActionButton
							onclick={() => producer.UpgradeQuality(qualityCostAmt)}
							disabled={producer
								.GetQualityCost(qualityCostAmt)
								.gt(Player.Money)}
						>
							{#snippet content()}
								Upgrade Quality +{qualityCostAmt}
								<div>
									({producer.QualityCount}) Cost: ${producer
										.GetQualityCost(qualityCostAmt)
										.format()}
								</div>
							{/snippet}
						</ActionButton>

						{#if UpgradesData[UpgradesKey.RedQualityAutobuy].count > 0 || DevHacks.skipUnlock}
							<!-- Had to use style for padding because tailwinds padding doesnt work here bruvh-->
							<ActionButton
								onclick={() => (qualityAutobuy = !qualityAutobuy)}
								disabled={qualityAutobuy}
								customStyle="padding-bottom: 0px; padding-top: 0px;"
							>
								{#snippet content()}
									<span class="text-xs font-semibold">
										Autobuy: {qualityAutobuy ? "on" : "off"}
									</span>
								{/snippet}
							</ActionButton>
						{/if}
					</div>

					<div class="flex flex-col">
						<ActionButton
							disabled={producer.GetSpeedCost(speedCostAmt).gt(Player.Money)}
							onclick={() => {
								producer.UpgradeSpeed(speedCostAmt);
							}}
						>
							{#snippet content()}
								Upgrade Speed +{speedCostAmt}
								<div>
									({producer.SpeedCount}) Cost: ${producer
										.GetSpeedCost(speedCostAmt)
										.format()}
								</div>
							{/snippet}
						</ActionButton>

						{#if UpgradesData[UpgradesKey.RedSpeedAutobuy].count > 0 || DevHacks.skipUnlock}
							<ActionButton
								onclick={() => (speedAutobuy = !speedAutobuy)}
								disabled={speedAutobuy}
								customStyle="padding-bottom: 0px; padding-top: 0px;"
							>
								{#snippet content()}
									<span class="font-semibold text-xs">
										Autobuy: {speedAutobuy ? "on" : "off"}
									</span>
								{/snippet}
							</ActionButton>
						{/if}
					</div>

					{#if decelerateUnlocked || DevHacks.skipUnlock}
						<ActionButton
							onclick={() => producer.Decelerate()}
							disabled={producer.Speed.lte(producer.DecelerateReq)}
						>
							{#snippet content()}
								Deccelerate ({producer.DecelerateCount})
								<div>
									({producer.Speed.format()}/ {producer.DecelerateReq.format()})
								</div>
							{/snippet}
						</ActionButton>
					{/if}
					{#if eatenUnlocked || DevHacks.skipUnlock}
						<ActionButton
							onclick={() => producer.Eat()}
							disabled={producer.ProducedAmount.lt(producer.EatReq)}
						>
							{#snippet content()}
								Eat Soap <div>
									({soap?.ProducedAmount.format()}/ {producer.EatReq.format()})
								</div>
							{/snippet}
						</ActionButton>
					{/if}
				</div>
			</div>
			<div class="ml-2 pl-2 border-l">
				<div class="flex flex-col h-full">
					<h1 class="text-center underline mb-2">Actions</h1>
					<div class="flex flex-col">
						<ActionButton
							disabled={soap.Amount.lte(amount) && soap.Amount.lt(0)}
							onclick={Sell}
						>
							{#snippet content()}
								Sell {amount.format()}x
							{/snippet}
						</ActionButton>

						{#if UpgradesData[UpgradesKey.CatPrestige].count > 0 || DevHacks.skipUnlock}
							<ActionButton
								disabled={soap.Amount.gte(amount) && soap.Amount.gt(0)}
								onclick={Sell}
							>
								{#snippet content()}
									Offer: {amount.format()}x
								{/snippet}
							</ActionButton>
						{/if}

						{#if producer.DecelerateCount > 0}
							<ActionButton
								disabled={producer.DecelerateCount <= 1}
								onclick={Accelerate}
							>
								{#snippet content()}
									Accelerate
								{/snippet}
							</ActionButton>
						{/if}
					</div>
				</div>
			</div>
		</div>
		<CollapsibleCard transition={{ transition: slide }} isOpen={true}>
			{#snippet header()}
				<div class="h-2 flex flex-row hover:cursor-pointer"></div>
			{/snippet}

			{#snippet body()}
				<div class="flex flex-row">
					<h1>
						Total: {producer.ProducedAmount.format()}
					</h1>
					<h1 class="ml-auto">Quality: {producer.Quality.format()}</h1>
					<h1 class="ml-auto">Speed: {producer.Speed.format()}</h1>
				</div>
				{#if eatenUnlocked || DevHacks.skipUnlock}
					<div class="flex flex-row">
						<h1>
							Eaten: {producer.EatAmount.format()}
						</h1>
						<h1 class="ml-auto">
							{producer.EatMessage()}
						</h1>
					</div>
				{/if}
			{/snippet}
		</CollapsibleCard>
	{:else}
		<div class="flex flex-row">
			<ActionButton
				onclick={() => {
					producer.Unlocked = true;
				}}
				disabled={false}
			>
				{#snippet content()}
					Unlock Soap Producer?
				{/snippet}
			</ActionButton>
		</div>
	{/if}
</div>
