import { Injectable } from '@nestjs/common';
import { knowledgeBase } from './knowledge-base'

@Injectable()
export class RagService {

    findRelevantAnswer(question: string): string | null {
        const lowerQuestion = question.toLowerCase();

        for (const item of knowledgeBase) {
            for (const keyword of item.keywords) {
                if (lowerQuestion.includes(keyword)) {
                    return item.answer;
                }
            }
        }
            return null;
    }
}