import { Player } from "./match";

export enum Side {
	Attacking = "Attacking",
	Defending = "Defending",
	All = "All"
}

export interface Filter {
	roundTimeRange: number[];
	minRoundNumber: number;
	maxRoundNumber: number;
	side: Side;
	players: Player[];
	hasPlanted?: boolean;
}