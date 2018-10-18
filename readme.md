## PoS Chain proof of concept with node allocation
This is a work in progress! The intention is to design a novel PoS Sidechain generator, whereby each Dapp on the network may deploy it's own Sidechain for super-fast TPS & Finality whilst still retaining as much security and protection against Sybil attacks as possible.
Please note: This is purely a learning exercise as well as something I enjoy to tinker with. It will never be intended as production code.

I've chosen NodeJS because it's a language of choice that I have significant experience with. It is also widely-known, increasing in use, and both Frontend/Backend developers are able to contribute. Whilst Node has a single-threaded event loop, all I/O operations are run asynchronously, with it's websocket capabilities allowing for real-time comms. Node lends itself to managing a set of node requests simultaneously with high throughput.
Node also allows for the built-in streaming of data, making it easy for the P2P upkeep of the chains, using some protocol like Flooding (https://en.wikipedia.org/wiki/Flooding_(computer_networking)).
TypeScript allows for compile-time checking of the code to minimise fatal errors at runtime. It also allows for protocol developers accustomed to statically-typed languages to feel more at home.

## TODO

 - [ ] Get a task runner (Gulp, Grunt) working to transpile .ts files to .js
 - [ ] Get Express API endpoints working
 - [ ] Test with Postman
 - [ ] Implement some form of data persistence
 - [ ] Implement a more creative/secure node allocation service as per design doc below;
 - [ ] Write tests for API endpoints and business logic

## Design architecture for PoS chain
Nodes are assigned to a 'DappChain' based purely on fairness - DappChains are considered to be "Live" and their nodes may start mining when they have enough nodes to be pBFT-tolerant. This provides greater liveness and exponentially-greater safety the more nodes join the sidechain, as long as a maximum of (n-1/3) (where n represents number of nodes) are malicious, not live, or faulty simultaneously.

The DappChain administrator themselves will set the number of nodes they consider to be 'safe' (there will also be a hard-limit in place here so they can't block the node re-allocation process indefinitely, please see below. Perhaps you could include a DappChain governance process here whereby DappChains vote for the hard limit to be increased/decreased over time). They must consider that the greater the number of nodes, the less susceptible they will be to Sybil attacks and collusion between groups of nodes, but must balance this with how long it will take their Dapp to gain enough nodes to become live.  
In example, an exchange, trading or financial app might prefer greater security, but a simple game might prefer to become live sooner.  

All nodes will then stake their tokens, staking nodes will be assigned a random NodeID (that will change per epoch), and be asked to provide a random ID themselves in a commit-reveal scheme. This means that whilst nodes can potentially collude to all select the same ID, the randomly assigned NodeID and commit-reveal system means it is impossible for them to collude to pick a 'specific' node for mining repeatedly, and thus they cannot game the system.

After mining, the miner node will start it's journey again and become an unallocated node. This provides a second-layer of protection against collusion because the node pool will be forever-changing. Nodes will then be re-allocated; each Dappchain will receive a new node in turn (based on a 'stack', the first to register their DappChain will be the first to receive a node, then the next, until the loop returns back to the first) UNLESS there are DappChains which have less nodes than the mean of all the Dappchains, in which case all nodes that are existing, but awaiting re-allocation will be allocated to the new DappChain. This means that new DappChains will become 'live' as soon as is possible. 'New' nodes (ie - those that have never mined for any Dappchain previously) are unable to be assigned to non-live DappChains to further prevent sybil attacks. New nodes are therefore only allowed to mine for already-live DappChains.  
  
In order to deploy a DappChain, a large number of tokens must be staked directly proportional to the number of nodes requested before going live. This makes it infeasible for somebody to continuously deploy new DappChains in order to spread Nodes so thinly it brings the network to a halt.  
The large number of tokens staked when deploying the DappChain is split evenly between the ‘first’ set of nodes that successfully achieve liveness for the chain. This not only incentivises nodes to mine (more chance of being lucky and being a ‘deployer’ with the bonus remuneration = more miner/node demand for the chain = more security for the network = more Dapps deployed - it is self-fulfilling and a perfect game theory combination) but also means users are reimbursed for the time they spend inactive whilst the DappChain fills with nodes and becomes live. We could also implement some sort of weighting here in the deployment payout which would favour the first node (and thus the longest-waiting) and be greatly reduced for the last node which makes the chain ‘live’. This means nodes would be paid proportionally as to how long they were ‘waiting’.  
Deployment of more than one Dappchain will be quadratic in cost, so a second Dappchain will cost 400% of the first, the next 900% of the first, then 1600%, and so on.
