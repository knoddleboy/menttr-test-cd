import { ConfigService } from "@nestjs/config";
import { Injectable } from "@nestjs/common";
import * as crypto from "crypto";

@Injectable()
export class EncryptionService {
  private readonly algorithm = "aes-256-gcm";
  private readonly key: Buffer;

  constructor(private readonly configService: ConfigService) {
    const base64Key = configService.getOrThrow<string>(
      "MESSAGE_ENCRYPTION_KEY",
    );

    this.key = Buffer.from(base64Key.replace(/^base64:/, ""), "base64");

    if (this.key.length !== 32) {
      throw new Error(
        "Invalid encryption key length. Must be 32 bytes (256 bits)",
      );
    }
  }

  encrypt(plainText: string): {
    encrypted: string;
    iv: string;
    authTag: string;
  } {
    const iv = crypto.randomBytes(12);
    const cipher = crypto.createCipheriv(this.algorithm, this.key, iv);

    let encrypted = cipher.update(plainText, "utf8", "base64");
    encrypted += cipher.final("base64");
    const authTag = cipher.getAuthTag();

    return {
      encrypted,
      iv: iv.toString("base64"),
      authTag: authTag.toString("base64"),
    };
  }

  decrypt(encrypted: string, ivBase64: string, authTagBase64: string): string {
    const iv = Buffer.from(ivBase64, "base64");
    const authTag = Buffer.from(authTagBase64, "base64");
    const decipher = crypto.createDecipheriv(this.algorithm, this.key, iv);
    decipher.setAuthTag(authTag);

    let decrypted = decipher.update(encrypted, "base64", "utf8");
    decrypted += decipher.final("utf8");
    return decrypted;
  }
}
