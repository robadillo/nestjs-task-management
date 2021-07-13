import { IsEnum } from "class-validator";
import { TaskStatus } from "../task-status.enum";

export class UpdateTakStatusDto {
  @IsEnum(TaskStatus)
  status: TaskStatus;
}