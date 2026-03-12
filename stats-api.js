import express from "express";
import fetch from "node-fetch";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

const UNIVERSE_ID = "9266409859";

// ===== ROUTE : /stats =====
app.get("/stats", async (req, res) => {
    try {
        // 1. Infos générales du jeu
        const gameInfo = await fetch(
            `https://games.roblox.com/v1/games?universeIds=${UNIVERSE_ID}`
        ).then(r => r.json());

        const game = gameInfo.data[0];

        // 2. Liste des serveurs
        const servers = await fetch(
            `https://games.roblox.com/v1/games/${UNIVERSE_ID}/servers/Public?limit=100`
        ).then(r => r.json());

        // 3. Total joueurs
        let totalPlayers = 0;
        servers.data.forEach(s => totalPlayers += s.playing);

        // 4. Teams (si ton jeu les envoie)
        let teams = {};
        try {
            const teamsReq = await fetch("https://nantesrp-teams.kv/api");
            teams = await teamsReq.json();
        } catch {
            teams = {};
        }

        res.json({
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
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Erreur API Roblox" });
    }
});

// ===== LANCEMENT SERVEUR =====
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log("API NantesRP Stats en ligne sur le port " + PORT);
});
