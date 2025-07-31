import { config } from "../config/config.js";

const { allowedOrigins } = config();

export const corsOptions = {
  origin: (origin, callback) => {
    if (!origin) {
      return callback(null, true);
    }

    const cleanOrigin = origin.trim();
    const cleanAllowed = allowedOrigins.map((o) => o.trim());
    const isAllowed = cleanAllowed.includes(cleanOrigin);

    if (isAllowed) {
      return callback(null, true);
    } else {
      if (cleanOrigin.match(/^http:\/\/localhost:\d+$/)) {
        return callback(null, true);
      }

      const error = new Error(
        "CORS policy: No 'Access-Control-Allow-Origin' header is present on the requested resource."
      );
      error.status = 403;
      return callback(error);
    }
  },
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true,
};
