export type typeShipViewer = {
	Editions:typeEditionData[];
	Ships:typeShipData[];
};
export type typeEdition = {
	Name:string;
	Description:string;
}
export type typeEditionData = {
	EditionName:string;
	ErrorMessage?:string;
	Sources:string[];
	Levels:typeLevel[];
	Races:typeRace[];
	ShipLinks:typeShipLink[];
}
export type typeRace = {
	RaceID:number;
	RaceName:string;
}
export type typeLevel = {
	LevelID:number;
	LevelName:string;
}
export type typeShipLink = {
	ShipID:number;
	RaceID:number;
	ShipLevel:number;
	SheetType:number;
	ShipName:string;
	PerWing?:number;
	Source:string;
}
export type typeShipData = {
	Edition:string;
	ShipID:number;
	ErrorMessage?:string;
	Craft?:typeCraft;
	CrewValue?:number;
	Crippled?:number;
	CrippledColour1?:string;
	CrippledColour2?:string;
	DamageValue?:number;
	Hull?:number;
	ISDFrom?:number;
	ISDTo?:number;
	LevelName?:string;
	Notes?:string;
	RaceID?:number;
	RaceName?:string;
	SheetType?:number;
	ShipLevel?:number;
	ShipName?:string;
	ShipSpeed?:string;
	ShipTroops?:number;
	ShortName?:string;
	Skeletoned?:number;
	Source?:string;
	Turns?:string;
	Weapons?:typeWeapons;
}
export type typeWeapon = {
	Name:string;
	AD:number;
	Range:number;
	Traits:string[];
}
export type typeWeapons = {
	Forward?:typeWeapon[];
	Aft?:typeWeapon[];
	Starboard?:typeWeapon[];
	Port?:typeWeapon[];
	Boresight?:typeWeapon[];
	BoresightAft?:typeWeapon[];
	Turret?:typeWeapon[];
}
export type typeCraft = {
	Name:string;
	Source?:string;
	ShipID?:number;
	Number:number;
	Assigned:number;
	SwapIn?:boolean;
	SwapOut?:boolean;
	Price?:number;
}
