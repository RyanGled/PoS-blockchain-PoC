export interface iBlock {

  index: number;
  timestamp: string;
  data: any;
  hash: string;
  prevHash: string;
  validator: string;

}

export class Block implements iBlock {

  index: number;
  timestamp: string;
  data: any;
  hash: string;
  prevHash: string;
  validator: string;

  constructor() { }

}