import { Player } from "./match";

export enum Side {
	Attacking = "Attacking",
	Defending = "Defending",
	All = "All"
}

export interface Filter {
	minRoundTime: number;
	maxRoundTime: number;
	minRoundNumber: number;
	maxRoundNumber: number;
	side: Side;
	players: Player[];
	hasPlanted?: boolean;
}