import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Cron, CronExpression } from '@nestjs/schedule';
import * as contractABI from '../abi/minimalAutomationTarget.json';

const ethers = require('ethers');
let moment = require('moment');

let totalPaths = 6;

let currNonce = 9;

@Injectable()
export class BlockCrawler {
  constructor(private config: ConfigService) {}
  private readonly logger = new Logger(BlockCrawler.name);

  private privateKeyResolverWallet =
    this.config.get<string>('PRIVATE_KEY_SHARED');

  private diamondContractAddress = this.config.get<string>('CONTRACT_ADDRESS');

  private provider = new ethers.providers.JsonRpcProvider(
    this.config.get<string>('PROVIDER_RPC'),
  );

  private wallet = new ethers.Wallet(
    this.privateKeyResolverWallet,
    this.provider,
  );

  private deployedContractOptions = new ethers.Contract(
    this.diamondContractAddress,
    contractABI,
    this.provider,
  );
  /*
  currNonce = this.provider.getTransactionCount(
    this.config.get<string>('PUBLIC_ADDR'),
  );
  */
  @Cron(CronExpression.EVERY_1ST_DAY_OF_MONTH_AT_MIDNIGHT)
  async handleCron() {
    let answer;
    let performedResult;
    this.logger.debug('currNonce: ' + currNonce);
    for (let i = 0; i < totalPaths; i++) {
      answer = await this.checkUpKeepPath(i);
      const { 0: bool_path, 1: bytesDataResult } = answer;
      this.logger.debug('current automation path ' + i);
      this.logger.debug(bool_path);
      this.logger.debug(bytesDataResult);

      if (bool_path) {
        performedResult = await this.performUpkeep(bytesDataResult);
      }
    }
  }

  async checkUpKeepPath(pathToCheck) {
    const pathToQuery = ethers.utils.hexZeroPad(
      ethers.utils.hexlify(pathToCheck),
      32,
    );

    const stateResult = await this.deployedContractOptions.checkUpkeep(
      pathToQuery,
    );

    return stateResult;
  }

  async performUpkeep(upkeepBytesData) {
    /*
    const currentNonce = await provider.getTransactionCount(
      '0x420698c552B575ca34F0593915C3A25f77d45b1e',
    );
    this.logger.debug(currentNonce);
    */

    this.logger.debug('attempting performing upkeep');
    const onchainUpkeep = await this.deployedContractOptions
      .connect(this.wallet)
      .performUpkeep(upkeepBytesData, { nonce: currNonce });

    currNonce = onchainUpkeep.nonce + 1; // save this here into DB to know which is the last nonce (easier than messing with getTransactionCount).

    this.logger.debug('performed upkeep, tx data:');

    this.logger.debug(onchainUpkeep);
  }
}
