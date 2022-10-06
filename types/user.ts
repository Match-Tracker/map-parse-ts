export interface RiotAccount {
	puuid: string;
	username: string;
	tagline: string;
}

export interface User {
  discordId: string;
	username: string;
	avatar: string;
  email: string;
  subscription: {
    active: boolean;
    plan: string;
    expiresAt: Date;
  },
  riotAccounts: RiotAccount[];
}