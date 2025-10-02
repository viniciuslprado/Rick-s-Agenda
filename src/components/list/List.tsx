import React from 'react';
import type { AgendaItem } from '../../hooks/useAgenda';

interface ListProps {
    sortedItens: AgendaItem[];
    searchQuery: string;
    setSearchQuery: (query: string) => void;
}

const List: React.FC<ListProps> = ({ sortedItens, searchQuery, setSearchQuery }) => {
    // Filtrar itens baseado na busca
    const filteredItens = sortedItens.filter(item => 
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.status.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.species.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="p-4 sm:p-6">

            {/* Campo de input para a busca de personagens - search-input */}
            <input
                type="text"
                placeholder="Buscar por nome ou status..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}

                // Estilização Tailwind:
                className="w-full max-w-xl mx-auto block
                           py-3 px-5 my-5
                           border border-gray-300
                           rounded-full
                           text-base
                           shadow-md
                           focus:outline-none focus:border-blue-500
                           transition-colors duration-300"
            />

            {/* Contêiner que controla a largura máxima da lista de cards - list-container */}
            <div className="w-full max-w-3xl mx-auto">

                {/* Contêiner que empilha os cards de personagens - item-list */}
                <div className="flex flex-col gap-4 mt-8">

                    {/* Verifica se existem itens na lista */}
                    {filteredItens.length > 0 ? (
                        // Mapeia e renderiza cada item da lista como um card
                        filteredItens.map(item => (

                            // Card do personagem - item-card
                            <div
                                key={item.id}
                                className="bg-white
                                           rounded-xl
                                           shadow-lg
                                           overflow-hidden
                                           flex
                                           items-center
                                           p-4
                                           gap-4
                                           cursor-pointer
                                           transition-transform
                                           hover:-translate-y-1"
                            >
                                {/* Imagem do personagem - item-image */}
                                <img
                                    src={item.image}
                                    alt={item.name}
                                    className="w-20 h-20
                                               rounded-full
                                               object-cover
                                               border-4 border-blue-500
                                               flex-shrink-0"
                                />

                                {/* Contêiner com os detalhes do personagem - item-details */}
                                <div className="flex flex-col items-start text-left flex-grow">

                                    {/* Nome do personagem - item-details h2 (Com truncate para evitar quebra de linha indesejada) */}
                                    <h2 className="text-xl font-semibold my-1 text-blue-700 max-w-full truncate">
                                        {item.name}
                                    </h2>

                                    {/* Detalhes do personagem - item-details p */}
                                    <p className="text-base my-0.5 text-gray-600">
                                        <strong className="font-medium">Espécie:</strong> {item.species}
                                    </p>
                                    <p className="text-base my-0.5 text-gray-600">
                                        <strong className="font-medium">Status:</strong> {item.status}
                                    </p>
                                    <p className="text-base my-0.5 text-gray-600">
                                        <strong className="font-medium">Solicitação:</strong> {new Date(item.birthDate).toLocaleDateString()}
                                    </p>

                                    {/* Mapeia e renderiza todas as datas de agendamento */}
                                    {item.scheduleDates && item.scheduleDates.map((date, index) => (
                                        <p key={index} className="text-base my-0.5 text-gray-600">
                                            <strong className="font-medium">
                                                {/* Exibe um texto diferente para o primeiro agendamento */}
                                                {index === 0 ? 'Agendado para:' : 'Próxima data agendada:'}
                                            </strong>{' '}
                                            {new Date(date).toLocaleDateString()}
                                        </p>
                                    ))}
                                </div>
                            </div>
                        ))
                    ) : (
                        // Se a lista estiver vazia (após a busca ou filtro), exibe uma mensagem
                        <p className="text-center text-gray-500 mt-10 text-lg">Nenhum item encontrado.</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default List;