import { IUser, IGuild } from './../db/User';
import axios from 'axios';

// An Enum of all the Discord Permissions and their Hexadecimal Values
// Using the values from https://discord.com/developers/docs/topics/permissions
export enum Permissions {
	ADMINISTRATOR = 0x8,
	VIEW_AUDIT_LOG = 0x80,
	MANAGE_GUILD = 0x20,
	MANAGE_ROLES = 0x10000000,
	MANAGE_CHANNELS = 0x10,
	KICK_MEMBERS = 0x2,
	BAN_MEMBERS = 0x4,
	CREATE_INSTANT_INVITE = 0x1,
	CHANGE_NICKNAME = 0x4000000,
	MANAGE_NICKNAMES = 0x8000000,
	MANAGE_EMOJIS = 0x40000,
	MANAGE_WEBHOOKS = 0x2000000,
	VIEW_CHANNEL = 0x400,
	SEND_MESSAGES = 0x800,
	SEND_TTS_MESSAGES = 0x1000,
	MANAGE_MESSAGES = 0x20000,
	EMBED_LINKS = 0x4000,
	ATTACH_FILES = 0x8000,
	READ_MESSAGE_HISTORY = 0x10000,
	MENTION_EVERYONE = 0x20000,
	USE_EXTERNAL_EMOJIS = 0x40000,
	ADD_REACTIONS = 0x40,
	CONNECT = 0x100000,
	SPEAK = 0x200000,
	MUTE_MEMBERS = 0x400000,
	DEAFEN_MEMBERS = 0x800000,
	MOVE_MEMBERS = 0x1000000,
	USE_VAD = 0x2000000,
	PRIORITY_SPEAKER = 0x100,
	STREAM = 0x200,
	REQUEST_TO_SPEAK = 0x10000000,
}

export const fetchGuilds = async (accessToken: string) => {
	const { data } = await axios.get('https://discord.com/api/users/@me/guilds', {
		headers: {
			Authorization: `Bearer ${accessToken}`,
		},
	});
	
	// Loop through all the guilds and check if the user has the required permissions to invite a bot
	// If the user has the required permissions, add the guild to the guilds array
	const filteredGuilds: IGuild[] = [];
	for (const guild of data) {
		if (guild.permissions & Permissions.ADMINISTRATOR) {
			filteredGuilds.push(guild);
		}
	}
	
	return filteredGuilds;
}

// A function to check if a user has a certain permission in a guild
export const hasPermissionInGuild = (user: IUser, guild: IGuild, permission: Permissions) => {
	// Check if the user is the owner of the guild
	if (guild.owner) {
		// If the user is the owner of the guild, return true
		return true;
	}

	// Check if the user has the permission
	if ((guild.permissions & permission) === permission) {
		// If the user has the permission, return true
		return true;
	}

	// If the user doesn't have the permission, return false
	return false;
};