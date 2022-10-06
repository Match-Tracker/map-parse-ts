export interface Data {
	status: number;
	data:   Match;
}

export interface Match {
	metadata: Metadata;
	players:  Players;
	teams:    Teams;
	rounds:   Round[];
	kills:    Kill[];
}

export interface APIMatch {
	map: string,
	length: number,
	rounds: number,
	date: number,
	mode: Mode,
	matchId: string,
	score: {
		red: number,
		blue: number
	}
}

export interface Kill {
	kill_time_in_round:       number;
	kill_time_in_match:       number;
	round?:                   number;
	killer_puuid:             string;
	killer_display_name:      string;
	killer_team:              Team;
	victim_puuid:             string;
	victim_display_name:      string;
	victim_team:              Team;
	victim_death_location:    Location;
	damage_weapon_id:         string;
	damage_weapon_name?:      DamageWeaponNameEnum | null;
	damage_weapon_assets:     DamageWeaponAssetsClass;
	secondary_fire_mode:      boolean;
	player_locations_on_kill: PlayerLocationsOn[];
	assistants:               Assistant[];
}

export interface Assistant {
	assistant_puuid:        string;
	assistant_display_name: string;
	assistant_team:         Team;
}

export enum Team {
	Blue = "Blue",
	Red = "Red",
}

export interface DamageWeaponAssetsClass {
	display_icon?:  null | string;
	killfeed_icon?: null | string;
}

export enum DamageWeaponNameEnum {
	Bulldog = "Bulldog",
	Classic = "Classic",
	Frenzy = "Frenzy",
	Ghost = "Ghost",
	Guardian = "Guardian",
	Judge = "Judge",
	Marshal = "Marshal",
	Operator = "Operator",
	Phantom = "Phantom",
	Sheriff = "Sheriff",
	Shorty = "Shorty",
	Spectre = "Spectre",
	Vandal = "Vandal",
}

export interface PlayerLocationsOn {
	player_puuid:        string;
	player_display_name: string;
	player_team:         Team;
	location:            Location;
	view_radians:        number;
}

export interface Location {
	x: number;
	y: number;
}

export interface Metadata {
	map:                string;
	game_version:       string;
	game_length:        number;
	game_start:         number;
	game_start_patched: string;
	rounds_played:      number;
	mode:               Mode;
	queue:              string;
	season_id:          string;
	platform:           PlatformEnum;
	matchid:            string;
	region:             string;
	cluster:            string;
}

export enum Mode {
	Unrated = "Unrated",
	Competitive = "Competitive",
	SpikeRush = "Spike Rush"
}

export enum PlatformEnum {
	PC = "PC",
}

export interface Players {
	all_players: Player[];
	red:         Player[];
	blue:        Player[];
}

export interface Player {
	puuid:               string;
	name:                string;
	tag:                 string;
	team:                Team;
	level:               number;
	character:           string;
	currenttier:         number;
	currenttier_patched: Mode;
	player_card:         string;
	player_title:        string;
	party_id:            string;
	session_playtime:    SessionPlaytime;
	behavior:            Behavior;
	platform:            PlatformClass;
	ability_casts:       AllPlayerAbilityCasts;
	assets:              AllPlayerAssets;
	stats:               Stats;
	economy:             AllPlayerEconomy;
	damage_made:         number;
	damage_received:     number;
	color:               string;
}

export interface AllPlayerAbilityCasts {
	c_cast: number;
	q_cast: number;
	e_cast: number;
	x_cast: number;
}

export interface AllPlayerAssets {
	card:  Card;
	agent: Agent;
}

export interface Agent {
	small:    string;
	bust:     string;
	full:     string;
	killfeed: string;
}

export interface Card {
	small: string;
	large: string;
	wide:  string;
}

export interface Behavior {
	afk_rounds:      number;
	friendly_fire:   FriendlyFire;
	rounds_in_spawn: number;
}

export interface FriendlyFire {
	incoming: number;
	outgoing: number;
}

