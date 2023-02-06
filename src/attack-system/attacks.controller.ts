import { Controller, Get, Req, Param, Body } from '@nestjs/common';
import { AttackService } from './attacks.service';
import { Request } from 'express';

@Controller('attacks')
export class AttackController {
  constructor(private readonly attackService: AttackService) {}

  @Get('allAttacks')
  async getAllAttacks(): Promise<string> {
    return this.attackService.getAllAttacks();
  }

  //@notice
  //returns all outgoing attacks of the player.
  @Get('openPlayerOutgoingAttacks')
  async getAllOpenPlayerAttacks(@Req() request: Request): Promise<any> {
    return this.attackService.getAllOpenPlayerOutgoingAttacks(
      request.query.address,
    );
  }

  @Get('incomingOpenPlanetAttacks')
  async getAllIncomingPlanetAttacks(@Req() request: Request): Promise<any> {
    return this.attackService.getAllIncomingPlanetAttacks(
      request.query.planetId,
    );
  }

  @Get('incomingOpenPlayerAttacks')
  async getAllIncomingPlayerAttacks(@Req() request: Request): Promise<any> {
    return this.attackService.getAllIncomingPlayerAttacks(
      request.query.address,
    );
  }

  @Get('incomingTerraforms')
  async getAllIncomingTerraformers(@Req() request: Request): Promise<any> {
    return await this.attackService.getAllIncomingTerraformers(
      request.query.planetId,
    );
  }

  @Get('currentCraftingShips')
  async getAllCraftsShipsPlanet(@Req() request: Request): Promise<any> {
    return await this.attackService.getAllCraftsShipsPlanet(
      request.query.planetId,
    );
  }

  @Get('currentCraftingBuildings')
  async getAllCraftsBuildingsPlanet(@Req() request: Request): Promise<any> {
    return await this.attackService.getAllCraftsBuildingsPlanet(
      request.query.planetId,
    );
  }

  /*
  @Get('incomingPlanetAttacksResolved')
  async getAllIncomingPlanetAttacksResolved(
    @Param('address') address: string,
  ): Promise<string> {
    return this.attackService.getAllIncomingPlanetAttacksResolved(address);
  }

  @Get('getAllAttacksPlayerResolved')
  async getAllPlayerOutgoingAttacksResolved(
    @Param('address') address: string,
  ): Promise<string> {
    return this.attackService.getAllPlayerOutgoingAttacksResolved(address);
  }
  */
}
