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
}