export interface AllPlayerEconomy {
	spent:         LoadoutValue;
	loadout_value: LoadoutValue;
}

export interface LoadoutValue {
	overall: number;
	average: number;
}

export interface PlatformClass {
	type: PlatformEnum;
	os:   OS;
}

export interface OS {
	name:    OSName;
	version: string;
}

export enum OSName {
	Windows = "Windows",
}

export interface SessionPlaytime {
	minutes:      number;
	seconds:      number;
	milliseconds: number;
}

export interface Stats {
	score:     number;
	kills:     number;
	deaths:    number;
	assists:   number;
	bodyshots: number;
	headshots: number;
	legshots:  number;
}

export interface Round {
	winning_team:  Team;
	end_type:      EndType;
	bomb_planted:  boolean;
	bomb_defused:  boolean;
	plant_events:  PlantEvents;
	defuse_events: DefuseEvents;
	player_stats:  PlayerStat[];
}

export interface DefuseEvents {
	defuse_location:            Location | null;
	defused_by:                 EdBy | null;
	defuse_time_in_round:       number | null;
	player_locations_on_defuse: PlayerLocationsOn[] | null;
}

export interface EdBy {
	puuid:        string;
	display_name: string;
	team:         Team;
}

export enum EndType {
	BombDefused = "Bomb defused",
	BombDetonated = "Bomb detonated",
	Eliminated = "Eliminated",
}

export interface PlantEvents {
	plant_location:            Location | null;
	planted_by:                EdBy | null;
	plant_site:                PlantSite | null;
	plant_time_in_round:       number | null;
	player_locations_on_plant: PlayerLocationsOn[] | null;
}

export enum PlantSite {
	A = "A",
	B = "B",
}

export interface PlayerStat {
	ability_casts:       PlayerStatAbilityCasts;
	player_puuid:        string;
	player_display_name: string;
	player_team:         Team;
	damage_events:       DamageEvent[];
	damage:              number;
	bodyshots:           number;
	headshots:           number;
	legshots:            number;
	kill_events:         Kill[];
	kills:               number;
	score:               number;
	economy:             PlayerStatEconomy;
	was_afk:             boolean;
	was_penalized:       boolean;
	stayed_in_spawn:     boolean;
}

export interface PlayerStatAbilityCasts {
	c_casts: null;
	q_casts: null;
	e_cast:  null;
	x_cast:  null;
}

export interface DamageEvent {
	receiver_puuid:        string;
	receiver_display_name: string;
	receiver_team:         Team;
	bodyshots:             number;
	damage:                number;
	headshots:             number;
	legshots:              number;
}

export interface PlayerStatEconomy {
	loadout_value: number;
	weapon:        Weapon;
	armor:         Armor;
	remaining:     number;
	spent:         number;
}

export interface Armor {
	id:     ArmorID | null;
	name:   ArmorName | null;
	assets: ArmorAssets;
}

export interface ArmorAssets {
	display_icon: null | string;
}

export enum ArmorID {
	The4Dec83D549029Ab3Bed6A7A390761157 = "4DEC83D5-4902-9AB3-BED6-A7A390761157",
	The822Bcab240A2324EC137E09195Ad7692 = "822BCAB2-40A2-324E-C137-E09195AD7692",
}

export enum ArmorName {
	HeavyShields = "Heavy Shields",
	LightShields = "Light Shields",
}

export interface Weapon {
	id:     WeaponID | null;
	name:   DamageWeaponNameEnum | null;
	assets: DamageWeaponAssetsClass;
}

