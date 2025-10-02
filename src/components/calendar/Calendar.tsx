import React, { useState } from 'react';
import type { AgendaItem } from '../../hooks/useAgenda';

// Define as propriedades (props) que o componente Calendar irá receber
interface CalendarProps {
    itens: AgendaItem[]; // Recebe uma lista de itens de agenda
}

// O componente funcional Calendar
const Calendar: React.FC<CalendarProps> = ({ itens }) => {
    // Estado que armazena a data que o calendário está exibindo (mês e ano)
    const [currentDate, setCurrentDate] = useState(new Date());

    // Estado para armazenar o dia que foi clicado
    const [selectedDay, setSelectedDay] = useState<number | null>(null);
    // Estado para armazenar os itens agendados para o dia clicado
    const [itensForDay, setItensForDay] = useState<AgendaItem[]>([]);

    // Extrai o mês e o ano do estado `currentDate`
    const currentMonth = currentDate.getMonth();
    const currentYear = currentDate.getFullYear();

    // Função para retroceder um mês
    const handlePreviousMonth = () => {
        setCurrentDate(prevDate => {
            const newDate = new Date(prevDate);
            newDate.setMonth(newDate.getMonth() - 1); // Decrementa o mês
            return newDate;
        });
    };

    // Função para avançar um mês
    const handleNextMonth = () => {
        setCurrentDate(prevDate => {
            const newDate = new Date(prevDate);
            newDate.setMonth(newDate.getMonth() + 1); // Incrementa o mês
            return newDate;
        });
    };

    // Agrupa os itens da agenda por dia do mês
    const groupedByDay = itens.reduce((acc, item) => {
        // Itera sobre o array de datas de cada item
        item.scheduleDates.forEach(dateString => {
            const date = new Date(dateString);
            // Verifica se o item pertence ao mês e ano atualmente exibidos
            if (date.getMonth() === currentMonth && date.getFullYear() === currentYear) {
                const day = date.getDate();
                if (!acc[day]) {
                    acc[day] = []; // Cria um array se o dia ainda não existir
                }
                acc[day].push(item); // Adiciona o item ao dia correspondente
            }
        });
        return acc;
    }, {} as Record<number, AgendaItem[]>);

    // Calcula o primeiro dia da semana do mês (0 = Domingo)
    const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();
    // Calcula o número total de dias no mês
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    const calendarDays = []; // Array para renderizar os dias do calendário

    // Adiciona células vazias para os dias da semana antes do primeiro dia do mês
    for (let i = 0; i < firstDayOfMonth; i++) {
        calendarDays.push(null);
    }

    // Adiciona os dias do mês ao array
    for (let i = 1; i <= daysInMonth; i++) {
        calendarDays.push(i);
    }

    const dayNames = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

    // Função chamada ao clicar em um dia do calendário
    const handleDayClick = (day: number) => {
        setSelectedDay(day); // Define o dia selecionado
        setItensForDay(groupedByDay[day] || []); // Filtra os itens para o dia selecionado
    };

    // Função para fechar o modal de visualização do dia
    const handleCloseDayView = () => {
        setSelectedDay(null);
        setItensForDay([]);
    };

    return (
        <>
            {/* Contêiner Principal do Calendário - Equivale ao .calendar-grid-container */}
            <div className="max-w-[80%] mx-auto my-8 border border-gray-300 rounded-lg shadow-lg bg-white">
                {/* Cabeçalho do calendário com botões de navegação - Equivale ao .calendar-header */}
                <div className="flex justify-between items-center p-4 border-b border-gray-200">
                    <button 
                        onClick={handlePreviousMonth} 
                        className="bg-transparent border-none text-2xl cursor-pointer text-blue-500 hover:text-blue-800 px-2"
                    >
                        &lt;
                    </button>
                    <h2 className="flex-grow text-center text-xl font-semibold m-0 uppercase">
                        {currentDate.toLocaleString('pt-BR', { month: 'long', year: 'numeric' })}
                    </h2>
                    <button 
                        onClick={handleNextMonth} 
                        className="bg-transparent border-none text-2xl cursor-pointer text-blue-500 hover:text-blue-800 px-2"
                    >
                        &gt;
                    </button>
                </div>
                
                {/* Grade do calendário - Equivale ao .calendar-grid */}
                <div className="grid grid-cols-7 gap-px bg-gray-300 rounded-b-lg overflow-hidden">
                    {/* Mapeia e renderiza os nomes dos dias da semana - Equivale ao .day-name */}
                    {dayNames.map(dayName => (
                        <div key={dayName} className="bg-gray-100 p-2 text-center font-bold border-b border-gray-200 text-gray-600">
                            {dayName}
                        </div>
                    ))}
                    
                    {/* Mapeia e renderiza as células dos dias - Equivale ao .calendar-day-cell */}
                    {calendarDays.map((day, index) => (
                        <div
                            key={index}
                            className="bg-white p-2 h-32 relative flex flex-col cursor-pointer hover:bg-gray-50"
                            onClick={() => {
                                if (day !== null) {
                                    handleDayClick(day);
                                }
                            }}
                        >
                            {day !== null && (
                                <>
                                    {/* Número do dia - Equivale ao .day-number */}
                                    <div className="font-bold text-lg text-gray-700 text-right pb-1">
                                        {day}
                                    </div>
                                    
                                    {/* Container dos itens agendados - Equivale ao .day-items */}
                                    <div className="flex-grow overflow-y-auto">
                                        {/* Renderiza os itens agendados para o dia - Equivale ao .calendar-item */}
                                        {groupedByDay[day] && groupedByDay[day].map(item => (
                                            <div key={item.id} className="flex items-center gap-1 text-xs p-1 rounded mt-1 bg-blue-50 border border-blue-200 text-blue-800">
                                                <img 
                                                    src={item.image} 
                                                    alt={item.name}
                                                    className="w-5 h-5 rounded-full object-cover"
                                                />
                                                <p className="text-xs truncate">{item.name}</p>
                                            </div>
                                        ))}
                                    </div>
                                </>
                            )}
                        </div>
                    ))}
                </div>
            </div>
            
            {/* Modal de visualização do dia - Equivale ao .day-view-overlay */}
            {selectedDay !== null && (
                <div 
                    className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-70 flex justify-center items-center z-50" 
                    onClick={handleCloseDayView}
                >
                    {/* Contêiner do Modal - Equivale ao .day-view-container */}
                    <div 
                        className="bg-gray-800 text-white rounded-xl w-[90%] max-w-sm overflow-hidden shadow-2xl" 
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Cabeçalho do Modal - Equivale ao .day-view-header */}
                        <div className="p-5 border-b border-gray-600 flex justify-between items-center">
                            <div>
                                <h2 className="text-5xl font-bold m-0 text-green-400">
                                    {selectedDay}
                                </h2>
                                <span className="text-base capitalize text-gray-400">
                                    {new Date(currentYear, currentMonth, selectedDay).toLocaleDateString('pt-BR', { weekday: 'long' })}
                                </span>
                            </div>
                            <button 
                                className="bg-transparent border-none text-white text-3xl cursor-pointer hover:text-gray-300" 
                                onClick={handleCloseDayView}
                            >
                                &times;
                            </button>
                        </div>
                        
                        {/* Corpo do Modal - Equivale ao .day-view-body */}
                        <div className="p-5">
                            {itensForDay.length > 0 ? (
                                // Cards de detalhes de cada item - Equivale ao .day-item-card
                                itensForDay.map(item => (
                                    <div key={item.id} className="flex items-center gap-4 p-2 rounded-lg bg-gray-700 mb-3">
                                        <img 
                                            src={item.image} 
                                            alt={item.name}
                                            className="w-10 h-10 rounded-full object-cover"
                                        />
                                        {/* Detalhes do item - Equivale ao .day-item-details */}
                                        <div>
                                            <h3 className="m-0 text-lg font-semibold">{item.name}</h3>
                                            <p className="m-0 text-sm text-gray-300">Tipo: {item.species}</p>
                                            <p className="m-0 text-sm text-gray-300">Status: {item.status}</p>
                                            <p className="m-0 text-sm text-gray-300 mt-1">Histórico:</p>
                                            {/* Itera sobre o array de datas para exibir todas */}
                                            {item.scheduleDates && item.scheduleDates.map((date, index) => (
                                                <p key={index} className="m-0 text-xs text-gray-400 ml-2">
                                                    - Agendado para: {new Date(date).toLocaleDateString()}
                                                </p>
                                            ))}
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p className="text-gray-400 text-center">Nenhum item agendado para este dia.</p>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default Calendar;