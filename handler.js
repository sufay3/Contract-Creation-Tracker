var writeToDB = require("./db.js");

var handler = function (web3, mongodb, data, subscription) {
    if (data) {
        web3.eth.getBlock(data.number)
            .then(block => {
                block.transactions.forEach(tx => {
                    web3.eth.getTransactionReceipt(tx)
                        .then(receipt => {
                            writeToDB(mongodb, "ethereum", "contracts", buildContractFromReceipt(receipt));
                        })
                        .catch(err => {
                            console.log(err.message);
                        });
                });
            })
            .catch(err => {
                console.log(err.message);
            });
    }
};

function isContractCreationTx(receipt) {
    return receipt && (receipt.status === true || receipt.status === "0x1" || typeof receipt.status === "undefined") && receipt.contractAddress;
}

function buildContractFromReceipt(receipt) {
    if (isContractCreationTx(receipt)) {
        return {
            address: receipt.contractAddress,
            creator: receipt.from,
            creationTxHash: receipt.transactionHash
        };
    }

    return {};
}

module.exports = handler;
