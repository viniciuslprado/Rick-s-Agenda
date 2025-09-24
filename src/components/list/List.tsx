import React from 'react';
import type { AgendaItem } from '../../index'; // Importa a interface AgendaItem para tipagem
import './List.css'; // Importa os estilos CSS específicos para este componente

// Define as propriedades (props) que o componente List irá receber do componente pai (HomePage)
interface ListProps {
  sortedItens: AgendaItem[]; // Recebe uma lista de itens de agenda já ordenada
  searchQuery: string; // Recebe o texto de busca do usuário
  setSearchQuery: (query: string) => void; // Recebe a função para atualizar o estado da busca
}

// O componente funcional List
const List: React.FC<ListProps> = ({ sortedItens, searchQuery, setSearchQuery }) => {
  return (
    // O contêiner principal da visualização de lista
    <div className="tab-content">
      {/* Campo de input para a busca de personagens */}
      <input
        type="text"
        placeholder="Buscar por nome ou status..." // Texto de placeholder
        value={searchQuery} // O valor do input é controlado pelo estado `searchQuery`
        onChange={(e) => setSearchQuery(e.target.value)} // Atualiza o estado da busca ao digitar
        className="search-input" // Classe CSS para estilização
      />
      {/* Contêiner que controla a largura máxima da lista de cards */}
      <div className="list-container">
        {/* Contêiner que empilha os cards de personagens */}
        <div className="item-list">
          {/* Verifica se existem itens na lista */}
          {sortedItens.length > 0 ? (
            // Mapeia e renderiza cada item da lista como um card
            sortedItens.map(item => (
              // Card do personagem, com a chave única `key`
              <div key={item.id} className="item-card">
                {/* Imagem do personagem */}
                <img src={item.image} alt={item.name} className="item-image" />
                {/* Contêiner com os detalhes do personagem */}
                <div className="item-details">
                  {/* Nome do personagem */}
                  <h2>{item.name}</h2>
                  {/* Detalhes do personagem */}
                  <p><strong>Espécie:</strong> {item.species}</p>
                  <p><strong>Status:</strong> {item.status}</p>
                  <p><strong>Solicitação:</strong> {new Date(item.birthDate).toLocaleDateString()}</p>
                  
                  {/* Mapeia e renderiza todas as datas de agendamento */}
                  {item.scheduleDates && item.scheduleDates.map((date, index) => (
                    <p key={index}>
                      <strong>{index === 0 ? 'Agendado para:' : 'Próxima data agendada:'}</strong>{' '}
                      {new Date(date).toLocaleDateString()}
                    </p>
                  ))}
                </div>
              </div>
            ))
          ) : (
            // Se a lista estiver vazia, exibe uma mensagem
            <p>Nenhum item encontrado.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default List;