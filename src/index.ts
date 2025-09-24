export interface StatusRecord {
    status: string;
    date: string;
}

export interface AgendaItem {
    id: number;
    name: string;
    species: string;
    image: string;
    birthDate: string;
    scheduleDates: string[]; 
    status: string;
    history: StatusRecord[];
}