import express from "express";
import fetch from "node-fetch";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

const UNIVERSE_ID = "9266409859";

// Stockage en mémoire (simple mais suffisant pour commencer)
let teamsData = {};

// ====== REÇOIT LES TEAMS DE ROBLOX ======
app.post("/teams", (req, res) => {
    teamsData = req.body || {};
    return res.json({ ok: true });
});

// ====== STATS GLOBALES ======
app.get("/stats", async (req, res) => {
    try {
        const gameInfo = await fetch(
            `https://games.roblox.com/v1/games?universeIds=${UNIVERSE_ID}`
        ).then(r => r.json());

        const game = gameInfo.data[0];

        // playing = joueurs en jeu (Roblox)
        const playing = game.playing;

        res.json({
            name: game.name,
            description: game.description,
            playing,          // nb joueurs en jeu
            maxPlayers: game.maxPlayers,
            visits: game.visits,
            favorites: game.favoritedCount,
            likes: game.likes,
            dislikes: game.dislikes,
            teams: teamsData  // nb joueurs par team (venant de Roblox)
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Erreur API Roblox" });
    }
});

// ====== LANCEMENT SERVEUR ======
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log("API NantesRP Stats en ligne sur le port " + PORT);
});
