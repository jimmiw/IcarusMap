import bcrypt from "bcrypt";

async function hashPassword(password: string) {
  const hash = await bcrypt.hash(password, 10);
  console.log(`Password: ${password}`);
  console.log(`Hash: ${hash}`);
}

async function main() {
  await hashPassword("");
  await hashPassword("");
}

main();