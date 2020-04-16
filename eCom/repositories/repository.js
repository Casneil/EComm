const fs = require("fs");
const crypto = require("crypto");

module.exports = class Repository {
  constructor(filename) {
    if (!filename) {
      throw new Error("Filename Required upon creating a repository");
    }

    this.filename = filename;
    try {
      fs.accessSync(this.filename);
    } catch (error) {
      fs.writeFileSync(this.filename, "[]");
    }
  }
  async create(credentials) {
    credentials.id = this.randomId();
    const records = await this.getAll();
    records.push(credentials);
    await this.writeAll(records);

    return credentials;
  }

  async getAll() {
    // Open the file this.fileName
    return JSON.parse(await fs.promises.readFile(this.filename, { encoding: "utf8" }));
  }

  async writeAll(records) {
    // Write the updated records back to file
    await fs.promises.writeFile(this.filename, JSON.stringify(records, null, 2));
  }

  randomId() {
    return crypto.randomBytes(6).toString("hex");
  }

  async getOne(id) {
    const records = await this.getAll();
    return records.find((record) => record.id === id);
  }

  async getOneBy(credential) {
    const records = await this.getAll();

    for (let record of records) {
      let found = true;

      for (let key in credential) {
        if (record[key] !== credential[key]) {
          found = false;
        }
      }
      if (found) {
        return record;
      }
    }
  }

  async update(id, credentials) {
    const records = await this.getAll();
    const record = records.find((record) => record.id === id);

    if (!record) {
      throw new Error(`Record id: ${id} not found!`);
    }

    Object.assign(record, credentials);
    await this.writeAll(records);
  }

  async delete(id) {
    const records = await this.getAll();
    const filteredRecords = records.filter((record) => record.id !== id);
    await this.writeAll(filteredRecords);
  }
};
