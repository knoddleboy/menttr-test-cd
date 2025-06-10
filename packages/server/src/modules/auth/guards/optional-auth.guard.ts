import { ExecutionContext, Injectable } from "@nestjs/common";
import { JwtAuthGuard } from "./jwt-auth.guard";

@Injectable()
export class OptionalAuthGuard extends JwtAuthGuard {
  handleRequest(err, user, info, context: ExecutionContext): any {
    // Continue without throwing if there's no user
    return user || null;
  }
}
