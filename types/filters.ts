import { PlantSite, Player } from "./match";

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

export interface Filter {
	roundTimeRange: number[];
	minRoundNumber: number;
	maxRoundNumber: number;
	side: Side;
	players: Player[];
	roundOutcome: RoundOutcome;
	hasPlanted?: boolean;
	PlantSite: PlantSite;
}