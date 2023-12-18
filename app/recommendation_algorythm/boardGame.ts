import { MAX_AGE } from './constants';

interface TypeComparisonModel {
  TypesMap: { [key: string]: number };
  CategoriesMap: { [key: string]: number };
  MechanicsMap: { [key: string]: number };
}

interface BoardGameData {
  id?: string;
  minPlayers?: string;
  maxPlayers?: string;
  minAge?: string;
  minPlayTime?: string;
  maxPlayTime?: string;
  bggRating?: string;
  complexity?: string;
  bestPlayerNumberCommunity?: string;
  Types?: { name: string }[];
  categories?: string[];
  mechanics?: string[];
}

export class BoardGameInfos {
  id: string | undefined;
  minPlayers: number;
  maxPlayers: number;
  minAge: number;
  minPlaytime: number;
  maxPlaytime: number;
  bggRating: number;
  complexity: number;
  bestPlayerNumberCommunity: number;
  types: string[];
  categories: string[] | undefined;
  mechanics: string[] | undefined;
  types_b: { [key: string]: number } = {};
  categories_b: { [key: string]: number } = {};
  mechanics_b: { [key: string]: number } = {};

  constructor(data: BoardGameData, tcm: TypeComparisonModel) {
    this.id = data.id || undefined;
    this.minPlayers = parseInt(data.minPlayers || '0');
    this.maxPlayers = parseInt(data.maxPlayers || '0');
    this.minAge = parseInt(data.minAge || MAX_AGE.toString());
    this.minPlaytime = parseInt(data.minPlayTime || '0');
    this.maxPlaytime = parseInt(data.maxPlayTime || '0');
    this.bggRating = parseFloat(data.bggRating || '0');
    this.complexity = parseFloat(data.complexity || '0');
    this.bestPlayerNumberCommunity = parseInt(data.bestPlayerNumberCommunity || '0');
    this.types = (data.Types || []).map((t) => t.name);

    this.categories = data.categories;
    this.mechanics = data.mechanics;

    for (const key in tcm.TypesMap) {
      if (this.types.includes(key)) {
        this.types_b[key] = 1;
      } else {
        this.types_b[key] = 0;
      }
    }

    for (const key in tcm.CategoriesMap) {
      if (this.categories && this.categories.includes(key)) {
        this.categories_b[key] = 1;
      } else {
        this.categories_b[key] = 0;
      }
    }

    for (const key in tcm.MechanicsMap) {
      if (this.mechanics && this.mechanics.includes(key)) {
        this.mechanics_b[key] = 1;
      } else {
        this.mechanics_b[key] = 0;
      }
    }
  }

  toString(): string {
    console.log(
      `BoardGameInfos:\n id: ${this.id}\n minP: ${this.minPlayers}\n maxP: ${this.maxPlayers}\n minAge: ${this.minAge}\n bggRating: ${this.bggRating}\n complexity: ${this.complexity}\n bestPNum: ${this.bestPlayerNumberCommunity}\n`
    );

    console.log(` Types length ${this.types.length}\n`);
    console.log(' Types_b: ', Object.values(this.types_b).join(' '), '\n');

    console.log(` Categories length ${this.categories ? this.categories.length : 0}\n`);
    console.log(' Categories_b: ', Object.values(this.categories_b).join(' '), '\n');

    console.log(` Mechanics length ${this.mechanics ? this.mechanics.length : 0}\n`);
    console.log(' Mechanics_b: ', Object.values(this.mechanics_b).join(' '), '\n');

    return '';
  }
}