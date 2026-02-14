export interface PersonalInfo {
    firstName: string;
    lastName: string;
    title: string;
    email: string;
    phone: string;
    location: string;
    linkedin: string;
    website: string;
}

export interface Experience {
    company: string;
    title: string;
    location: string;
    startDate: string;
    endDate: string;
    current: boolean;
    description: string;
}

export interface Education {
    institution: string;
    degree: string;
    field: string;
    startDate: string;
    endDate: string;
    description: string;
}

export interface SkillGroup {
    category: string;
    items: string[];
}

export interface Language {
    language: string;
    proficiency: string;
}

export interface Certification {
    name: string;
    issuer: string;
    date: string;
    url: string;
}

export interface FontStyle {
    size: number;
    color: [number, number, number];
    bold: boolean;
    italic: boolean;
}

export interface StyleConfig {
    title1: FontStyle;
    title2: FontStyle;
    text1: FontStyle;
    text2: FontStyle;
    sub: FontStyle;
}

export interface CVData {
    personal: PersonalInfo;
    summary: string;
    experience: Experience[];
    education: Education[];
    skills: SkillGroup[];
    languages: Language[];
    certifications: Certification[];
    style?: StyleConfig;
}

export interface CV {
    id: string;
    title: string;
    data: CVData;
    createdAt: string;
    updatedAt: string;
}

export interface CVVersion {
    id: string;
    cvId: string;
    data: CVData;
    message: string;
    createdAt: string;
}

export interface CVExport {
    title: string;
    data: CVData;
    exportedAt: string;
    versions?: CVVersion[];
}

export function defaultStyle(): StyleConfig {
    return {
        title1: { size: 18, color: [20, 20, 20], bold: false, italic: false },
        title2: { size: 13, color: [78, 107, 138], bold: true, italic: false },
        text1: { size: 11, color: [30, 30, 30], bold: true, italic: false },
        text2: { size: 10, color: [40, 40, 40], bold: false, italic: false },
        sub: { size: 10, color: [80, 80, 80], bold: false, italic: true },
    };
}

export function emptyCVData(): CVData {
    return {
        personal: {
            firstName: '',
            lastName: '',
            title: '',
            email: '',
            phone: '',
            location: '',
            linkedin: '',
            website: '',
        },
        summary: '',
        experience: [],
        education: [],
        skills: [],
        languages: [],
        certifications: [],
        style: defaultStyle(),
    };
}
