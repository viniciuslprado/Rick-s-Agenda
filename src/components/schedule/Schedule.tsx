import React, { useState } from 'react'; // Importa a biblioteca React e o hook de estado
import type { AgendaItem } from '../../index'; // Importa a interface AgendaItem para tipagem
import './Schedule.css'; // Importa os estilos CSS específicos para este componente

// Define as propriedades (props) que o componente Schedule irá receber do componente pai (HomePage)
interface ScheduleProps {
  itens: AgendaItem[]; // Recebe a lista de todos os itens da agenda para a busca
  handleAddItem: (newItem: AgendaItem) => void; // Recebe a função para adicionar um novo item (para personagens novos)
  // Adiciona a prop para atualizar itens existentes
  handleUpdateDates: (characterId: number, newDate: string) => void;
}

// O componente funcional Schedule
const Schedule: React.FC<ScheduleProps> = ({ itens, handleAddItem, handleUpdateDates }) => {
  // Estado que armazena o texto digitado na barra de busca
  const [searchQuery, setSearchQuery] = useState('');
  // Estado para armazenar o personagem que foi selecionado na busca
  const [selectedCharacter, setSelectedCharacter] = useState<AgendaItem | null>(null);
  // Estado para armazenar a data de agendamento selecionada no formulário
  const [scheduleDate, setScheduleDate] = useState('');

  // Filtra os personagens da lista com base no texto de busca
  const filteredCharacters = itens.filter(item =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Função chamada ao clicar em um personagem da lista de busca
  const handleSelectCharacter = (character: AgendaItem) => {
    setSelectedCharacter(character); // Define o personagem selecionado
    setSearchQuery(''); // Limpa a barra de busca
  };

  // Função chamada ao enviar o formulário de agendamento
  const handleSchedule = (e: React.FormEvent) => {
    e.preventDefault(); // Impede o recarregamento da página
    // Verifica se há um personagem selecionado e uma data
    if (selectedCharacter && scheduleDate) {
      // Verifica se o personagem já existe na lista
      const isExisting = itens.find(item => item.id === selectedCharacter.id);
      // Corrige a data para evitar problemas de fuso horário
      const formattedDate = new Date(`${scheduleDate}T12:00:00`).toISOString();
      
      if (isExisting) {
        // Se o personagem já existe, chama a função para adicionar uma nova data
        handleUpdateDates(selectedCharacter.id, formattedDate);
      } else {
        // Se o personagem não existe, cria um novo item completo
        const newItem: AgendaItem = {
            ...selectedCharacter,
            // A data é um array agora
            scheduleDates: [formattedDate],
            status: 'Protocolo Agendado',
            history: [{ status: 'Protocolo Agendado', date: new Date().toISOString() }],
        };
        handleAddItem(newItem); // Chama a função para adicionar o novo item na lista global
      }

      setSelectedCharacter(null); // Limpa o personagem selecionado
      setScheduleDate(''); // Limpa a data selecionada
    }
  };

  return (
    // Contêiner principal da visualização
    <div className="tab-content">
      <div className="schedule-form-container">
        
        {/* Seletor de Personagem (Busca) */}
        <div className="character-selector">
          <input
            type="text"
            placeholder="Buscar por nome do personagem..." // Texto de placeholder
            value={searchQuery} // O valor do input é controlado pelo estado `searchQuery`
            onChange={(e) => setSearchQuery(e.target.value)} // Atualiza o estado da busca ao digitar
            className="search-input" // Classe CSS para estilização
          />
          {/* Exibe os resultados da busca apenas se houver texto e itens */}
          {searchQuery && filteredCharacters.length > 0 && (
            <div className="search-results">
              {/* Mapeia e renderiza até 5 resultados da busca */}
              {filteredCharacters.slice(0, 5).map(character => (
                <div
                  key={character.id} // Chave única para cada item
                  className="search-result-item" // Classe CSS para estilização
                  onClick={() => handleSelectCharacter(character)} // Seleciona o personagem ao clicar
                >
                  <img src={character.image} alt={character.name} className="search-result-image" />
                  <div className="search-result-details">
                    <h3>{character.name}</h3>
                    <p>Espécie: {character.species}</p>
                    <p>Status: {character.status}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Formulário de Agendamento, exibido apenas se um personagem for selecionado */}
        {selectedCharacter && (
          <form className="schedule-form" onSubmit={handleSchedule}>
            {/* Card de exibição do personagem selecionado */}
            <div className="selected-character-card">
                <img src={selectedCharacter.image} alt={selectedCharacter.name} />
                <h3>{selectedCharacter.name}</h3>
                <p>Espécie: {selectedCharacter.species}</p>
            </div>
            
            {/* Campo para selecionar a data do protocolo */}
            <label>
              Data do Protocolo:
              <input
                type="date"
                value={scheduleDate}
                onChange={(e) => setScheduleDate(e.target.value)}
                required
              />
            </label>
            
            {/* Botão para enviar o formulário */}
            <button type="submit" className="form-button">
              Agendar Protocolo
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default Schedule;