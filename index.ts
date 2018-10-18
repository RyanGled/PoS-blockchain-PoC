import * as SHA from '../node_modules/sha.js';
import * as moment from '../node_modules/moment';
import { iBlock, Block } from './Interfaces/Block';
import { validatorNode } from './Interfaces/ValidatorNode';

export class PoSBlockchain {

  canonicalChain: Block[];
  validatorNodes: validatorNode[];

  constructor(address: string) {
    let genesisBlock: iBlock = new Block();

    genesisBlock.index = 0;
    genesisBlock.data = 'New sidechain!';
    genesisBlock.prevHash = "";
    genesisBlock.validator = address;
    genesisBlock.timestamp = moment().format();
    genesisBlock.hash = this.calcTotalBlockHash(genesisBlock);

    this.canonicalChain.push(genesisBlock);
    this.addNewValidator(address);
  }
  
  public addNewValidator(address: string): void {
    this.validatorNodes.push(
      new validatorNode(address, this)
    );
  }

  /**
   * Uses previous block hashes to create a new block
   * @param prevBlock Block for merkle trie checks
   * @param blockData Whatever info is stored in the block
   * @param address Address of the block validator (staker)
   */
  public createNewBlock(prevBlock: iBlock, blockData: any, address: string) {

    let proposedBlock: iBlock = new Block();

    proposedBlock.index = prevBlock.index++;
    proposedBlock.timestamp = moment().format();
    proposedBlock.data = blockData;
    proposedBlock.prevHash = prevBlock.hash;
    proposedBlock.hash = this.calcTotalBlockHash(proposedBlock);
    proposedBlock.validator = address;

    if (!this.checkMerkleTrieValidity(this.canonicalChain[this.canonicalChain.length-1], proposedBlock))
      return;
    
    //Create new array *with new ref* to compare canonical chain/fork
    let potentialNewChain = this.canonicalChain.slice();
    potentialNewChain.push(proposedBlock);
    this.replaceOmmersAndCanonicalise(potentialNewChain);
  }

  /**
   * will convert strings to SHA256
   * @param unHashed string
   */
  private calcHash(unHashed: string): string {
    return SHA('sha256')._update(unHashed).digest('hex');
  }

  /**
   * Uses various block properties to calculate an overall hash
   * @param block Mined block
   */
  private calcTotalBlockHash(block: iBlock): string {
    return this.calcHash(block.index.toString() + block.timestamp + block.data.toString() + block.prevHash);
  }

  private checkMerkleTrieValidity(proposedBlock: Block, prevBlock: Block): boolean {
    //Block isn't correctly indexed, there's a block missed or race condition
    if (prevBlock.index++ !== proposedBlock.index)
      return false;

    //Merkle/Patricia failure - child node doesn't match leaf node's hash
    if (prevBlock.hash !== proposedBlock.prevHash)
      return false;

    //Data integrity check
    if (proposedBlock.hash !== this.calcHash(proposedBlock.hash))
      return false;

    return true;
  }

  private replaceOmmersAndCanonicalise(uncleChain: Block[]): void {
    if (uncleChain.length > this.canonicalChain.length)
      this.canonicalChain = uncleChain;
  }

}