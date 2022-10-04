import type { Kill, MapInfo, Match, Player, PlayerLocationsOn } from './../types/match';

import * as MapData from '../types/maps.json';

class Map {
	map: string;
	canvas: HTMLCanvasElement;
	ctx: CanvasRenderingContext2D;
	match: Match;
	info: MapInfo | null;

	constructor(match: Match, canvas: HTMLCanvasElement) {
		this.match = match;
		this.canvas = canvas;
		this.map = match.metadata.map;
		this.info = null;
		this.ctx = canvas.getContext('2d')!;

		this.fetchMapInfo();
		this.setupCanvas();
		this.fetchMap();
	}

	setupCanvas() {
		this.canvas.width = 1024;
		this.canvas.height = 1024;

		// Set the canvas to the correct aspect ratio
		this.canvas.style.width = '100%';
		this.canvas.style.height = '100%';
	}

	async fetchMap() {
		// Import the map from assets folder and draw it on the canvas
		const mapImage = new Image();
		mapImage.src = new URL(`/src/assets/img/maps/${this.map}.png`, import.meta.url).href;
		mapImage.onload = () => {
			this.canvas.getContext('2d')?.drawImage(mapImage, 0, 0);

			this.drawPlayerPositions(2, 2);
		}

		// Fetch the map info
		// await this.fetchMapInfo();
	}

	fetchMapInfo() {
		// Fetch the map info from the API
		const info: MapInfo[] = JSON.parse(JSON.stringify(MapData)).default;
		console.log(info)
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
					this.drawLine(killerPosition.location.x, killerPosition.location.y, victim.location.x, victim.location.y);
				}

				positions = [
					victim,
					...kill.player_locations_on_kill,
				]

				break;
			}
		}

		positions.forEach((position) => {
			this.drawPlayer(position.location.x, position.location.y, 10, this.getPlayerFromPuuid(position.player_puuid), position.view_radians, position === victim);
		});
	}

	drawLine(x1: number, y1: number, x2: number, y2: number) {
		
		const { x: canvas_x1, y: canvas_y1 } = this.calculateLocation(x1, y1);
		const { x: canvas_x2, y: canvas_y2 } = this.calculateLocation(x2, y2);
		
		// Draw the line from the killer to the victim with a blue color with a thickness of 5
		this.ctx.beginPath();
		this.ctx.strokeStyle = 'hsl(0, 0%, 0%, 1)';
		this.ctx.moveTo(canvas_x1, canvas_y1);
		this.ctx.lineTo(canvas_x2, canvas_y2);
		this.ctx.stroke();
		this.ctx.closePath();
	}

	drawPlayer(x: number, y: number, radius: number, player: Player, direction?: number, victim?: boolean) {
		
		const { x: canvas_x, y: canvas_y } = this.calculateLocation(x, y);

		// Randomly generate an integer
		function getRandom(min, max) {
			min = Math.ceil(min);
			max = Math.floor(max);
			return Math.floor(Math.random() * (max - min) + min);
		}
		
		// Create a random HSL colour
		const colour = `${getRandom(0, 360)}, 100%, ${getRandom(30, 75)}%`;
		player.colour = colour;

		this.ctx.beginPath();
		// Draw their circle, if they're victim, change opacity by 50%
		this.ctx.fillStyle = `hsla(${colour}, ${victim ? 0.5 : 1})`
		this.ctx.arc(canvas_x, canvas_y, radius, 0, Math.PI * 2);
		this.ctx.fill();

		// Calulate their radians and draw a small triangle to show their view direction
		if (direction) {
			const radians = this.calculateRadians(direction);
			this.ctx.moveTo(canvas_x, canvas_y);
			this.ctx.lineTo(canvas_x + Math.cos(radians) * radius, canvas_y + Math.sin(radians) * radius);
			this.ctx.stroke();
		}

		this.ctx.closePath();
	}

	drawCircle = (x: number, y: number, radius: number) => {
		this.ctx.beginPath();
		this.ctx.arc(x, y, radius, 0, Math.PI * 2);
		this.ctx.fill();
		this.ctx.closePath();
	}

	getPlayerFromPuuid(puuid: string) {
		return this.match.players.all_players.find((player) => player.puuid === puuid) || this.match.players.all_players[0];
	}
}

export default Map;