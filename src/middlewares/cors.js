import { config } from "../config/config.js";

const { allowedOrigins } = config();

export const corsOptions = {
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);

    const isAllowed = allowedOrigins.some((allowed) =>
      origin.startsWith(allowed)
    );

    if (isAllowed) {
      return callback(null, true);
    } else {
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
