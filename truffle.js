/*
 * NB: since truffle-hdwallet-provider 0.0.5 you must wrap HDWallet providers in a 
 * function when declaring them. Failure to do so will cause commands to hang. ex:
 * ```
 * mainnet: {
 *     provider: function() { 
 *       return new HDWalletProvider(mnemonic, 'https://mainnet.infura.io/<infura-key>') 
 *     },
 *     network_id: '1',
 *     gas: 7500000,
 *     gasPrice: 10000000000,
 *   },
 */

module.exports = {
	networks: {
		development: {
			host: "52.37.76.99",
			port: 8545,	
			network_id: '*',
			gas: 6721975 
		}
	},
	solc: {
        	optimizer: {
            		enabled: true,
            		runs: 200
        	}
    	}
};
