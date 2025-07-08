import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";

// Initialize all advanced AI engines
import { aiAutoMixingEngine } from "./ai-auto-mixing-engine";
import { spatialAudioEngine } from "./spatial-audio-engine";
import { aiVoiceSynthesisEngine } from "./ai-voice-synthesis-engine";
import { vrStudioEngine } from "./vr-studio-engine";
import { blockchainNFTEngine } from "./blockchain-nft-engine";
import { productionOptimizationEngine } from "./production-optimization-engine";
import { enterpriseSecurityEngine } from "./enterprise-security-engine";
import { professionalInstrumentsEngine } from "./professional-instruments-engine";
import { premiumVideoCreatorEngine } from "./premium-video-creator-engine";
import { ultraImageCreatorEngine } from "./ultra-image-creator-engine";
import { socialMediaSamplingEngine } from "./social-media-sampling-engine";
import { interactiveDJVotingEngine } from "./interactive-dj-voting-engine";
import { professionalVideoEngine } from "./professional-video-engine";
import "./database-migration-fix";

const app = express();

// Configure CORS for development
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  
  if (req.method === 'OPTIONS') {
    res.sendStatus(200);
  } else {
    next();
  }
});

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }

      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "…";
      }

      log(logLine);
    }
  });

  next();
});

(async () => {
  const server = await registerRoutes(app);

  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    res.status(status).json({ message });
    throw err;
  });

  // importantly only setup vite in development and after
  // setting up all the other routes so the catch-all route
  // doesn't interfere with the other routes
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }

  // ALWAYS serve the app on port 5000
  // this serves both the API and the client.
  // It is the only port that is not firewalled.
  const port = 5000;
  server.listen({
    port,
    host: "0.0.0.0",
    reusePort: true,
  }, () => {
    log(`serving on port ${port}`);
  });
})();
