const crypto = require("crypto");
const util = require("util");

const Repository = require("./repository.js");

const scrypt = util.promisify(crypto.scrypt);

class UsersRepository extends Repository {
  async comparePasswords(existing, given) {
    const [hashed, salt] = existing.split(".");
    const hashSuppliedBuffer = await scrypt(given, salt, 64);

    return hashed === hashSuppliedBuffer.toString("hex");
  }

  async create(credentials) {
    credentials.id = this.randomId();
    // Hash Password
    const salt = crypto.randomBytes(8).toString("hex");
    const hashed = await scrypt(credentials.password, salt, 64);
    //////////////////
    const records = await this.getAll();
    const record = { ...credentials, password: `${hashed.toString("hex")}.${salt}` };
    records.push(record);

    await this.writeAll(records);

    return record;
  }
}

module.exports = new UsersRepository("users.json");
