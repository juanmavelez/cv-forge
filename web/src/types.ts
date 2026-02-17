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
    title3: FontStyle;
}

export interface SectionLabels {
    summary: string;
    experience: string;
    education: string;
    skills: string;
    languages: string;
    certifications: string;
    present: string;
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
    labels?: SectionLabels;
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

export enum ApplicationStatus {
    Applied = "Applied",
    Interviewing = "Interviewing",
    Rejected = "Rejected",
    Offer = "Offer",
}

export interface Application {
    id: string;
    company: string;
    role: string;
    status: ApplicationStatus;
    salary: string;
    url: string;
    date: string;
    notes: string;
    cvId?: string;
    cvVersionId?: string;
    createdAt: string;
    updatedAt: string;
}

export interface CreateApplicationRequest {
    company: string;
    role: string;
    status: ApplicationStatus;
    salary: string;
    url: string;
    date: string;
    notes: string;
    cvId?: string;
    cvVersionId?: string;
}

export interface UpdateApplicationRequest extends CreateApplicationRequest { }

export function defaultStyle(): StyleConfig {
    return {
        title1: { size: 18, color: [20, 20, 20], bold: false, italic: false },
        title2: { size: 13, color: [78, 107, 138], bold: true, italic: false },
        text1: { size: 11, color: [30, 30, 30], bold: true, italic: false },
        text2: { size: 10, color: [40, 40, 40], bold: false, italic: false },
        sub: { size: 10, color: [80, 80, 80], bold: false, italic: true },
        title3: { size: 14, color: [20, 20, 20], bold: true, italic: false },
    };
}

export function defaultLabels(): SectionLabels {
    return {
        summary: 'Summary',
        experience: 'Professional Experience',
        education: 'Education',
        skills: 'Skills',
        languages: 'Languages',
        certifications: 'Certifications',
        present: 'Present',
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
        labels: defaultLabels(),
    };
}
