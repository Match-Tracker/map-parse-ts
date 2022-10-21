import { match } from 'assert';
import { useMatch } from '~~/store/match';

export enum Side {
	All = 'All',
	Attack = 'Attack',
	Defence = 'Defence'
}


class MatchStats {
  side: Side;
	stats: object[]; 

  constructor() {
    this.side = Side.All;
		this.stats = [
			{title: 'Operator Rounds %', blue: '', red: ''},
			{title: 'Pistol Rounds Wins', blue: '', red: ''},
			{title: 'Star Players Kill %', blue: '', red: ''},
			{title: 'A Site Plants', blue: '', red: ''},
			{title: 'B Site Plants', blue: '', red: ''},
			{title: 'C Site Plants', blue: '', red: ''},
			{title: 'Kills In 20s', blue: '', red: ''},

	];
  }
	
  newSide(tab: Side) {
    this.side = tab
		this.update()
  }

	isAttack(team: String, side: Side, round: number) {
		const isAttacking = round <= 11 && team === 'Red' || round > 11 && team === 'Blue';
		if (side === Side.All || side === Side.Attack && isAttacking || side === Side.Defence && !isAttacking) return true;
		return false;
	}

	operatorRounds(match) {
		let blueRounds = 0
		let redRounds = 0
		const teamRound: any[] = [[false, 0, 0], [false, 0, 0]]


		match.rounds.forEach((round, index) => {
			const hasOperator = round.player_stats.filter((player) => player.economy.weapon.name === 'Operator') 

			const teams = ['Blue', 'Red'].forEach((team, teamIndex) => {
				teamRound[teamIndex][0] = false;

				if (this.isAttack(team, this.side, index)) {
					teamRound[teamIndex][2] += 1
				}

				if (hasOperator.length > 0) {
					hasOperator.forEach((player) => {
						if (player.player_team === team && teamRound[teamIndex][0] != true && this.isAttack(team, this.side, index)) {
							teamRound[teamIndex][0] = true; 
							teamRound[teamIndex][1] += 1;
						}
					})
				}
			})
		})
		this.stats.find((stat) => stat['title'] === 'Operator Rounds %')['Blue'] = `${((teamRound[0][1] / teamRound[0][2]) * 100).toFixed(1)}%`
		this.stats.find((stat) => stat['title'] === 'Operator Rounds %')['Red'] = `${((teamRound[1][1] / teamRound[1][2]) * 100).toFixed(1)}%`	
	}

	pistolRoundsWon(match) {
		const pistolRounds = [match.rounds[0].winning_team,  match.rounds[12].winning_team];
		const roundScore = [0, 0]
		pistolRounds.forEach((round) => {
			if (round === 'Blue') {
				roundScore[0] += 1
			} else {
				roundScore[1] += 1
			}
		})

		this.stats.find((stat) => stat['title'] === 'Pistol Rounds Wins')['Blue'] = `${((roundScore[0] / pistolRounds.length) * 100).toFixed(1)}%`		
		this.stats.find((stat) => stat['title'] === 'Pistol Rounds Wins')['Red'] = `${((roundScore[1] / pistolRounds.length) * 100).toFixed(1)}%`		
	}

	plantSites(match) {
		const planted = [{A: 0, B: 0, C: 0}, {A: 0, B: 0, C: 0},]
		match.rounds.forEach((round, roundIndex) => {
			planted.forEach((team, teamIndex) => {
				if (((teamIndex === 0 && this.isAttack('Blue', Side.Attack, roundIndex)) || (teamIndex === 1 && this.isAttack('Red', Side.Attack, roundIndex)))  && round.plant_events.plant_site != null) {
					team[round.plant_events.plant_site] += 1
				}
			})
		})
		
		const sites = ['A', 'B', 'C'].forEach((site) => {
					this.stats.find((stat) => stat['title'] === `${site} Site Plants`)['Blue'] = `${planted[0][site]}`		
					this.stats.find((stat) => stat['title'] === `${site} Site Plants`)['Red'] = `${planted[1][site]}`		
		})
	}

	starPlayer(match) {
		const players = []
		match.players.all_players.forEach((player) => {players.push({puuid: player.puuid, team: player.team, kills: 0})})
		match.rounds.forEach((round, index) => {
			round.player_stats.forEach((player) => {
				if (this.isAttack(player.player_team, this.side, index)) {
					players.find((playerStore) => playerStore.puuid === player.player_puuid)['kills'] += player.kills;
				}
			})
		})
		
		const teams = ['Blue', 'Red'].forEach((team => {
			const teamKills = players.filter((player) => player.team === team).map((p) => {return p.kills});
			const totalKills = teamKills.reduce((a,b) => a + b, 0)
			teamKills.sort(function(a, b){ return b - a });
			const starKills = teamKills[0] + teamKills[1];
			this.stats.find((stat) => stat['title'] === `Star Players Kill %`)[team] = `${(starKills/totalKills * 100).toFixed(1)}%`
		}));
	}

	killPace(match) {
		const teams = ['Blue', 'Red'].forEach((team) => {
			let fastkills = 0;
			match.kills.forEach((kill) => {
				if (kill.killer_team === team && kill.kill_time_in_round < 20000 && this.isAttack(team, this.side, kill.round)) {
					fastkills += 1
				}
			})

			const teamKills = match.players.all_players.filter((player) => player.team === team).map((p) => {return p.stats.kills});
			const totalKills = teamKills.reduce((a,b) => a + b, 0)
			this.stats.find((stat) => stat['title'] === `Kills In 20s`)[team] = `${(fastkills/totalKills * 100).toFixed(1)}%`
		})
	}

	forceBuy(match) {
		const teams = ['Blue', 'Red'].forEach((team) => {
			let moneySpent = 0;
			match.rounds.forEach((round, index) => {
				if (round.winning_team != team && this.isAttack(team, this.side, index) && (index === 0 || index === 12)) {
					round.player_stats.forEach((player) => {
						if (player.player_team === team) {
							moneySpent += player.economy.spent
						}
					})

					if (moneySpent > 0) {
						// console.log('Force buy!')
					}
				}
			})
		})
	}

	update() {
		const match = useMatch();
		this.operatorRounds(match);
		this.pistolRoundsWon(match);
		this.plantSites(match);
		this.starPlayer(match);
		this.killPace(match);
		this.forceBuy(match);

		return this.stats;
	}
}

export default MatchStats