import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { GoogleGenerativeAI } from "@google/generative-ai";

@Injectable()
export class GeminiService {
    private model;

    constructor(private config: ConfigService) {
        const genAI = new GoogleGenerativeAI (
            this.config.get<string>('GEMINI_API_KEY')!
        );

        this.model = genAI.getGenerativeModel({
            model: 'gemini-1.5-flash',
        });
    }

    async ask(message: string) {
        const result = await this.model.generateContent(message);
        const response = await result.response;
        return response.text();
    }
}