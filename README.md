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
   node scheduleMatch.js
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

1. To play the match, replace `instaAccountAccount` address and `EOAAddress` address. Run:

   ```sh
   node playMatch.js
   ```
