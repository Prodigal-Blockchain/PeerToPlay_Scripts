## Installation

1. Clone the repository:

   ```sh
   git clone https://github.com/Prodigal-Blockchain/PeerToPlay_Scripts.git
   cd PeerToPlay_Scripts
   ```

   ## Environment Setup

1. Create a `.env` file in the root directory and update it with your environment variables. For example:

   ```ini
   ETH_NODE_URL=<replace with valid alchemy or infura url>
   PRIVATE_KEY=<replace with valid wallet private key>
   ```

1. To create a proxy account, run the following command:

   ```sh
   node build.js
   ```

1. Player can register himself for the game by running the following command. Relace
   const instaAccountAddress=
   const EOAAddress =
   and run node RegisterPlayer.js

1. Once players registered, we can create team,replace instaAccount address.EOA address
   give name for team const teamName= and replace tokenIds in createTeam method call
   run node createTeam.js

1. Now we can schedule match, replace instaAccount address.EOA address

const teamId = add teamId;
const location = "Place name";
const fee = match fee;
const startTime = "start time; //EPOC Timestamp https://www.epochconverter.com/
const matchType = match type ; //dummy variable for future use in setting any configurations(ex:1)
run node schedulematch.js

1. Players have to pay match fee
   replace instaAccount address, eoa address
   run node payMatchFee.js

match can only be started once the all players have paid the fees.

1. to play match replace instaAccount address and eoa address.Only owner can start the match.
   run node playMatch.js

# PeerToPlay Scripts

## Installation

1. Clone the repository:

   ```sh
   git clone https://github.com/Prodigal-Blockchain/PeerToPlay_Scripts.git
   cd PeerToPlay_Scripts
   ```

## Environment Setup

1. Create a `.env` file in the root directory and update it with your environment variables. For example:

   ```ini
   ETH_NODE_URL=<replace with valid Alchemy or Infura URL>
   PRIVATE_KEY=<replace with valid wallet private key>
   ```

1. To create a proxy account, run the following command:

   ```sh
   node build.js
   ```

## Player Registration

1. To register as a player for the game, run the following command:

   ```sh
   node RegisterPlayer.js
   ```

   Make sure to replace the following variables:

   - `instaAccountAddress`
   - `EOAAddress`

## Team Creation

1. Once players are registered, teams can be created. Replace `instaAccountAddress` address and `EOAAddress` address,
   provide a name for the team with `const teamName`, and replace `tokenIds` in the `createTeam` method call.
   Run:

   ```sh
   node createTeam.js
   ```

## Match Scheduling

1. Schedule a match by running the following command:

   ```sh
   node schedulematch.js
   ```

   Make sure to replace the following variables:

   - `instaAccountAddress`
   - `EOAAddress`
   - `teamId`
   - `location`
   - `fee`
   - `startTime` (Epoch Timestamp, see: [Epoch Converter](https://www.epochconverter.com/))
   - `matchType` (dummy variable for future use in setting any configurations, e.g., 1)

## Match Fee Payment

1. Players must pay the match fee. Replace `instaAccountAddress` address and `EOAAddress` address. Run:

   ```sh
   node payMatchFee.js
   ```

   Note: The match can only be started once all players have paid the fees.

## Playing the Match

1. To play the match, replace `instaAccountAccount` address and `EOAAddress` address. Only the owner can start the match. Run:

   ```sh
   node playMatch.js
   ```
