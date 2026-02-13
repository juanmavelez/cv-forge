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

export interface CVData {
    personal: PersonalInfo;
    summary: string;
    experience: Experience[];
    education: Education[];
    skills: SkillGroup[];
    languages: Language[];
    certifications: Certification[];
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
    };
}
