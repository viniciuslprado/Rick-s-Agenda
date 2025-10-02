import { useState, useEffect, useMemo } from 'react'; 

// --- Constantes ---
const API_URL = 'https://rickandmortyapi.com/api/character';

// --- Tipagem para a Resposta da API ---
interface RickAndMortyCharacter {
    id: number;
    name: string;
    species: string;
    image: string;
    created: string;
}

// O hook personalizado que gerencia a lógica global do seu projeto
export const useAgenda = () => {
    // --- Estados Globais ---
    const [agendaItens, setAgendaItens] = useState<AgendaItem[]>([]);
    const [currentView, setCurrentView] = useState('list');
    const [searchQuery, setSearchQuery] = useState('');
    const [isLoading, setIsLoading] = useState(true); 
    const [error, setError] = useState<string | null>(null); 

    // --- Efeito para Carregar os Dados ---
    useEffect(() => {
        const fetchItens = async () => {
            setIsLoading(true); 
            setError(null); 
            try {
                const response = await fetch(API_URL);
                const data = await response.json();

                if (data && data.results) {
                    const itensComDados: AgendaItem[] = data.results.map((item: RickAndMortyCharacter, index: number) => ({
                        id: item.id,
                        name: item.name,
                        species: item.species,
                        image: item.image,
                        birthDate: item.created,
                        scheduleDates: [new Date(2025, 8, 17 + index).toISOString()],
                        status: 'Protocolo Agendado',
                        history: [{ status: 'Protocolo Agendado', date: new Date().toISOString() }],
                    }));
                    setAgendaItens(itensComDados);
                }
            } catch (error) {
                console.error("Erro ao buscar dados da API:", error);
                setError("Não foi possível carregar os dados. Tente novamente mais tarde.");
            } finally {
                setIsLoading(false); 
            }
        };
        fetchItens();
    }, []);

    // --- Lógica de Ordenação Otimizada ---
    const sortedItens = useMemo(() => {
        const sorted = [...agendaItens].sort((a, b) => {
            return a.name.localeCompare(b.name); 
        });
        return sorted;
    }, [agendaItens]); 

    // --- Funções de Manipulação de Dados ---

    // Função para adicionar um NOVO item à lista
    const handleAddItem = (newItem: AgendaItem) => {
        setAgendaItens(prevItens => [...prevItens, newItem]);
        setCurrentView('list');
    };

    // Função para atualizar um item existente com novas datas
    const handleUpdateDates = (characterId: number, newDate: string) => {
        setAgendaItens(prevItens =>
            prevItens.map(item =>
                item.id === characterId
                    ? { ...item, scheduleDates: [...item.scheduleDates, newDate] }
                    : item
            )
        );
        setCurrentView('list');
    };

    // --- Retorno do Hook ---
    return {
        agendaItens, 
        currentView, 
        setCurrentView, 
        searchQuery, 
        setSearchQuery, 
        handleAddItem, 
        handleUpdateDates, 
        sortedItens, 
        isLoading, 
        error, 
    };
};

export interface AgendaItem {
    id: number;
    name: string;
    species: string;
    status: string;
    birthDate: string;
    scheduleDates: string[];
    image: string;
    history?: Array<{ status: string; date: string }>;
}