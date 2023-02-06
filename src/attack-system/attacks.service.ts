import { Injectable, Logger } from '@nestjs/common';
import { prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { ConfigService } from '@nestjs/config';
const ethers = require('ethers');
import * as contractABI from '../abi/minimalAutomationTarget.json';
var moment = require('moment');

//@TODO get UNIX Timestamp in Seconds. Compare if this has already happened + 60 seconds to see if it is already "resolved"
//@notice issue being if the second tx hasnt been triggered yet, thats technically false.

//@notice we would have to ping the stored attack on-chain to see if it has been triggered, but imho thats overkill for alpha round 1
//@notice with a local node that would look different, but with a hosted rpc thats just cumbersome to deal with.

//@TODO some placeholders for proper caching system.  ( too resource intensive for alpha / non local node)

@Injectable()
export class AttackService {
  constructor(private prisma: PrismaService, private config: ConfigService) {}

  private readonly logger = new Logger(AttackService.name);

  private diamondContractAddress = this.config.get<string>('CONTRACT_ADDRESS');

  private provider = new ethers.providers.JsonRpcProvider(
    this.config.get<string>('PROVIDER_RPC'),
  );

  getAllAttacks(): string {
    return 'Hello World!';
  }

  async getAllOpenPlayerOutgoingAttacks(address): Promise<any> {
    console.log(address);
    const loadedAttacks = this.prisma.attack.findMany({
      where: { AttackerAddress: { equals: address } },
    });
    return loadedAttacks;
  }

  async getAllIncomingPlanetAttacks(planetId): Promise<any> {
    const loadedAttacks = await this.prisma.attack.findMany({
      where: { ToPlanet: { equals: planetId } },
    });
    return loadedAttacks;
  }

  //@TODO can be replaced with a simple DB Query same with attacks [OPTIMIZATION][REQUIRES LOCAL NODE]
  async getAllCraftsShipsPlanet(planetId): Promise<any> {
    const deployedContractOptions = new ethers.Contract(
      this.diamondContractAddress,
      contractABI,
      this.provider,
    );

    let currentCrafting = await deployedContractOptions.getCraftFleets(
      planetId,
    );

    /*
    let finishTime = moment
      .unix(currentCrafting.readyTimestamp.toNumber())
      .toDate();
    */
    let finishTime = currentCrafting.readyTimestamp.toNumber();
    let currPlanetId = currentCrafting.planetId.toNumber();
    let amount = currentCrafting.amount.toNumber();
    let shipTypeId = currentCrafting.itemId.toNumber();

    let currCraft = { finishTime, currPlanetId, amount, shipTypeId };

    console.log('chain response:');
    console.log(currentCrafting);
    console.log('cleaned:');
    console.log(currCraft);
    return currCraft;
  }

  //@TODO can be replaced with a simple DB Query same with attacks [OPTIMIZATION][REQUIRES LOCAL NODE]
  async getAllCraftsBuildingsPlanet(planetId): Promise<any> {
    const deployedContractOptions = new ethers.Contract(
      this.diamondContractAddress,
      contractABI,
      this.provider,
    );

    let currentCrafting = await deployedContractOptions.getCraftBuildings(
      planetId,
    );

    /*
    let finishTime = moment
      .unix(currentCrafting.readyTimestamp.toNumber())
      .toDate();
    */
    let finishTime = currentCrafting.readyTimestamp.toNumber();
    let currPlanetId = currentCrafting.planetId.toNumber();
    let amount = currentCrafting.amount.toNumber();
    let buildingTypeId = currentCrafting.itemId.toNumber();

    let currCraft = { finishTime, currPlanetId, amount, buildingTypeId };

    console.log('chain response:');
    console.log(currentCrafting);
    console.log('cleaned:');
    console.log(currCraft);
    return currCraft;
  }

  //@TODO can be replaced with a simple DB Query same with attacks [OPTIMIZATION][REQUIRES LOCAL NODE]
  async getAllIncomingTerraformers(planetId): Promise<any> {
    //@TODO to be moved to config (Same as block crawler)

    const deployedContractOptions = new ethers.Contract(
      this.diamondContractAddress,
      contractABI,
      this.provider,
    );

    let incomingTerraformReturn =
      await deployedContractOptions.showIncomingTerraformersPlanet(planetId);

    let instanceId = incomingTerraformReturn[0].instanceId.toNumber();
    let fromPlanetId = incomingTerraformReturn[0].fromPlanetId.toNumber();
    let toPlanetId = incomingTerraformReturn[0].toPlanetId.toNumber();
    let shipId = incomingTerraformReturn[0].fleetId.toNumber();
    let arrivalTime = incomingTerraformReturn[0].arrivalTime.toNumber();
    let startTime = incomingTerraformReturn[0].timestamp.toNumber();
    let incomingTerraform = {
      instanceId,
      fromPlanetId,
      toPlanetId,
      shipId,
      arrivalTime,
      startTime,
    };

    console.log('------------------------');
    console.log(incomingTerraformReturn);
    console.log('------------------------');
    console.log(incomingTerraform);
    console.log('------------------------');
    return incomingTerraform;
  }

  //@TODO can be replaced with a simple DB Query same with attacks [OPTIMIZATION][REQUIRES LOCAL NODE]
  getAllIncomingPlayerAttacks(address): Promise<any> {
    console.log(
      'need view function to check defender addr. given that its fluid, not quite useful, so might as well leave it for now.',
    );
    const loadedAttacks = this.prisma.attack.findMany({
      where: { AttackerAddress: { equals: address } },
    });
    return loadedAttacks;
  }

  //@TODO can be replaced with a simple DB Query same with attacks [OPTIMIZATION][REQUIRES LOCAL NODE]
  getAllIncomingPlanetAttacksResolved(address): string {
    return 'Hello World!';
  }
  //@TODO can be replaced with a simple DB Query same with attacks [OPTIMIZATION][REQUIRES LOCAL NODE]
  getAllPlayerOutgoingAttacksResolved(address): string {
    return 'Hello World!';
  }
}
