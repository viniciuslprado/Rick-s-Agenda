import { useAgenda } from '../hooks/useAgenda';
import Calendar from '../components/calendar/Calendar';
import List from '../components/list/List';
import Schedule from '../components/schedule/Schedule';

function HomePage() {
    const {
        agendaItens,
        currentView,
        setCurrentView,
        searchQuery,
        setSearchQuery,
        sortedItens,
        handleUpdateDates,
        handleAddItem,
        isLoading,
        error,
    } = useAgenda();

    // Tratamento de loading
    if (isLoading) {
        return (
            <div className="w-full max-w-7xl mx-auto flex justify-center items-center min-h-screen">
                <div className="text-xl text-gray-600">Carregando...</div>
            </div>
        );
    }

    // Tratamento de erro
    if (error) {
        return (
            <div className="w-full max-w-7xl mx-auto flex justify-center items-center min-h-screen">
                <div className="text-xl text-red-600">{error}</div>
            </div>
        );
    }

    // Classes comuns do botão para reutilização
    const baseButtonClasses = "px-5 py-2 border border-gray-300 rounded-lg cursor-pointer transition-all duration-300 text-base font-medium";
    // Classes do botão ativo (visualização selecionada)
    const activeButtonClasses = "bg-blue-600 text-white border-blue-600 shadow-md hover:bg-blue-700";
    // Classes do botão inativo
    const inactiveButtonClasses = "bg-gray-100 text-gray-700 hover:bg-gray-200";

    return (
        <div className="w-full max-w-7xl mx-auto">
            <h1>
                Registro de Experimentos
            </h1>

            {/* Navegação entre as visualizações */}
            <div className="flex justify-center mb-6 space-x-2">

                {/* Botão para a visualização de Lista */}
                <button
                    onClick={() => setCurrentView('list')}
                    className={`${baseButtonClasses} ${currentView === 'list' ? activeButtonClasses : inactiveButtonClasses}`}
                >
                    Lista
                </button>

                {/* Botão para a visualização de Calendário */}
                <button
                    onClick={() => setCurrentView('calendar')}
                    className={`${baseButtonClasses} ${currentView === 'calendar' ? activeButtonClasses : inactiveButtonClasses}`}
                >
                    Calendário
                </button>

                {/* Botão para a visualização de Agendamento */}
                <button
                    onClick={() => setCurrentView('schedule')}
                    className={`${baseButtonClasses} ${currentView === 'schedule' ? activeButtonClasses : inactiveButtonClasses}`}
                >
                    Agendar
                </button>
            </div>

            {/* Renderização condicional das visualizações */}
            {currentView === 'list' && (
                <List
                    sortedItens={sortedItens}
                    searchQuery={searchQuery}
                    setSearchQuery={setSearchQuery}
                />
            )}

            {currentView === 'calendar' && (
                <Calendar itens={agendaItens} />
            )}

            {currentView === 'schedule' && (
                <Schedule
                    itens={sortedItens}
                    handleAddItem={handleAddItem}
                    handleUpdateDates={handleUpdateDates}
                />
            )}
        </div>
    );
}

export default HomePage;