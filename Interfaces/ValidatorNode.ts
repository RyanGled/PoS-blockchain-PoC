import { PoSBlockchain } from "..";

export interface iValidatorNode {

  //Should this be a hash of the address?
  address: string;
  sidechainAssigned: PoSBlockchain;

}

export class validatorNode implements iValidatorNode {

  address: string;
  sidechainAssigned: PoSBlockchain;

  constructor(address: string, sidechain: PoSBlockchain) { 
    this.address = address;
    this.sidechainAssigned = sidechain;
  }

}