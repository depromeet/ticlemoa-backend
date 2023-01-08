import { Body, Controller, Delete, Get, Param, ParseIntPipe, Put } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Auth } from 'src/auth/decorator/auth.decorator';
import { UserPayload } from 'src/auth/types/jwt-payload.interface';
import { UserRequest } from 'src/common/decorators/user-request.decorator';
import { ResponseUserDto } from './dto/response-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserService } from './user.service';

@ApiTags('User')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Put()
  @Auth()
  @ApiOperation({ summary: '유저 정보 수정' })
  @ApiOkResponse({ description: '수정된 유저 정보', type: ResponseUserDto })
  async update(@UserRequest() { userId }: UserPayload, @Body() updateUserDto: UpdateUserDto): Promise<ResponseUserDto> {
    return this.userService.update(userId, updateUserDto);
  }

  @Get(':id')
  @ApiOperation({ summary: '특정 유저 정보 가져오기' })
  @ApiOkResponse({ description: '유저 정보', type: ResponseUserDto })
  async findOneById(@Param('id', ParseIntPipe) id: number): Promise<ResponseUserDto | never> {
    return this.userService.findOneByIdOrFail(id);
  }

  @Delete()
  @Auth()
  @ApiOperation({ summary: '유저 탈퇴' })
  @ApiOkResponse({ description: '탈퇴 성공' })
  async delete(@UserRequest() { userId }: UserPayload): Promise<void> {
    await this.userService.delete(userId);
  }
}
