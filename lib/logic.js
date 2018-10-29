/*
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/* global getAssetRegistry getFactory emit query */

/**
 * Track the trade of a commodity from one farmer to one trader
 * @param {org1.trading.Trade} tx - the trade to be processed
 * @transaction
 */
async function tradeCommodity(tx) { 

    const contract = tx.shipment.contract;
    const shipment = tx.shipment;
    let payOut = contract.unitPrice * shipment.unitCount;

    console.log('Payout: ' + payOut);

    contract.farmer.accountBalance -= payOut;
    if (contract.farmer.accountBalance < 0) {
        throw new Error('There is not enough ' + shipment.type);
    }

    
    contract.trader.accountBalance += payOut;

    // update the grower's balance
    const farmerRegistry = await getParticipantRegistry('org1.trading.Farmer');
    await farmerRegistry.update(contract.farmer);


    // update the grower's balance
    const traderRegistry = await getParticipantRegistry('org1.trading.Trader');
    await traderRegistry.update(contract.trader);

}

/**
 * Initialize some test assets and participants useful for running a demo.
 * @param {org1.trading.SetupDemo} setupDemo - the SetupDemo transaction
 * @transaction
 */
async function setupDemo(setupDemo) {  // eslint-disable-line no-unused-vars
    console.log('to be continued.');

    const factory = getFactory();
    const NS = 'org1.trading';

    // create the farmer
    const farmer = factory.newResource(NS, 'Farmer', 'F001');
    farmer.firstName = 'David';
    farmer.lastName = 'Mood';
    farmer.post = "001234";
    farmer.accountBalance = 1000;

    // create the trader
    const trader = factory.newResource(NS, 'Trader', 'T001');
    trader.firstName = 'God';
    trader.lastName = 'bird';
    trader.post = "001334";
    trader.accountBalance = 0;

    // create the contract
    const contract = factory.newResource(NS, 'Contract', 'CON_001');
    contract.farmer = factory.newRelationship(NS, 'Farmer', 'F001');
    contract.trader = factory.newRelationship(NS, 'Trader', 'T001');
    const tomorrow = setupDemo.timestamp;
    tomorrow.setDate(tomorrow.getDate() + 1);
    contract.arrivalDateTime = tomorrow; // the shipment has to arrive tomorrow
    contract.unitPrice = 0.5; // pay 50 cents per unit
    contract.amount = 10; // set amount of goods to 10
    
    //create distribution company
    distCompany = factory.newResource(NS, 'DistributionCompany', 'SF SuDi');
    // create the shipment
    const shipment = factory.newResource(NS, 'Shipment', 'SHIP_001');
    shipment.type = 'CABBAGE';
    shipment.unitCount = 500;
    shipment.contract = factory.newRelationship(NS, 'Contract', 'CON_001');
    shipment.distributionCompany = distCompany;
    shipment.status = "MIDWAY";


    // add the farmer
    const farmerRegistry = await getParticipantRegistry(NS + '.Farmer');
    await farmerRegistry.addAll([farmer]);

    // add the trader
    const traderRegistry = await getParticipantRegistry(NS + '.Trader');
    await traderRegistry.addAll([trader]);

    // add the contracts
    const contractRegistry = await getAssetRegistry(NS + '.Contract');
    await contractRegistry.addAll([contract]);

    // add the shipments
    const shipmentRegistry = await getAssetRegistry(NS + '.Shipment');
    await shipmentRegistry.addAll([shipment]);

}
