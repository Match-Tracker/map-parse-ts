import { AgentID, type Kill, type MapInfo, type Match, type Player, type PlayerLocationsOn } from './../types/match';

import * as MapData from '../types/maps.json';


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

	constructor(match: Match, canvas: HTMLCanvasElement) {
		this.isReady = false;
		this.match = match;
		this.canvas = canvas;
		this.map = match.metadata.map;
		this.info = null;
		this.ctx = canvas.getContext('2d')!;

		this.imageCache = {};
		this.images = [
			'/assets/img/maps/ascent.png',
			'/assets/img/maps/bind.png',
			'/assets/img/maps/breeze.png',
			'/assets/img/maps/haven.png',
			'/assets/img/maps/icebox.png',
			'/assets/img/maps/split.png',
			'/assets/img/agents/astra.png',
			'/assets/img/agents/breach.png',
			'/assets/img/agents/brimstone.png',
			'/assets/img/agents/cypher.png',
			'/assets/img/agents/jett.png',
			'/assets/img/agents/omen.png',
			'/assets/img/agents/phoenix.png',
			'/assets/img/agents/raze.png',
			'/assets/img/agents/reyna.png',
			'/assets/img/agents/sage.png',
			'/assets/img/agents/skye.png',
			'/assets/img/agents/sova.png',
			'/assets/img/agents/viper.png',
			'/assets/img/agents/yoru.png',
			'/assets/img/agents/killjoy.png',
			'/assets/img/agents/fade.png',
			'/assets/img/agents/neon.png',
			'/assets/img/agents/chamber.png',
			'/assets/img/agents/kayo.png'
		];

		/* Filters */
		this.minTime = 0;
		this.maxTime = 300;

		Promise.all(this.loadImages()).then(() => {
			this.fetchMapInfo();
			this.setupCanvas();

			this.ctx.drawImage(this.imageCache[this.map.toLowerCase()], 0, 0);

			this.isReady = true;
		});
	}

	setupCanvas(){
		this.canvas.width = 1024;
		this.canvas.height = 1024;
	}

	clearCanvas () {
		// Clear all drawings except the map
		this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
		this.ctx.drawImage(this.imageCache[this.map.toLowerCase()], 0, 0);
	}

	loadImages () {
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

	fetchAgent (player: Player): string {
		const agentId: string = player.assets.agent.small.split('/')[4].toUpperCase() || '';
		
		return AgentID[agentId as keyof typeof AgentID] || 'unknown';
	}

	drawPlayerCircle (x: number, y: number, radius: number, player: Player, victim?: boolean) {
		this.ctx.beginPath();
		this.ctx.arc(x, y, radius, 0, Math.PI * 2);
		this.ctx.fillStyle = `hsla(${player.color}, ${victim ? 0.5 : 1})`
		this.ctx.fill();
		this.ctx.strokeStyle = 'hsla(0, 0, 0, 1)'
		this.ctx.stroke()
		this.ctx.closePath();
	}

	drawAgent (x: number, y: number, radius: number, player: Player, victim?: boolean) {
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
		console.log('Drawing player positions for round', round, 'and kill index', kill_index);
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
			this.drawPlayer(position.location.x, position.location.y, 13, this.getPlayerFromPuuid(position.player_puuid), position.view_radians, position === victim);
		});
	}

	drawPlayer(x: number, y: number, radius: number, player: Player, direction?: number, agent?: boolean, victim?: boolean) {
		
		const { x: canvas_x, y: canvas_y } = this.calculateLocation(x, y);
		
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

	drawMovementMap (player: Player, timeRange: number[], drawAgents: boolean) {

		// Map out all players movements from every kill
		const kills: Kill[] = this.match.kills.filter((kill) => kill.kill_time_in_round / 1000 >= timeRange[0] && kill.kill_time_in_round / 1000 <= timeRange[1]);
		const playerPositions: PlayerLocationsOn[] = kills.reduce((acc: PlayerLocationsOn[], kill: Kill) => {
			const playerPosition: PlayerLocationsOn | null = kill.player_locations_on_kill.find((location) => location.player_puuid === player.puuid) || null;

			if (playerPosition) {
				acc.push(playerPosition);
			}

			return acc;
		}, []);

		// Draw the map
		playerPositions.forEach((position) => {
			this.drawPlayer(position.location.x, position.location.y, 10, player, position.view_radians, drawAgents, position === playerPositions[playerPositions.length - 1]);
		});
	}

	drawLine(x1: number, y1: number, x2: number, y2: number, player: Player) {
		
		const { x: canvas_x1, y: canvas_y1 } = this.calculateLocation(x1, y1);
		const { x: canvas_x2, y: canvas_y2 } = this.calculateLocation(x2, y2);
		
		// Draw the line from the killer to the victim with a blue color with a thickness of 5
		this.ctx.beginPath();
		this.ctx.strokeStyle = `hsl(${player.color})`;
		this.ctx.moveTo(canvas_x1, canvas_y1);
		this.ctx.lineTo(canvas_x2, canvas_y2);
		this.ctx.stroke();
		this.ctx.closePath();
	}

	drawTriangle(x: number, y: number, radius: number, radians: number, player: Player) {
		this.ctx.beginPath();
		this.ctx.fillStyle = `hsl(${player.color})`;
		this.ctx.strokeStyle = 'hsla(0, 0, 0, 1)'
		this.ctx.moveTo(x + Math.cos(radians + (2 * Math.PI) / 3) * radius, y + Math.sin(radians + (2 * Math.PI) / 3) * radius);
		this.ctx.lineTo(x + Math.cos(radians) * radius, y + Math.sin(radians) * radius);
		this.ctx.lineTo(x + Math.cos(radians + (4 * Math.PI) / 3) * radius, y + Math.sin(radians + (4 * Math.PI) / 3) * radius);
		this.ctx.fill();
		this.ctx.stroke();
		this.ctx.closePath();
	}
}

export default Map;