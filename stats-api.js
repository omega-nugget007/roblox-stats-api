import express from "express";
import cors from "cors";

const app = express();
const PORT = process.env.PORT || 10000;

app.get("/health", (req, res) => res.json({ status: "ok" }));


app.use(express.json());
app.use(cors());

// Stockage des données envoyées par Roblox
let liveStats = {
    playing: 0,
    teams: {},
    updatedAt: null
};

// 🔥 1. Endpoint appelé par TON JEU Roblox
app.post("/ingame-stats", (req, res) => {
    try {
        const body = req.body;

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

// 🔥 2. Endpoint appelé par TON SITE
app.get("/stats", (req, res) => {
    return res.json({
        name: "Nantes RP FR",
        description: "Le jeu roblox Nantes RP officiel.",
        playing: liveStats.playing,
        teams: liveStats.teams,
        updatedAt: liveStats.updatedAt
    });
});

app.listen(PORT, () => {
    console.log(`API NantesRP Stats en ligne sur le port ${PORT}`);
});
