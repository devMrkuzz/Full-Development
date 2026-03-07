import { Injectable } from '@nestjs/common';

@Injectable()
export class RagService {
    private readonly knowledgeBase = [
        {
            keywords: ['tor', 'transcript of records'],
            answer: 'To request a Transcript of Records (TOR), please contact the Registrar\'s Office at registrar@university.edu or call (555) 123-4567.',
        },

        {
            keywords: ['coe', 'certificate of enrollment'],
            answer: 'To request a Certificate of Enrollment (COE), please contact the Registrar\'s Office at registrar@university.edu or call (555) 123-4567.',
        },

        {
            keywords: ['requirement', 'document request'],
            answer: 'For document requests, please visit the Registrar\'s Office or contact them at registrar@university.edu or call (555) 123-4567.',
        },
    ];

    findRelevantAnswer(message: string): string | null {
        const lowerMessage = message.toLowerCase();

        for (const item of this.knowledgeBase) {
            const hasMatch = item.keywords.some((keyword) => lowerMessage.includes(keyword));
            if (hasMatch) {
                return item.answer;
            }
        }

        return null;
    }
}