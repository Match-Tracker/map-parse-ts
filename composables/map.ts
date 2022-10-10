import { AgentID, Round, Team, type Kill, type MapInfo, type Match, type Player, type PlayerLocationsOn, PlantSite, Blue } from './../types/match';

import * as MapData from '../types/maps.json';
import { Filter, RoundOutcome, Side } from '~~/types/filters';
import Heatmap from './heatmap';
import { Console } from 'console';

interface ImageCache { [key: string]: HTMLImageElement; }
class Map {
	map: string;
	canvas: HTMLCanvasElement;
	ctx: CanvasRenderingContext2D;
	match: Match;
	info: MapInfo | null;
	imageCache: ImageCache;
	images: string[];
	isReady: boolean;

	minTime: number;
	maxTime: number;

	mode: string;

	heatmap: Heatmap;

	constructor(match: Match, canvas: HTMLCanvasElement) {
		this.isReady = false;
		this.match = match;
		this.canvas = canvas;
		this.map = match.metadata.map;
		this.info = null;
		this.ctx = canvas.getContext('2d')!;

		this.imageCache = {};
		this.images = [
			'/img/maps/ascent.png',
			'/img/maps/bind.png',
			'/img/maps/breeze.png',
			'/img/maps/haven.png',
			'/img/maps/icebox.png',
			'/img/maps/split.png',
			'/img/maps/fracture.png',
			'/img/maps/pearl.png',
			'/img/agents/astra.png',
			'/img/agents/breach.png',
			'/img/agents/brimstone.png',
			'/img/agents/cypher.png',
			'/img/agents/jett.png',
			'/img/agents/omen.png',
			'/img/agents/phoenix.png',
			'/img/agents/raze.png',
			'/img/agents/reyna.png',
			'/img/agents/sage.png',
			'/img/agents/skye.png',
			'/img/agents/sova.png',
			'/img/agents/viper.png',
			'/img/agents/yoru.png',
			'/img/agents/killjoy.png',
			'/img/agents/fade.png',
			'/img/agents/neon.png',
			'/img/agents/chamber.png',
			'/img/agents/kayo.png',
			'/img/assets/spike-red.png',
			'/img/assets/spike-blue.png',
		];

		/* Filters */
		this.minTime = 0;
		this.maxTime = 300;

		this.mode = 'movement';

		this.heatmap = new Heatmap();

		Promise.all(this.loadImages()).then(() => {
			this.fetchMapInfo();
			this.setupCanvas();

			this.ctx.drawImage(this.imageCache[this.map.toLowerCase()], 0, 0);

			this.isReady = true;

			this.update({ roundTimeRange: [0, 150] as number[], minRoundNumber: 0 as number, maxRoundNumber: 30 as number, side: Side.All as Side, players: this.match.players.all_players as Player[], roundOutcome: RoundOutcome.All as RoundOutcome, hasPlanted: undefined as boolean, plantedAt: PlantSite.All as PlantSite, firstBlood: false as boolean, drawHeatmap: false as boolean });
		});
	}

	setupCanvas() {
		this.canvas.width = 1024;
		this.canvas.height = 1024;
	}

	clearCanvas() {
		// Clear all drawings except the map
		this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
		this.ctx.drawImage(this.imageCache[this.map.toLowerCase()], 0, 0);
	}

	loadImages() {
		return this.images.map((image) => {
			return new Promise<void>((resolve) => {
				const img = new Image();
				img.onload = () => {
					image = image.split('/')[image.split('/').length - 1];
					this.imageCache[image.split('.')[0]] = img;
					resolve();
				}
				img.src = new URL(image, import.meta.url).href;
			});
		})
	}

	fetchMapInfo() {
		// Fetch the map info from the API
		const info: MapInfo[] = JSON.parse(JSON.stringify(MapData)).default;

		this.info = info.find((map) => map.displayName === this.map) || null;
	}

