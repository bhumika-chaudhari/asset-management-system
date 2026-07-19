const crypto = require("crypto");

function generateHash(data) {
    return crypto
        .createHash("sha256")
        .update(data)
        .digest("hex");
}

module.exports = {
    generateHash,
};

//this code convert any value 
//It converts any text into a SHA256 hash.
/*
Example

generateHash("Hello")

returns

185f8db32271fe25...
*/