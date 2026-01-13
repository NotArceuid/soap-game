<script>
	import { Decimal } from "../../../Game/Shared/BreakInfinity/Decimal.svelte.ts";
	import { SoapType } from "../../../Game/Soap/Soap.svelte.ts";
	import {
		UpgradesData,
		UpgradesKey,
	} from "../../../Game/Soap/Upgrades.svelte.ts";
	import SoapProducer from "./SoapProducer.svelte";
	import { SoapProducers } from "./SoapProducer.svelte.ts";
</script>

<div class="absolute p-2">
	<div class="flex flex-wrap w-full space-x-6 spacey-6">
		<SoapProducer
			type={SoapType.Red}
			lockedText={"Rent a soap producer from yo unc"}
			canAutoSell={UpgradesData[UpgradesKey.RedSoapAutoSeller].count > 0}
			autoSellInterval={30 -
				3 * UpgradesData[UpgradesKey.RedSoapAutoSeller].count}
			autoSellBonus={UpgradesData[UpgradesKey.RedSoapAutoSellBonus].count - 1}
			canAutobuyQuality={UpgradesData[UpgradesKey.RedQualityAutobuy].count > 0}
			canAutobuySpeed={UpgradesData[UpgradesKey.RedSpeedAutobuy].count > 0}
			canAutoDeccelerate={false}
			canDeccelerate={SoapProducers[SoapType.Red].Speed.gt(30)}
			canEat={UpgradesData[UpgradesKey.EatRedSoapUpgrade].count > 0}
			autoEatInterval={0}
			canAutoEat={false}
			autoEatBonus={new Decimal(1)}
		/>

		<!-- 
		<SoapProducer
			type={SoapType.Orange}
			lockedText={"Meowoowwowwowow"}
			canAutoSell={UpgradesData[UpgradesKey.RedSoapAutoSeller].count > 0}
			autoSellInterval={30 -
				3 * UpgradesData[UpgradesKey.RedSoapAutoSeller].count}
			autoSellBonus={UpgradesData[UpgradesKey.RedSoapAutoSellBonus].count - 1}
			canAutobuyQuality={UpgradesData[UpgradesKey.RedQualityAutobuy].count > 0}
			canAutobuySpeed={UpgradesData[UpgradesKey.RedSpeedAutobuy].count > 0}
			canAutoDeccelerate={false}
			canDeccelerate={true}
			canEat={true}
			autoEatInterval={0}
			canAutoEat={false}
			autoEatBonus={new Decimal(1)}
		/>
-->
	</div>
</div>
