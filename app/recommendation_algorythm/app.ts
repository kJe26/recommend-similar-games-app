import { TCM } from './TCM';
import { BoardGameInfos } from './boardGame';
import * as c from './constants';
import {
  compareByFloat,
  compareByInterval,
  compareToType,
  compareToCategory,
  compareToMechanic,
  idealGame,
} from './compare';

app.get('/recommendation', async (req, res) => {
  try {
    const users_from: any[] = JSON.parse(req.query.usersFrom as string);

    const userFeedbacks: any[] = JSON.parse(req.query.userFeedbacks as string);
    const userFeedbackGameIds: number[] = userFeedbacks.map((f) => parseInt(f.id));

    const gamesResponse = await axios.get('http://localhost:3000/sugession-servie/games');
    const categoriesResponse = await axios.get('http://localhost:3000/categories');
    const mechanicsResponse = await axios.get('http://localhost:3000/mechanics');
    const typesResponse = await axios.get('http://localhost:3000/types');

    const games: any[] = gamesResponse.data;
    const categories: any[] = categoriesResponse.data;
    const mechanics: any[] = mechanicsResponse.data;
    const types: any[] = typesResponse.data;

    const gameObjects: BoardGameInfos[] = [];
    const tcm = new TCM(types, categories, mechanics);

    for (const game of games) {
      const gameObject = new BoardGameInfos(game, tcm);
      gameObjects.push(gameObject);

      if (userFeedbackGameIds.includes(parseInt(gameObject.id))) {
        const rating = userFeedbacks.find((f) => parseInt(f.id) === parseInt(gameObject.id))?.rating || 0;

        tcm.addTypeList(gameObject.types, rating);
        tcm.addCategoryList(gameObject.categories, rating);
        tcm.addMechanicList(gameObject.mechanics, rating);
      }
    }

    tcm.calcStatistic();

    let idealGameInstance: BoardGameInfos | null = null;

    for (const gameObject of gameObjects) {
      const typeFit = compareToType(gameObject, tcm);
      const categoryFit = compareToCategory(gameObject, tcm);
      const mechanicFit = compareToMechanic(gameObject, tcm);
    }

    const idlist: number[] = [];
    const priorityQ: { priority: number; id: number }[] = [];

    if (idealGameInstance === null) {
      idealGameInstance = new BoardGameInfos(idealGame(users_from, userFeedbacks, games), tcm);
    }

    for (const gameObject of gameObjects) {
      const typeFit = compareToType(gameObject, tcm);
      const weight = compareByFloat(1, 5, gameObject.complexity, idealGameInstance.complexity);
      const age = compareByInterval(gameObject.minAge, 100, idealGameInstance.minAge, 100);
      const minPlayers = compareByFloat(1, 20, gameObject.minPlayers, idealGameInstance.minPlayers);
      const maxPlayers = compareByFloat(1, 20, gameObject.maxPlayers, idealGameInstance.maxPlayers);
      const categoryFit = compareToCategory(gameObject, tcm);
      const mechanicFit = compareToMechanic(gameObject, tcm);
      const playtime = compareByInterval(
        gameObject.minPlaytime,
        gameObject.maxPlaytime,
        idealGameInstance.minPlaytime,
        idealGameInstance.maxPlaytime
      );
      const bestPlayerNumberCommunity = compareByFloat(
        1,
        20,
        gameObject.bestPlayerNumberCommunity,
        idealGameInstance.bestPlayerNumberCommunity
      );
      const bggRating = compareByFloat(1, 10, gameObject.bggRating, idealGameInstance.bggRating);

      const priority =
        c.C1 * typeFit +
        c.C2 * weight +
        c.C3 * age +
        c.C4 * minPlayers +
        c.C5 * maxPlayers +
        c.C6 * categoryFit +
        c.C7 * mechanicFit +
        c.C8 * playtime +
        c.C9 * bestPlayerNumberCommunity +
        c.C10 * bggRating;

      priorityQ.push({ priority, id: parseInt(gameObject.id) });
    }

    priorityQ.sort((a, b) => b.priority - a.priority);

    for (const game of priorityQ) {
      idlist.push(game.id);
    }

    res.json(idlist.reverse());
  } catch (error) {
    console.error(error);
    res.json(['-1']);
  }
});