	calculateLocation(game_x: number, game_y: number) {
		if (!this.info) return { x: 0, y: 0 };

		let x = game_y * this.info.xMultiplier + this.info.xScalarToAdd;
		let y = game_x * this.info.yMultiplier + this.info.yScalarToAdd;

		x *= this.canvas.width;
		y *= this.canvas.height;

		return { x, y };
	}

	calculateRadians(viewRadian: number) {
		return viewRadian - Math.PI / 2;
	}

	getPlayerFromPuuid(puuid: string) {
		return this.match.players.all_players.find((player) => player.puuid === puuid) || this.match.players.all_players[0];
	}

	fetchAgent(player: Player): string {
		const agentId: string = player.assets.agent.small.split('/')[4].toUpperCase() || '';

		return AgentID[agentId as keyof typeof AgentID] || 'unknown';
	}

	filterKills(kills: Kill[], filter: Filter) {
		return kills.filter((kill) => {
			return kill.kill_time_in_round / 1000 >= filter.roundTimeRange[0] &&
				kill.kill_time_in_round / 1000 <= filter.roundTimeRange[1]
		});
	}

	isSide(player: Player, side: Side, round: number) {
		if (side === Side.All) return true;

		const team: Team = player.team

		const isAttacking = round <= 11 && team === Team.Red || round > 11 && team === Team.Blue;

		return side === Side.Attacking && isAttacking || side === Side.Defending && !isAttacking;
	}

	isOutcome(player: Player, outcome: RoundOutcome, round: number) {
		if (outcome === RoundOutcome.All) return true;

		const roundInfo: Round = this.match.rounds[round];

		const isWin = roundInfo.winning_team === player.team;

		return outcome === RoundOutcome.Win && isWin || outcome === RoundOutcome.Loss && !isWin;
	}

	atPlantspot(player: Player, site: PlantSite, round: number) {
		if (site === PlantSite.All) return true;

		const roundInfo: Round = this.match.rounds[round];

		return roundInfo.plant_events.plant_site === site;
	}

	drawPlayerCircle(x: number, y: number, radius: number, player: Player, victim?: boolean) {
		this.ctx.beginPath();
		this.ctx.strokeStyle = 'hsla(0, 0, 0, 1)'
		this.ctx.lineWidth = 1;
		this.ctx.fillStyle = `hsla(${player.color}, ${victim ? 0.35 : 1})`
		this.ctx.arc(x, y, radius, 0, Math.PI * 2);
		this.ctx.fill();
		this.ctx.stroke();
		this.ctx.closePath();
	}

	drawAgent(x: number, y: number, radius: number, player: Player, victim?: boolean) {
		// Function that grabs the Agent image and applies it to the canvas as a circle thumbnail
		const agent: string = this.fetchAgent(player);

		// Mask
		this.ctx.save();

		this.ctx.beginPath();
		this.ctx.fillStyle = 'rgba(0, 0, 0, 0)';
		this.ctx.arc(x, y, radius, 0, Math.PI * 2, true);
		this.ctx.fill();
		this.ctx.closePath();
		this.ctx.clip();

		this.ctx.drawImage(this.imageCache[agent], x - radius, y - radius, radius * 2, radius * 2);

		// Draw a circle around the agent to show their team
		this.drawPlayerCircle(x, y, radius, player, victim);
		this.ctx.restore();
	}

