import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { PrismaService } from 'src/prisma/prisma.service';
import { ConfigService } from '@nestjs/config';
const ethers = require('ethers');

import * as contractABI from '../abi/minimalAutomationTarget.json';
let moment = require('moment');

@Injectable()
export class AttackCrawler {
  constructor(private prisma: PrismaService, private config: ConfigService) {}
  private readonly logger = new Logger(AttackCrawler.name);

  private diamondContractAddress = this.config.get<string>('CONTRACT_ADDRESS');

  private provider = new ethers.providers.JsonRpcProvider(
    this.config.get<string>('PROVIDER_RPC'),
  );

  private deployedContractOptions = new ethers.Contract(
    this.diamondContractAddress,
    contractABI,
    this.provider,
  );

  @Cron(CronExpression.EVERY_10_SECONDS)
  async handleCron() {
    let currentTotalAttacks =
      await this.deployedContractOptions.getCurrentAttackStorageSize();

    console.log(+currentTotalAttacks);

    let returnedAttack = await this.deployedContractOptions.getAttackStatus(
      +currentTotalAttacks - 1,
    );

    //multicheck
    /*      await deployedContractOptions.getMultipleRunningAttacks(
        0,
        +currentTotalAttacks - 1,
      ); // await
*/

    for (let i = 0; i < +currentTotalAttacks; i++) {
      if (returnedAttack != null && returnedAttack.timeToBeResolved != '0x0') {
        let attackId = returnedAttack.attackInstanceId.toNumber();
        let atkAddr = returnedAttack.attacker.toString();
        let atkStartTime = returnedAttack.attackStarted.toNumber();
        let atkDistance = returnedAttack.distance.toNumber();
        let atkResolveTime = returnedAttack.timeToBeResolved.toNumber();
        let atkFromPlanet = returnedAttack.fromPlanet.toString();
        let atkToPlanet = returnedAttack.toPlanet.toString();

        let attackerShipIds = [];

        for (let i = 0; i < returnedAttack.attackerShipsIds.length; i++) {
          attackerShipIds.push(returnedAttack.attackerShipsIds[i].toNumber());
        }

        const attackToSave = await this.prisma.attack.create({
          data: {
            attackInstanceId: attackId,
            AttackerAddress: atkAddr,
            AttackStartTime: atkStartTime,
            Distance: atkDistance,
            TimeToBeResolved: atkResolveTime,
            FromPlanet: atkFromPlanet,
            ToPlanet: atkToPlanet,
            AttackerShipIds: attackerShipIds,
            AttackSeed: [0],
          },
        });

        this.logger.debug(
          ' attackInstance id: ' +
            attackToSave.attackInstanceId +
            ' saved on: ' +
            attackToSave.createdAt,
        );
      }
    }

    //@TODO terraforming instances

    /*

    
    for (let i = 0; i < +currentTotalAttacks; i++) {
      console.log(returnedAttack[i]);
      if (
        returnedAttack[i] != null &&
        returnedAttack[i].timeToBeResolved != '0x0'
      ) {
        console.log('goes into if');
        let atkAddr = returnedAttack[i].attacker.();
        console.log(atkAddr);
        const attackToSave = await this.prisma.attack.create({
          data: {
            attackInstanceId: 1,
            AttackerAddress: atkAddr,
            AttackStartTime: returnedAttack[i].attackStarted,
            Distance: returnedAttack[i]?.distance,
            TimeToBeResolved: returnedAttack[i]?.timeToBeResolved,
            FromPlanet: returnedAttack[i]?.fromPlanet,
            ToPlanet: returnedAttack[i]?.ToPlanet,
            AttackerShipIds: returnedAttack[i].attackerShipsIds,
            AttackSeed: returnedAttack[i].attackSeed,
          },
        });
      }
    }
    */
  }
}
