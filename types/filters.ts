import { DamageWeaponNameEnum, PlantSite, Player } from "./match";

export enum Side {
	Attacking = "Attacking",
	Defending = "Defending",
	All = "All"
}

export enum RoundOutcome {
	Win = "Win",
	Loss = "Loss",
	All = "All"
}

export enum KillType {
	Headshot = "Headshot",
	Bodyshot = "Bodyshot",
	All = "All"
}

export enum KillTime {
	FirstBlood = "FirstBlood",
	All = "All"
}

export enum TradedFilter {
	Traded = "Traded",
	NotTraded = "NotTraded",
	All = "All"
}

export enum Timing {
	Pre = "Pre",
	Post = "Post",
	All = "All"
}

export interface Filter {
	roundTimeRange: number[];
	minRoundNumber: number;
	maxRoundNumber: number;
	side: Side;
	players: Player[];
	roundOutcome: RoundOutcome;
	hasPlanted?: boolean;
	plantedAt: PlantSite;
	firstBlood: boolean;
	drawHeatmap: boolean;
	traded: TradedFilter;
	rounds: number[]; 
	timing: Timing;
	weapons: DamageWeaponNameEnum[]
}