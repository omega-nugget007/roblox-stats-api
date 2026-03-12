export default {
  async fetch(request) {
    const url = new URL(request.url);
    const path = url.pathname;

    const UNIVERSE_ID = "9266409859";

    // ====== ROUTE : /stats ======
    if (path === "/stats") {

      // 1. Stats générales du jeu
      const gameInfo = await fetch(
        `https://games.roblox.com/v1/games?universeIds=${UNIVERSE_ID}`
      ).then(r => r.json());

      const game = gameInfo.data[0];

      // 2. Liste des serveurs
      const servers = await fetch(
        `https://games.roblox.com/v1/games/${UNIVERSE_ID}/servers/Public?limit=100`
      ).then(r => r.json());

      // 3. Calcul du total joueurs
      let totalPlayers = 0;
      servers.data.forEach(s => totalPlayers += s.playing);

      // 4. Récupération des teams (via MessagingService)
      // Le jeu doit envoyer les teams via MessagingService → Worker stocke en mémoire KV
      let teams = {};
      try {
        teams = JSON.parse(await NANTES_TEAMS.get("teams") || "{}");
      } catch {
        teams = {};
      }

      // ====== RÉPONSE ======
      return new Response(JSON.stringify({
        name: game.name,
        description: game.description,
        visits: game.visits,
        favorites: game.favoritedCount,
        likes: game.likes,
        dislikes: game.dislikes,
        playing: game.playing,
        maxPlayers: game.maxPlayers,

        totalPlayers,
        servers: servers.data,
        teams
      }), {
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Content-Type": "application/json"
        }
      });
    }

    return new Response("NantesRP Stats API");
  }
};
