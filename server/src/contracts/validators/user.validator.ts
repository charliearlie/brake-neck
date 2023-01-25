import { IsOptional, IsString } from 'class-validator';
import { Field, InputType } from 'type-graphql';

@InputType()
class UserValidator {
  @Field()
  @IsString()
  public username: string;

  @Field()
  @IsString()
  public email: string;

  @Field({ nullable: true })
  @IsString()
  public firstName: string;

  @Field({ nullable: true })
  @IsString()
  public lastName: string;

  @Field()
  @IsString()
  public password: string;

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  public avatarUrl: string;
}

export default UserValidator;
