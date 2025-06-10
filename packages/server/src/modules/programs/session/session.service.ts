import { Injectable } from "@nestjs/common";
import { ScheduleSessionDto } from "./dto/schedule-session.dto";
import { toDateTime } from "./utils/datetime";
import { InjectRepository } from "@nestjs/typeorm";
import { ProgramSession } from "../entities/program-session";
import { DataSource, Repository } from "typeorm";
import { ZoomService } from "./zoom/zoom.service";
import { SessionParticipant } from "../entities/session-participant";
import { differenceInMinutes } from "date-fns";

@Injectable()
export class SessionService {
  constructor(
    private readonly zoomService: ZoomService,
    @InjectRepository(ProgramSession)
    private readonly sessionRepository: Repository<ProgramSession>,
    @InjectRepository(SessionParticipant)
    private readonly sessionParticipantRepository: Repository<SessionParticipant>,
    private readonly dataSource: DataSource,
  ) {}

  async createScheduledSession(hostId: number, dto: ScheduleSessionDto) {
    const startTime = toDateTime(dto.date, dto.startTime);
    const endTime = toDateTime(dto.date, dto.endTime);

    const meeting = await this.zoomService.createMeeting({
      topic: dto.topic,
      agenda: dto.agenda,
      start_time: startTime,
      duration: differenceInMinutes(endTime, startTime),
    });

    console.log(meeting);

    const result = await this.dataSource.transaction(async (manager) => {
      const session = manager.getRepository(ProgramSession).create({
        topic: dto.topic,
        agenda: dto.agenda,
        startTime: startTime,
        endTime: endTime,
        hostId,
        program: { id: dto.programId },
        meetingId: String(meeting.id),
        meetingPassword: meeting.password,
      });

      const savedSession = await manager.save(session);

      const participants = [hostId, ...dto.userIds].map((userId) =>
        manager.getRepository(SessionParticipant).create({
          userId,
          session: savedSession,
        }),
      );

      await manager.save(participants);

      savedSession.participants = participants;
      return savedSession;
    });

    return {
      message: "Session scheduled successfully.",
    };
  }

  async getUserSessions(userId: number) {
    const userSessions = await this.sessionParticipantRepository.find({
      where: [{ userId }],
      relations: ["session", "session.program"],
      order: {
        session: {
          startTime: "asc",
        },
      },
    });

    return userSessions.map((us) => us.session);
  }
}