	drawPlayerPositions(round: number, kill_index: number) {
		const kills: Kill[] = this.match.kills;

		let positions: PlayerLocationsOn[] = [];
		let victim: PlayerLocationsOn | null = null;

		for (let i = 0; i < kills.length; i++) {
			const kill = kills[i];

			if (kill.round === round) {
				if (i + kill_index < 0) continue;

				const kill: Kill = kills[i + kill_index];

				victim = {
					player_puuid: kill.victim_puuid,
					player_display_name: kill.victim_display_name,
					player_team: kill.victim_team,
					location: kill.victim_death_location,
					view_radians: 0,
				};

				const killerPosition: PlayerLocationsOn | null = kill.player_locations_on_kill.find((location) => location.player_puuid === kill.killer_puuid) || null;

				if (killerPosition) {
					this.drawLine(killerPosition.location.x, killerPosition.location.y, victim.location.x, victim.location.y, this.getPlayerFromPuuid(killerPosition.player_puuid));
				}

				positions = [
					victim,
					...kill.player_locations_on_kill,
				]

				break;
			}
		}

		positions.forEach((position) => {
			this.drawPlayer(position.location.x, position.location.y, 13, position.player_puuid, position.view_radians, position === victim);
		});
	}

	drawPlayer(x: number, y: number, radius: number, playerId: string, direction?: number, agent?: boolean, victim?: boolean) {

		const { x: canvas_x, y: canvas_y } = this.calculateLocation(x, y);
		const player: Player = this.getPlayerFromPuuid(playerId);

		if (agent) {
			this.drawAgent(canvas_x, canvas_y, radius, player, victim);
		} else {
			this.drawPlayerCircle(canvas_x, canvas_y, radius, player, victim);
		}

		// Calulate their radians and draw a small triangle outside of the circle to show their direction
		if (direction) {
			const radians = this.calculateRadians(direction);

			const triangle_x = canvas_x + Math.cos(radians) * (radius);
			const triangle_y = canvas_y + Math.sin(radians) * (radius);

			this.drawTriangle(triangle_x, triangle_y, radius, radians, player);
		}
	}

	drawMovementMap(filter: Filter, drawAgents: boolean) {

		// Map out all players movements from every kill
		const kills: Kill[] = this.filterKills(this.match.kills, filter);

		const playerLocationsOn: PlayerLocationsOn[] = kills.reduce((acc, kill) => {
			// Add the victim to the array
			const victim: PlayerLocationsOn = {
				player_puuid: kill.victim_puuid,
				player_display_name: kill.victim_display_name,
				player_team: kill.victim_team,
				location: kill.victim_death_location,
				view_radians: 0,
				is_victim: true
			};

			// Filter out all the Players Movements based on our filter settings
			const filteredLocations: PlayerLocationsOn[] = [...kill.player_locations_on_kill, victim].filter((location) => {
				const player: Player = filter.players.find((player) => player.puuid === location.player_puuid) || null;

				return player && this.isSide(player, filter.side, kill.round) && this.isOutcome(player, filter.roundOutcome, kill.round);
			});

			return [
				...acc,
				...filteredLocations
			];
		}, []);

		if (filter.drawHeatmap) {
			this.drawHeatmap(playerLocationsOn);
			return;
		}

		playerLocationsOn.forEach((position) => {
			this.drawPlayer(position.location.x, position.location.y, 10, position.player_puuid, position.view_radians, drawAgents, position.is_victim);
		});
	}

	// Create a function that groups the closest positions together and draw them all as a heatmap
	drawHeatmap(playerLocationsOn: PlayerLocationsOn[]) {
		this.heatmap.setData(
			playerLocationsOn.map((location) => {
				const { x, y } = this.calculateLocation(location.location.x, location.location.y);

				return {
					x,
					y,
					value: 10,
				}
			})
		)

		const imageURL = this.heatmap.toDataURL();

		const image = new Image();
		image.src = imageURL;
		image.onload = () => {
			this.ctx.drawImage(image, 0, 0, this.canvas.width, this.canvas.height);
		}
	}

