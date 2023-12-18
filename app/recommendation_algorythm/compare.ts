import * as c from './constants';

interface Game {
  Types: string[];
  complexity: number;
  minAge: number;
  minPlayers: number;
  maxPlayers: number;
  categories: string[];
  mechanics: string[];
  minPlayTime: number;
  maxPlayTime: number;
  bestPlayerNumberCommunity: number;
  bggRating: number;
}

interface Feedback {
  id: string;
  rating: number;
}

interface Preferences {
  difficulty: string;
  age: string;
  playerCount: string;
  categories: string[];
  playTime: string;
}

interface TypeComparisonModel {
  typesPrecent: { [key: string]: number };
  categoriesPrecent: { [key: string]: number };
  mechanicsPrecent: { [key: string]: number };
}

export function idealGame(preferences: Preferences, feedbacks: Feedback[], games: Game[]): Game {
  const game: Game = {
    Types: [],
    complexity: 0,
    minAge: c.MAX_AGE,
    minPlayers: c.MIN_PLAYERS,
    maxPlayers: c.MAX_PLAYERS,
    categories: [],
    mechanics: [],
    minPlayTime: 0,
    maxPlayTime: 1440,
    bestPlayerNumberCommunity: 0,
    bggRating: 0,
  };

  if (preferences) {
    game.complexity = parseFloat(c.COMPLEXITY[preferences.difficulty]);
    game.minAge = parseInt(preferences.age);
    game.minPlayers =
      parseInt(preferences.playerCount) - 1 > 0
        ? parseInt(preferences.playerCount) - 1
        : c.MIN_PLAYERS;
    game.maxPlayers = parseInt(preferences.playerCount) + 1;
    game.categories = preferences.categories;
    game.minPlayTime = parseInt(c.MIN_PLAY_TIME[preferences.playTime]);
    game.maxPlayTime = parseInt(c.MAX_PLAY_TIME[preferences.playTime]);
  }

  const feedbackRatingsLen = feedbacks.length;

  if (feedbackRatingsLen > 0) {
    let maxRating = -1;

    for (const feedback of feedbacks) {
      const gameInFeedback = games.find((g) => g.id === feedback.id) || {};

      const ratingValue = feedback.rating;
      maxRating = Math.max(maxRating, ratingValue);

      if (gameInFeedback) {
        game.Types.push(...gameInFeedback.Types);

        if (ratingValue === 0) {
          ratingValue = c.DEFAULT_WEIGHT;
        }

        if (ratingValue !== null) {
          game.complexity += parseFloat(gameInFeedback.complexity) * ratingValue;
          game.minAge += parseInt(gameInFeedback.minAge) * ratingValue;
          game.minPlayers += parseInt(gameInFeedback.minPlayers) * ratingValue;
          game.maxPlayers += parseInt(gameInFeedback.maxPlayers) * ratingValue;
          game.categories.push(...gameInFeedback.categories);
          game.mechanics.push(...gameInFeedback.mechanics);
          game.minPlayTime += parseInt(gameInFeedback.minPlayTime) * ratingValue;
          game.maxPlayTime += parseInt(gameInFeedback.maxPlayTime) * ratingValue;
          game.bestPlayerNumberCommunity += parseInt(
            gameInFeedback.bestPlayerNumberCommunity
          ) * ratingValue;
          game.bggRating += parseFloat(gameInFeedback.bggRating) * ratingValue;
        }
      }
    }

    const feedbackNormalizer = maxRating * feedbackRatingsLen;

    game.categories = Array.from(new Set(game.categories));
    game.mechanics = Array.from(new Set(game.mechanics));
    game.complexity /= feedbackNormalizer;
    game.minAge = Math.round(game.minAge / feedbackNormalizer);
    game.minPlayers = Math.round(game.minPlayers / feedbackNormalizer);
    game.maxPlayers = Math.round(game.maxPlayers / feedbackNormalizer);
    game.minPlayTime = Math.round(game.minPlayTime / feedbackNormalizer);
    game.maxPlayTime = Math.round(game.maxPlayTime / feedbackNormalizer);
    game.bestPlayerNumberCommunity = Math.round(
      game.bestPlayerNumberCommunity / feedbackNormalizer
    );
    game.bggRating /= feedbackNormalizer;
  }

  return game;
}

export function compareToType(instance: any, tcm: TypeComparisonModel): number {
  let sum = 0;

  for (const key in tcm.typesPrecent) {
    const weight = tcm.typesPrecent[key];
    sum += instance.types_b[key] * weight;
  }

  return sum;
}

export function compareToCategory(instance: any, tcm: TypeComparisonModel): number {
  let sum = 0;

  for (const key in tcm.categoriesPrecent) {
    const weight = tcm.categoriesPrecent[key];
    sum += instance.categories_b[key] * weight;
  }

  return sum;
}

export function compareToMechanic(instance: any, tcm: TypeComparisonModel): number {
  let sum = 0;

  for (const key in tcm.mechanicsPrecent) {
    const weight = tcm.mechanicsPrecent[key];
    sum += instance.mechanics_b[key] * weight;
  }

  return sum;
}

export function compareByInterval(min1: number, max1: number, min2: number, max2: number): number {
  if (Math.min(max1, max2) - Math.max(min1, min2) <= 0) {
    return 1;
  }

  return 1 - (Math.min(max1, max2) - Math.max(min1, min2)) / (max1 - min1);
}

export function compareByFloat(
  minValue: number,
  maxValue: number,
  gameValue: number,
  idealGameValue: number
): number {
  const maxDifference = maxValue - minValue;
  const gameDifference = Math.abs(gameValue - idealGameValue);

  return gameDifference / maxDifference;
}