export enum WeaponID {
	A03B24D34319996D0F8C94Bbfba1Dfc7 = "A03B24D3-4319-996D-0F8C-94BBFBA1DFC7",
	Ae3De1424D852547Dd264E90Bed35Cf7 = "AE3DE142-4D85-2547-DD26-4E90BED35CF7",
	C4883E504494202C3Ec36B8A9284F00B = "C4883E50-4494-202C-3EC3-6B8A9284F00B",
	E336C6B8418D9340D77F7A9E4Cfe0702 = "E336C6B8-418D-9340-D77F-7A9E4CFE0702",
	Ec845Bf44F79DddaA3Da0Db3774B2794 = "EC845BF4-4F79-DDDA-A3DA-0DB3774B2794",
	Ee8E8D15496B07ACE5F68Fae5D4C7B1A = "EE8E8D15-496B-07AC-E5F6-8FAE5D4C7B1A",
	The1Baa85B44C70128464Bb6481Dfc3Bb4E = "1BAA85B4-4C70-1284-64BB-6481DFC3BB4E",
	The29A0Cfab485BF5D5779AB59F85E204A8 = "29A0CFAB-485B-F5D5-779A-B59F85E204A8",
	The42Da8Ccc40D5AffcBeec15Aa47B42EDA = "42DA8CCC-40D5-AFFC-BEEC-15AA47B42EDA",
	The462080D1403529377C0927Aa2A5C27A7 = "462080D1-4035-2937-7C09-27AA2A5C27A7",
	The4Ade7Faa4Cf1837695Ef39884480959B = "4ADE7FAA-4CF1-8376-95EF-39884480959B",
	The9C82E19D457502001A813Eacf00Cf872 = "9C82E19D-4575-0200-1A81-3EACF00CF872",
}

export interface Teams {
	red:  Blue;
	blue: Blue;
}

export interface Blue {
	has_won:     boolean;
	rounds_won:  number;
	rounds_lost: number;
}


export interface MapInfo {
	uuid:         string;
	displayName:  string;
	coordinates:  string;
	displayIcon:  string;
	listViewIcon: string;
	splash:       string;
	assetPath:    string;
	mapURL:       string;
	xMultiplier:  number;
	yMultiplier:  number;
	xScalarToAdd: number;
	yScalarToAdd: number;
	callouts:     Callout[];
}

export interface Callout {
	regionName:      string;
	superRegionName: SuperRegionName;
	location:        Location;
}

export interface Location {
	x: number;
	y: number;
}

export enum SuperRegionName {
	A = "A",
	AttackerSide = "Attacker Side",
	B = "B",
	DefenderSide = "Defender Side",
}

export enum AgentID {
	"117ED9E3-49F3-6512-3CCF-0CADA7E3823B" = "cypher",
	"ADD6443A-41BD-E414-F6AD-E58D267F4E95" = "jett",
	"8E253930-4C05-31DD-1B6C-968525494517" = "omen",
	"A3BFB853-43B2-7238-A4F1-AD90E9E46BCC" = "reyna",
	"569FDD95-4D10-43AB-CA70-79BECC718B46" = "sage",
	"7F94D92C-4234-0A36-9646-3A87EB8B5C89" = "yoru",
	"BB2A4828-46EB-8CD1-E765-15848195D751" = "neon",
	"9F0D8BA9-4140-B941-57D3-A7AD57C6B417" = "brimstone",
	"41FB69C1-4189-7B37-F117-BCAF1E96F1BF" = "astra",
	"EB93336A-449B-9C1B-0A54-A891F7921D69" = "phoenix",
	"707EAB51-4836-F488-046A-CDA6BF494859" = "viper",
	"1E58DE9C-4950-5125-93E9-A0AEE9F98746" = "killjoy",
	"320B2A48-4D9B-A075-30F1-1F93A9B638FA" = "sova",
	"6F2A04CA-43E0-BE17-7F36-B3908627744D" = "skye",
	"601DBBE7-43CE-BE57-2A40-4ABD24953621" = "kayo",
	"22697A3D-45BF-8DD7-4FEC-84A9E28C69D7" = "chamber",
	"F94C3B30-42BE-E959-889C-5AA313DBA261" = "raze",
	"5F8D3A7F-467B-97F3-062C-13ACF203C006" = "breach",
	"DADE69B4-4F5A-8528-247B-219E5A1FACD6" = "fade"
}