	drawKills(filter: Filter) {
		const kills: Kill[] = this.filterKills(this.match.kills, filter);

		kills.forEach((kill, index) => {
			const player: Player = filter.players.find((player) => player.puuid === kill.killer_puuid);
			const killerPosition: PlayerLocationsOn | null = kill.player_locations_on_kill.find((location) => location.player_puuid === kill.killer_puuid) || null;

			// If firstblood & not first kill in the round skip
			if (filter.firstBlood && (index === 0 || kill.round === kills[index - 1].round)) {
				return;
			}

			if (player && killerPosition && this.isSide(player, filter.side, kill.round) && this.isOutcome(player, filter.roundOutcome, kill.round)) {
				// Draw killer, victim and line between them
				this.drawLine(killerPosition.location.x, killerPosition.location.y, kill.victim_death_location.x, kill.victim_death_location.y, this.getPlayerFromPuuid(killerPosition.player_puuid));
				this.drawPlayer(killerPosition.location.x, killerPosition.location.y, 10, killerPosition.player_puuid, killerPosition.view_radians, false, false);
				this.drawPlayer(kill.victim_death_location.x, kill.victim_death_location.y, 10, kill.victim_puuid, 0, false, true);
			}
		});
	}

	drawLine(x1: number, y1: number, x2: number, y2: number, player: Player) {

		const { x: canvas_x1, y: canvas_y1 } = this.calculateLocation(x1, y1);
		const { x: canvas_x2, y: canvas_y2 } = this.calculateLocation(x2, y2);

		// Draw a line between the two points with a width of 2 and the players, make sure not to override other strokes
		this.ctx.beginPath();
		this.ctx.lineWidth = 2;
		this.ctx.strokeStyle = player.color;
		this.ctx.moveTo(canvas_x1, canvas_y1);
		this.ctx.lineTo(canvas_x2, canvas_y2);
		this.ctx.stroke();
		this.ctx.closePath();
	}

	drawTriangle(x: number, y: number, radius: number, radians: number, player: Player) {
		this.ctx.beginPath();
		this.ctx.fillStyle = `hsl(${player.color})`;
		this.ctx.strokeStyle = 'hsla(0, 0, 0, 1)';
		this.ctx.lineWidth = 2;
		this.ctx.moveTo(x + Math.cos(radians + (2 * Math.PI) / 3) * radius, y + Math.sin(radians + (2 * Math.PI) / 3) * radius);
		this.ctx.lineTo(x + Math.cos(radians) * radius, y + Math.sin(radians) * radius);
		this.ctx.lineTo(x + Math.cos(radians + (4 * Math.PI) / 3) * radius, y + Math.sin(radians + (4 * Math.PI) / 3) * radius);
		this.ctx.stroke();
		this.ctx.closePath();
		this.ctx.fill();
	}

	drawSpike(x: number, y: number, color: string) {
		const { x: canvas_x, y: canvas_y } = this.calculateLocation(x, y);

		this.ctx.beginPath();
		this.ctx.drawImage(this.imageCache[`spike-${color.toLowerCase()}`], canvas_x - 16, canvas_y - 16, 32, 32);
		this.ctx.closePath();
	}

	drawBombPlacements(filter: Filter) {
		const rounds: Round[] = this.match.rounds.filter((round, roundNumber) => {
			if (!round.bomb_planted) return false; // No plants

			// Find player who planted the bomb based on our selected players
			const player: Player = filter.players.find((player) => player.puuid === round.plant_events.planted_by.puuid);

			// Return the the rounds where the player did plant that round and is on the selected site
			return player
				&& this.isOutcome(player, filter.roundOutcome, roundNumber)
				&& this.atPlantspot(player, filter.plantedAt, roundNumber);
		});

		rounds.forEach((round) => {
			this.drawSpike(round.plant_events.plant_location.x, round.plant_events.plant_location.y, round.plant_events.planted_by.team);
		});
	}

	update(filter: Filter, drawAgents?: boolean) {
		this.clearCanvas();

		if (this.mode === 'movement') {
			this.drawMovementMap(filter, drawAgents);
		} else if (this.mode === 'plants') {
			this.drawBombPlacements(filter);
		} else if (this.mode === 'kills') {
			this.drawKills(filter);
		}
	}

	setMode(mode: string) {
		this.mode = mode;
	}
}

export default Map;