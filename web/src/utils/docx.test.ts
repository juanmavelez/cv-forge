import { describe, it, expect } from 'vitest';
import { generateDOCX } from './docx';
import { emptyCVData } from '../types';

// Mock Blob since standard Jest environment might not have full Blob support
// but recent jsdom versions do. If fail, we can polyfill.
global.Blob = class Blob {
    content: any[];
    options: any;
    constructor(content: any[], options: any) {
        this.content = content;
        this.options = options;
    }
} as any;

describe('generateDOCX', () => {
    it('generates a Blob for empty data', async () => {
        const data = emptyCVData();
        const blob = await generateDOCX(data);
        expect(blob).toBeDefined();
        // docx library produces a zip file (application/vnd.openxmlformats...)
        // We just verify it returns *something* that looks like a Blob.
        expect(blob).toBeInstanceOf(Blob);
    });

    it('generates a Blob for populated data', async () => {
        const data = emptyCVData();
        data.personal.firstName = "John";
        data.personal.lastName = "Doe";
        data.experience = [{
            company: "Acme",
            title: "Dev",
            location: "NY",
            startDate: "2020-01",
            endDate: "",
            current: true,
            description: "Did stuff",
        }];

        const blob = await generateDOCX(data);
        expect(blob).toBeDefined();
        expect(blob).toBeInstanceOf(Blob);
    });
});
