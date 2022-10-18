import { match } from 'assert';
import { useMatch } from '~~/store/match';

export enum Side {
	All = 'All',
	Attack = 'Attack',
	Defence = 'Defence'
}

export enum Team {
	Blue = 0,
	Red = 0
}

class MatchStats {
  side: Side;
	stats: object[]; 

  constructor() {
    this.side = Side.All;
		this.stats = [{title: 'Operator Rounds %', blue: '', red: ''}];
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

	update() {
		const match = useMatch()
		this.operatorRounds(match)
		return this.stats
	}
}

export default MatchStats