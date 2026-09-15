const fs = require("fs");

const result = JSON.parse(
  fs.readFileSync("sca-result.json", "utf8")
);

console.log("================================");
console.log("      VALIDACION SCA AULAPAY");
console.log("================================");
console.log("Dependencia:", result.dependency);
console.log("Version encontrada:", result.version);
console.log("Version corregida:", result.fixed_version);
console.log("Severidad:", result.severity);
console.log("CVE:", result.vulnerability);
console.log("");

function versionToNumber(version) {
  return version
    .split(".")
    .map(Number)
    .reduce((acc, value) => acc * 1000 + value, 0);
}

const current = versionToNumber(result.version);
const fixed = versionToNumber(result.fixed_version);

if (current < fixed) {
  console.error("FALLO: existe una version vulnerable.");
  console.error(
    `Actualizar ${result.dependency} de ${result.version} a ${result.fixed_version}`
  );

  process.exit(1);
}

console.log("OK: dependencia actualizada a una version corregida.");
process.exit(0);