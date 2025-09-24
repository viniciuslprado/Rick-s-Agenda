import { useState, useEffect, useMemo } from 'react'; // Importa os hooks necessários para o componente
import type { AgendaItem } from '../index'; // Importa a interface para a tipagem dos objetos de agenda

// O hook personalizado que gerencia a lógica global do seu projeto
export const useAgenda = () => {
    // --- Estados Globais ---
    // Estado principal que armazena a lista completa de todos os itens da agenda.
    // Ele começa como uma lista vazia.
    const [agendaItens, setAgendaItens] = useState<AgendaItem[]>([]);
    // Estado que controla qual visualização está ativa ('list', 'calendar', 'agendar').
    const [currentView, setCurrentView] = useState('list');// O valor inicial é 'list'.
    const [searchQuery, setSearchQuery] = useState('');// Estado que armazena o texto digitado na barra de busca.
    const [isLoading, setIsLoading] = useState(true); // Adiciona um estado de carregamento
    const [error, setError] = useState<string | null>(null); // Adiciona um estado de erro

    // A lógica de ordenação foi simplificada para apenas ordenar por nome
    // const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc'); <-- Removido para simplificar

    // --- Efeito para Carregar os Dados ---
    // O 'useEffect' executa a função de busca de dados apenas uma vez,
    // quando o componente é montado (graças ao array de dependências vazio []).
    useEffect(() => {
        const fetchItens = async () => {
            setIsLoading(true); // Inicia o carregamento
            setError(null); // Limpa erros anteriores
            try {
                // Faz a requisição para a API do Rick and Morty.
                const response = await fetch('https://rickandmortyapi.com/api/character');
                const data = await response.json();

                if (data && data.results) {
                    // Mapeia os resultados da API para o formato da sua interface 'AgendaItem'.
                    // Cada personagem da API se torna um 'item' na sua lista.
                    const itensComDados = data.results.map((item: any, index: number) => ({
                        id: item.id,
                        name: item.name,
                        species: item.species,
                        image: item.image,
                        birthDate: item.created,
                        // Adiciona uma data inicial, mas como array
                        scheduleDates: [new Date(2025, 8, 17 + index).toISOString()],
                        status: 'Protocolo Agendado',
                        history: [{ status: 'Protocolo Agendado', date: new Date().toISOString() }],
                    }));
                    // Atualiza o estado principal 'agendaItens' com os dados da API.
                    setAgendaItens(itensComDados);
                }
            } catch (error) {
                console.error("Erro ao buscar dados da API:", error);
                setError("Não foi possível carregar os dados. Tente novamente mais tarde.");
            } finally {
                setIsLoading(false); // Finaliza o carregamento
            }
        };
        fetchItens();
    }, []);

    // --- Lógica de Ordenação Otimizada ---
    // O 'useMemo' é um hook de otimização. Ele memoriza a lista ordenada e só
    // a recalcula se 'agendaItens' mudar, ordenando de A-Z.
    const sortedItens = useMemo(() => {
        const sorted = [...agendaItens].sort((a, b) => {
            return a.name.localeCompare(b.name); // Ordena de A-Z
        });
        return sorted;
    }, [agendaItens]); // Dependência apenas de 'agendaItens'

    // --- Funções de Manipulação de Dados ---

    // Função para adicionar um NOVO item à lista
    const handleAddItem = (newItem: AgendaItem) => {
        setAgendaItens(prevItens => [...prevItens, newItem]);
        setCurrentView('list');
    };

    // <-- Esta função foi adicionada para atualizar um item existente com novas datas
    const handleUpdateDates = (characterId: number, newDate: string) => {
        setAgendaItens(prevItens =>
            prevItens.map(item =>
                item.id === characterId
                    ? { ...item, scheduleDates: [...(item.scheduleDates || []), newDate] }
                    : item
            )
        );
        setCurrentView('list');
    };

    // --- Retorno do Hook ---
    // O hook retorna um objeto com todos os estados e funções que os componentes
    // da sua aplicação precisam para funcionar.
    return {
        agendaItens, // A lista completa de dados, sem filtro ou ordenação.
        currentView, // Controla qual visualização está ativa ('list', 'calendar', 'schedule').
        setCurrentView, // Função para mudar a visualização.
        searchQuery, // Armazena o texto que o usuário digitou na busca.
        setSearchQuery, // Função que atualiza o texto da busca.
        handleAddItem, // Função para adicionar um novo item à agenda.
        handleUpdateDates, // Função para adicionar uma nova data a um item já existente.
        sortedItens, // A lista de itens já ordenada, pronta para ser usada.
        isLoading, // Um estado booleano que indica se os dados estão a ser carregados.
        error, // Uma string que contém uma mensagem de erro caso a requisição falhe.
    };
};