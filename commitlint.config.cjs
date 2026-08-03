module.exports = {
  extends: ["@commitlint/config-conventional"],
  rules: {
    // Naikkan batas agar commit message panjang tetap lolos validasi.
    "header-max-length": [2, "always", 200],
  },
};
