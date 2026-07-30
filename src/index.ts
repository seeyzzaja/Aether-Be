import app from "#app";
import { config } from "#config/env";

app.listen(config.PORT, () => {
  console.log(`Server jalan → http://localhost:${config.PORT}`);
  console.log(`Coba buka semua route di atas pakai Postman!`);
});
