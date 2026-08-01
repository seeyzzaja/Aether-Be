import app from "#app";
import { config } from "#config/env";

app.listen(config.PORT, "0.0.0.0", () => {
  console.log(`Server jalan → http://localhost:${config.PORT}`);
  console.log("Coba buka semua route di atas pakai Postman!");
});
