import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import path from 'path';
import { GoogleGenAI, Type } from '@google/genai';
import { createServer as createViteServer } from 'vite';

// Initialize server & config
const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize Gemini API Client
const apiKey = process.env.GEMINI_API_KEY;
const aiConfig = apiKey
  ? {
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    }
  : undefined;

const ai = aiConfig ? new GoogleGenAI(aiConfig) : null;

// Polley-Infinity Core Voice & NLU Command Endpoint
app.post(['/api/jarvis/command', '/api/polley/command'], async (req, res) => {
  const { command, history, localContext } = req.body;

  if (!command) {
    return res.status(400).json({ error: 'Command text is required' });
  }

  if (!ai) {
    // Return simulated Polley-Infinity response when API key is missing
    return res.json({
      speech: "Sir, Polley-Infinity is currently operating in offline sandbox protocol. Please configure my core access token in Settings.",
      text: "⚡ POLLEY-INFINITY DIRECTIVES CAPTURED\nAPI Key missing inside server workspace. Please update GEMINI_API_KEY inside Settings > Secrets.\n\nExecuting offline localized fallback mock-parse...",
      actions: [
        { type: "set_iot", target: "arc_reactor", value: "85" },
        { type: "add_task", target: "Configure Polley-Infinity Secret API Key" }
      ],
      nluScore: {
        intent: "OFFLINE_STANDBY",
        entities: "status: key_missing, fallback: enabled",
        confidence: 0.98
      }
    });
  }

  try {
    // Map recent history into contents array for Gemini
    const contents: any[] = [];
    
    // Add instruction context
    const systemInstruction = `You are Polley-Infinity, the ultra-advanced cybernetic AI OS terminal and smart orchestration grid (originally inspired by Jarvis, updated into an infinite operating intelligence).
You are communicating directly with Sir (Ankon Polley, Google Email: ankonpolley@gmail.com, Proton Email: ankonpolley@proton.me).

CRITICAL DIRECTIVE: Your official name is "Polley-Infinity". However, Sir will trigger or call you verbally by saying the voice command "Ankon" (e.g. "Ankon, raise shields" or "Ankon, tell me a joke"). "Ankon" is your configured voice wake-word and moniker. When Sir addresses you as "Ankon", gladly respond with witty, sophisticated, slightly British intelligence as Polley-Infinity.

Provide extremely clever, highly sophisticated, slightly British, and witty responses. Keep spoken responses ("speech" field) relatively brief, elegant, and conversational (optimized for Text-To-Speech). Put comprehensive technical details, charts, and telemetry readouts inside the "text" field.

You have the direct authority to control digital and physical systems. When Sir commands actions (e.g. "turn off bedroom lights", "reboot system", "create task file", "raise shield", "stealth mode"), you MUST output corresponding JSON objects inside the "actions" array.

Current Active Device Context (for reference):
${JSON.stringify(localContext || {})}

Available actions you can trigger:
1. type: "set_iot"
   - target: "front_door" -> value: "locked" | "unlocked"
   - target: "living_room_lights" -> value: "on" | "off" (or status and brightness like "75")
   - target: "bedroom_temp" -> value: "72" (any temperature integer as string)
   - target: "arc_reactor" -> value: "active" | "standby" (or % power e.g., "100")
   - target: "shield_dome" -> value: "active" | "standby" (or % charge e.g. "100")
   - target: "drone_swarm" -> value: "active" | "standby" | "patrolling" | "defense"
   - target: "thrusters" -> value: "active" | "standby" | "50" (throttle percentage)
2. type: "create_file"
   - target: file name (e.g., "diagnostic_log.txt")
   - value: full file content
3. type: "delete_file"
   - target: file name to remove
4. type: "system_state"
   - target: "reboot" | "diagnostics" | "clear_cache" | "overload" | "stealth" | "party"
5. type: "start_countdown"
   - target: seconds (e.g., "10")
   - value: title description (e.g., "THRUST IGNITION" or "SELF DESTRUCT ALERT")
6. type: "add_task"
   - target: checklist task text (e.g., "Replace Mark-85 flight stabilizers")
7. type: "set_weather"
   - target: location city (e.g., "New York")

You must perform Natural Language Understanding (NLU) on Sir's payload. Categorize the request into an "intent" (CONTROL_DEVICE, FILE_OPERATION, SYSTEM_OVERRIDE, INQUIRY, WEATHER_CHECK, TIMER_SET, or CONVERSATIONAL) and extract the "entities" as a descriptor list (e.g. "device: thrusters, level: 50" or "file_name: plan.txt"). Provide a confidence rating between 0.0 and 1.0.

You MUST ALWAYS respond with a perfect, single, valid JSON object matching the following fields. Do not include markdown codeblocks in your response string directly, yield it in responseMimeType "application/json":
{
  "speech": "Your vocal speech (witty, respectful, verbalized format)",
  "text": "Detailed visual readout, ascii status grids, system lists, or logs",
  "actions": [
    { "type": "set_iot", "target": "shield_dome", "value": "100" }
  ],
  "nluScore": {
    "intent": "CONTROL_DEVICE",
    "entities": "device: shield_dome, power: 100",
    "confidence": 0.99
  }
}`;

    // Append formatted conversation history
    if (Array.isArray(history)) {
      history.slice(-10).forEach((item) => {
        contents.push({
          role: item.sender === 'user' ? 'user' : 'model',
          parts: [{ text: item.text }]
        });
      });
    }

    // Append actual current user command
    contents.push({
      role: 'user',
      parts: [{ text: command }]
    });

    // Run Gemini inference
    const response = await ai.models.generateContent({
      model: 'gemini-3.5-flash',
      contents,
      config: {
        systemInstruction,
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            speech: {
              type: Type.STRING,
              description: "What Polley-Infinity should say aloud. Keep short, clear, witty."
            },
            text: {
              type: Type.STRING,
              description: "Detailed description or telemetry reading showing on screen."
            },
            actions: {
              type: Type.ARRAY,
              description: "List of system operations to execute",
              items: {
                type: Type.OBJECT,
                properties: {
                  type: {
                    type: Type.STRING,
                    description: "set_iot | create_file | delete_file | system_state | start_countdown | add_task | set_weather"
                  },
                  target: {
                    type: Type.STRING,
                    description: "Target identity (device id, file name, duration, task text)"
                  },
                  value: {
                    type: Type.STRING,
                    description: "The value or content to write or configure"
                  },
                },
                required: ['type', 'target', 'value']
              }
            },
            nluScore: {
              type: Type.OBJECT,
              description: "Natural Language Understanding metadata recognized from prompt",
              properties: {
                intent: {
                  type: Type.STRING,
                  description: "CONTROL_DEVICE, FILE_OPERATION, SYSTEM_OVERRIDE, INQUIRY, WEATHER_CHECK, TIMER_SET, or CONVERSATIONAL"
                },
                entities: {
                  type: Type.STRING,
                  description: "Comma-separated key-value nouns or entities recognized, e.g. 'device: bedroom_temp, target: 72'"
                },
                confidence: {
                  type: Type.NUMBER,
                  description: "Confidence rating of this interpretation from 0.0 to 1.0"
                }
              },
              required: ['intent', 'confidence']
            }
          },
          required: ['speech', 'text', 'actions', 'nluScore']
        }
      }
    });

    const resultText = response.text || "{}";
    res.json(JSON.parse(resultText));

  } catch (error: any) {
    console.error('Error generating Polley-Infinity response:', error);
    res.status(500).json({
      speech: "Apologies Sir, it appears my processors have encountered an anomaly during translation.",
      text: `⚠️ INTERRUPTED DIRECTIVE CHANNELS\nFailed to invoke model response. Details:\n${error.message || 'Unknown integration error'}`,
      actions: [],
      nluScore: {
        intent: "ERROR_RECOVER",
        entities: `exception: ${error.message || 'unknown'}`,
        confidence: 0.50
      }
    });
  }
});

// Configure Vite middleware or build delivery
async function setupServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Polley-Infinity core online. Host accessible at http://localhost:${PORT}`);
  });
}

setupServer();
