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

		match.rounds.forEach((round, index) => {
			const hasOperator = round.player_stats.filter((player) => player.economy.weapon.name === 'Operator') 
			if (hasOperator.length > 0) {
				const teamRound: boolean[] = [false, false]
				hasOperator.forEach((player) => {
					if (player.player_team === 'Blue' && teamRound[0] != true && this.isAttack('Blue', this.side, index)) {
						teamRound[0] = true; 
						blueRounds += 1
					} if (player.player_team === 'Red' && teamRound[1] != true && this.isAttack('Red', this.side, index)) { 
						teamRound[1] = true; 
						redRounds += 1
					}
				})
			}
		})
	
		// To Do: side rounds? 
		this.stats.find((stat) => stat['title'] === 'Operator Rounds %')['Blue'] = `${((blueRounds / match.rounds.length) * 100).toFixed(1)}%`
		this.stats.find((stat) => stat['title'] === 'Operator Rounds %')['Red'] = `${((redRounds / match.rounds.length) * 100).toFixed(1)}%`
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

	// How "star player" centered is the team. How big % of kills do the top 2 highest fraggers get?
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
			console.log(starKills, totalKills, teamKills)
			this.stats.find((stat) => stat['title'] === `Star Players Kill %`)[team] = `${(starKills/totalKills * 100).toFixed(1)}%`
		}));
	}

	update() {
		const match = useMatch();
		this.operatorRounds(match);
		this.pistolRoundsWon(match);
		this.plantSites(match);
		this.starPlayer(match);
		return this.stats;
	}
}

export default MatchStats