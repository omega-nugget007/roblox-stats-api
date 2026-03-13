// stats-api.js
import express from "express";
import cors from "cors";

const app = express();
const PORT = process.env.PORT || 10000;

// Pour accepter du JSON
app.use(express.json());
app.use(cors());

// Stockage en mémoire des stats envoyées par le jeu
let liveStats = {
    playing: 0,
    teams: {},
    updatedAt: null
};

// Endpoint appelé par TON JEU Roblox (HttpService:PostAsync)
app.post("/ingame-stats", (req, res) => {
    try {
        const body = req.body;

        // Sécurité minimale : vérifier la structure
        if (!body || typeof body.playing !== "number" || typeof body.teams !== "object") {
            return res.status(400).json({ error: "Payload invalide" });
        }

        liveStats = {
            playing: body.playing,
            teams: body.teams,
            updatedAt: new Date().toISOString()
        };

        return res.json({ status: "ok" });
    } catch (err) {
        console.error("Erreur /ingame-stats :", err);
        return res.status(500).json({ error: "Erreur interne" });
    }
});

// Endpoint consommé par ton panel (GET)
app.get("/stats", (req, res) => {
    try {
        // Tu peux enrichir ici avec d'autres infos (nom du jeu, etc. en dur)
        return res.json({
            name: "Nantes RP FR",
            description: "Le jeu roblox Nantes RP officiel.",
            playing: liveStats.playing,
            teams: liveStats.teams,
            updatedAt: liveStats.updatedAt
        });
    } catch (err) {
        console.error("Erreur /stats :", err);
        return res.status(500).json({ error: "Erreur interne" });
    }
});

app.listen(PORT, () => {
    console.log(`API NantesRP Stats en ligne sur le port ${PORT}`);
});
