const express = require('express');
const router = express.Router();

const {FileSystemWallet, Gateway, X509WalletMixin} = require('fabric-network');
const path = require('path');
var handler = require('./sessionKeyHandler');
const ccpPath = path.resolve(__dirname, '..', '..', '..', 'Blockchain-Network', 'first-network', 'connection-org1.json');


const mongoose = require('mongoose');

const mongoURI = `mongodb://127.0.0.1:27017/EHR`;
const conn = mongoose.createConnection(mongoURI);

let databaseHandler = require("./accessDocumentDatabase");
var upload = require('./uploadFile');


router.post('/', upload.single('file'), async (req, res) => {

    try {
        let publicId = "";
        console.log(req.body);
        console.log(req.file);

        if (req.file.filename) {
            publicId = await databaseHandler.updateDocumentIntoDatabase(req.body.patientId, "MedicineReceipt", req.file.filename,req.file.path);
            console.log(publicId);
            req.body.medicineReceiptId = publicId;
            req.body.record = req.file.md5;

            let sessionKeyExists = await handler.verifySessionKey(req.body.pharmacyId, req.body.sessionKey);
            if (!sessionKeyExists) {
                await databaseHandler.removeDocumentFromDatabase(req.body.patientId, "MedicineReceipt", publicId);
                res.send("Incorrect");
            } else {
                const walletPath = path.join(process.cwd(), '../wallet');
                const wallet = new FileSystemWallet(walletPath);

                // Create a new gateway for connecting to our peer node.
                const gateway = new Gateway();
                await gateway.connect(ccpPath, {
                    wallet,
                    identity: req.body.pharmacyId,
                    discovery: {enabled: true, asLocalhost: true}
                });

                // Get the network (channel) our contract is deployed to.
                const network = await gateway.getNetwork('mychannel');

                // Get the contract from the network.
                const contract = network.getContract('EHR');

                // Submit the specified transaction.
                let response = await contract.submitTransaction('generateMedicineReceipt', JSON.stringify(req.body));
                response = JSON.stringify(response.toString());
                console.log(response);

                // Disconnect from the gateway.
                await gateway.disconnect();

                res.send("Correct");
            }
        } else {
            res.send("Failed to upload the Medicine Receipt");
        }
    } catch (error) {
        console.error(`Failed to generate MedicineReceipt by Pharmacy ${req.body.userName}: ${error}`);
        res.send("Failed to generate MedicineReceipt");
    } finally {
        conn.close();
    }
});

module.exports = router;
