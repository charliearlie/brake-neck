import { IsNumber, IsOptional, IsString } from 'class-validator';
import { Field, InputType } from 'type-graphql';

@InputType()
class ItemValidator {
  @Field()
  @IsString()
  public name: string;

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  public description: string;

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  public imageUrl: string;

  @Field()
  @IsNumber()
  public price: number;
}

export default ItemValidator;
