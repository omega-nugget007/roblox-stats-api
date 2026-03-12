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

        console.log("gameInfo:", gameInfo);

        // Vérification anti-crash
        if (!gameInfo || !gameInfo.data || !gameInfo.data[0]) {
            return res.status(500).json({
                error: "Impossible de récupérer les données Roblox (data vide)",
                raw: gameInfo
            });
        }

        const game = gameInfo.data[0];

        res.json({
            name: game.name,
            description: game.description,
            playing: game.playing,
            maxPlayers: game.maxPlayers,
            visits: game.visits,
            favorites: game.favoritedCount,
            likes: game.likes,
            dislikes: game.dislikes,
            teams: teamsData
        });

    } catch (err) {
        console.error("Erreur /stats :", err);
        res.status(500).json({ error: "Erreur interne API" });
    }
});


// ====== LANCEMENT SERVEUR ======
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log("API NantesRP Stats en ligne sur le port " + PORT);
});

