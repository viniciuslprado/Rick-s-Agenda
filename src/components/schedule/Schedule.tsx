import React, { useState } from 'react';
import type { AgendaItem } from '../../hooks/useAgenda';

interface ScheduleProps {
    itens: AgendaItem[];
    handleAddItem: (newItem: AgendaItem) => void;
    handleUpdateDates: (characterId: number, newDate: string) => void;
}

// O componente funcional Schedule
const Schedule: React.FC<ScheduleProps> = ({ itens, handleAddItem, handleUpdateDates }) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCharacter, setSelectedCharacter] = useState<AgendaItem | null>(null);
    const [scheduleDate, setScheduleDate] = useState('');

    const filteredCharacters = itens.filter(item =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleSelectCharacter = (character: AgendaItem) => {
        setSelectedCharacter(character);
        setSearchQuery('');
    };

    const handleSchedule = (e: React.FormEvent) => {
        e.preventDefault();
        if (selectedCharacter && scheduleDate) {
            const isExisting = itens.find(item => item.id === selectedCharacter.id);
            
            // Cria a data no formato ISO, adicionando um horário fixo para evitar problemas de fuso horário local.
            const formattedDate = new Date(`${scheduleDate}T12:00:00`).toISOString();
            
            if (isExisting) {
                handleUpdateDates(selectedCharacter.id, formattedDate);
            } else {
                const newItem: AgendaItem = {
                    ...selectedCharacter,
                    scheduleDates: [formattedDate],
                    status: 'Protocolo Agendado',
                    history: [{ status: 'Protocolo Agendado', date: new Date().toISOString() }],
                };
                handleAddItem(newItem);
            }

            setSelectedCharacter(null);
            setScheduleDate('');
        }
    };

    return (
        // Contêiner principal da visualização (tab-content)
        <div className="flex flex-col items-center p-8 bg-white rounded-xl shadow-lg mt-8 min-h-[500px] mx-auto w-full max-w-4xl">
            <div className="w-full max-w-xl flex flex-col items-center">
                
                {/* Seletor de Personagem (Busca) - character-selector */}
                <div className="relative mb-8 w-full">
                    <input
                        type="text"
                        placeholder="Buscar por nome do personagem..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        
                        // Estilização Tailwind (search-input)
                        className="w-full max-w-md mx-auto block 
                                   py-3 px-5 my-5 
                                   border border-gray-300 
                                   rounded-full 
                                   text-base 
                                   shadow-md 
                                   focus:outline-none focus:border-blue-500 
                                   transition-colors duration-300"
                    />
                    
                    {/* Container de Resultados da Busca - search-results */}
                    {searchQuery && filteredCharacters.length > 0 && (
                        <div 
                            className="absolute top-full left-1/2 -translate-x-1/2 
                                       flex flex-col 
                                       gap-2 
                                       w-full max-w-md 
                                       max-h-96 
                                       overflow-y-auto 
                                       border border-gray-200 
                                       rounded-lg 
                                       bg-white 
                                       shadow-xl 
                                       z-10 
                                       mt-1 
                                       p-2 
                                       items-center"
                        >
                            {/* Mapeia e renderiza até 5 resultados da busca */}
                            {filteredCharacters.slice(0, 5).map(character => (
                                // Card de Resultado - search-result-item
                                <div
                                    key={character.id}
                                    className="bg-white 
                                               rounded-lg 
                                               shadow-md 
                                               flex 
                                               items-center 
                                               p-3 
                                               gap-3 
                                               cursor-pointer 
                                               transition-transform 
                                               hover:-translate-y-0.5 
                                               w-full 
                                               max-w-md"
                                    onClick={() => handleSelectCharacter(character)}
                                >
                                    <img 
                                        src={character.image} 
                                        alt={character.name} 
                                        // Estilização Tailwind (search-result-image)
                                        className="w-16 h-16 
                                                   rounded-full 
                                                   object-cover 
                                                   border-3 border-blue-500 
                                                   flex-shrink-0" 
                                    />
                                    <div className="flex flex-col items-start text-left flex-grow min-w-0">
                                        {/* Nome do Personagem */}
                                        <h3 className="text-lg font-semibold my-0.5 text-blue-700 truncate w-full">
                                            {character.name}
                                        </h3>
                                        {/* Detalhes */}
                                        <p className="text-sm my-0.5 text-gray-600">Espécie: {character.species}</p>
                                        <p className="text-sm my-0.5 text-gray-600">Status: {character.status}</p>
                                    </div>
                                </div>
                            ))}
                            {/* Mensagem se houver mais resultados não exibidos */}
                            {filteredCharacters.length > 5 && (
                                <p className="text-center text-sm text-gray-500 mt-2">
                                    Mais {filteredCharacters.length - 5} resultados não exibidos.
                                </p>
                            )}
                        </div>
                    )}
                </div>

                {/* Formulário de Agendamento, exibido apenas se um personagem for selecionado */}
                {selectedCharacter && (
                    <form className="flex flex-col gap-4 w-full max-w-md mt-4" onSubmit={handleSchedule}>
                        
                        {/* Card de exibição do personagem selecionado - selected-character-card */}
                        <div className="flex flex-col items-center text-center bg-gray-100 p-4 rounded-lg shadow-sm">
                            <img 
                                src={selectedCharacter.image} 
                                alt={selectedCharacter.name} 
                                // Estilização Tailwind (selected-character-card img)
                                className="w-24 h-24 
                                           rounded-full 
                                           mb-3 
                                           border-4 border-blue-500 
                                           object-cover" 
                            />
                            <h3 className="m-0 text-2xl font-bold text-blue-700">
                                {selectedCharacter.name}
                            </h3>
                            <p className="mt-1 text-sm text-gray-600">Espécie: {selectedCharacter.species}</p>
                        </div>
                        
                        {/* Campo para selecionar a data do protocolo */}
                        <label className="flex flex-col items-start font-bold">
                            Data do Protocolo:
                            <input
                                type="date"
                                value={scheduleDate}
                                onChange={(e) => setScheduleDate(e.target.value)}
                                required
                                // Estilização Tailwind (schedule-form input[type="date"])
                                className="w-full 
                                           p-2 
                                           border border-gray-300 
                                           rounded-lg 
                                           text-base 
                                           mt-1 
                                           focus:border-green-500 focus:ring-1 focus:ring-green-500"
                            />
                        </label>
                        
                        {/* Botão para enviar o formulário - form-button */}
                        <button 
                            type="submit" 
                            // Estilização Tailwind (form-button)
                            className="py-3 px-5 
                                       bg-green-600 
                                       text-white 
                                       font-bold 
                                       rounded-lg 
                                       cursor-pointer 
                                       text-lg 
                                       hover:bg-green-700 
                                       transition-colors duration-300"
                        >
                            Agendar Protocolo
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
};

export default Schedule;