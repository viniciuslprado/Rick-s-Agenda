import { useAgenda } from '../hooks/useAgenda'; // Importa o hook de lógica para gerenciar o estado global
import Calendar from '../components/calendar/Calendar'; // Importa o componente de calendário
import List from '../components/list/List'; // Importa o componente de lista
import Schedule from '../components/schedule/Schedule'; // Importa o componente de agendamento
import '../App.css'; // Importa os estilos globais da aplicação

// O componente principal da página
function HomePage() {
    // Chama o hook e desestrutura os valores e funções que ele retorna.
    // O hook é responsável por toda a lógica de dados.
    const {
        agendaItens, // Lista de todos os itens (não ordenada)
        currentView, // Estado que controla qual visualização está ativa
        setCurrentView, // Função para mudar a visualização
        searchQuery, // Estado da busca
        setSearchQuery, // Função para atualizar o estado da busca
        sortedItens, // Lista de itens já ordenada por nome
        handleUpdateDates, // Passa a função para atualizar datas
        handleAddItem, // Passa a função para adicionar novos itens
    } = useAgenda();

    return (
        // O contêiner principal da página
        <div className="container">
            <h1>Registro de Experimentos</h1>

            {/* Navegação entre as visualizações */}
            <div className="view-switcher">
                {/* Botão para a visualização de Lista */}
                <button
                    onClick={() => setCurrentView('list')} // Muda o estado para 'list'
                    // Adiciona a classe 'active' se for a visualização atual
                    className={`view-button ${currentView === 'list' ? 'active' : ''}`}>
                    Lista
                </button>
                {/* Botão para a visualização de Calendário */}
                <button
                    onClick={() => setCurrentView('calendar')}
                    className={`view-button ${currentView === 'calendar' ? 'active' : ''}`}>
                    Calendário
                </button>
                {/* Botão para a visualização de Agendamento */}
                <button
                    onClick={() => setCurrentView('schedule')}
                    className={`view-button ${currentView === 'schedule' ? 'active' : ''}`}>
                    Agendar
                </button>
            </div>

            {/* Renderização condicional das visualizações */}
            {/* Se o estado for 'list', renderiza o componente List */}
            {currentView === 'list' && (
                <List
                    sortedItens={sortedItens} // Passa a lista já ordenada
                    searchQuery={searchQuery}
                    setSearchQuery={setSearchQuery}
                />
            )}

            {/* Se o estado for 'calendar', renderiza o componente Calendar */}
            {currentView === 'calendar' && (
                <Calendar itens={agendaItens} /> // Passa a lista original para o calendário
            )}

            {/* Se o estado for 'schedule', renderiza o componente Schedule */}
            {currentView === 'schedule' && (
                <Schedule
                    itens={sortedItens} // Passa a lista ordenada para a busca
                    handleAddItem={handleAddItem} // Passamos as duas funções, agora o Schedule decide qual usar
                    handleUpdateDates={handleUpdateDates} // Passa a função para atualizar datas
                />
            )}
        </div>
    );
}

export default HomePage; // Exporta o componente para ser usado em App.tsx