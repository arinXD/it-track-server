class StatusCode {
    constructor(source) {
        this.statusCode = source["Code"];
        this.description = source["Description"];
    }
    getData() {
        return [this.statusCode, this.description];
    }
    getInsertStatement() {
        const data = this.getData()
        const insertStatement = `INSERT INTO StudentStatuses (id, description) values(?, ?)`;
        const items = [...data, new Date(), new Date()]
        return {
            insertStatement,
            items
        }
    }
}

module.exports = {
    StatusCode
}