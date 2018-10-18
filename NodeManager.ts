import { PoSBlockchain } from './index'
import { validatorNode } from './Interfaces/ValidatorNode';

export class NodeManager {

  sideChains: PoSBlockchain[];
  
  /**
   * Nodemanager will assign new nodes to a sidechain based on number of nodes.
   */
  constructor(address: string) {
    //Genesis creator creates first sideChain, and becomes the first validator.
    this.sideChains.push(this.createNewSideChain(address));
  }

  public createNewSideChain(address: string): PoSBlockchain {
    return new PoSBlockchain(address);
  }

  public joinSideChain(address: string) {
    //Sort by nodeLength, assign fairly
    const sideChainByNodeLength = this.sideChains.sort(this.sortByNodeLength);
    sideChainByNodeLength[0].addNewValidator(address);
  }

  public sortByNodeLength(a: PoSBlockchain, b: PoSBlockchain): number {
    return (a.validatorNodes.length < b.validatorNodes.length) ? -1 : 1; 
  }

}