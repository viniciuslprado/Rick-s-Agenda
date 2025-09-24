import React, { useState } from 'react';
import type { AgendaItem } from '../../index'; // Importa a interface de tipos para garantir a tipagem correta
import './Calendar.css'; // Importa os estilos CSS para este componente

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
      <div className="calendar-grid-container">
        {/* Cabeçalho do calendário com botões de navegação */}
        <div className="calendar-header">
          <button onClick={handlePreviousMonth} className="nav-button">&lt;</button>
          <h2>{currentDate.toLocaleString('pt-BR', { month: 'long', year: 'numeric' }).toUpperCase()}</h2>
          <button onClick={handleNextMonth} className="nav-button">&gt;</button>
        </div>
        
        {/* Grade do calendário */}
        <div className="calendar-grid">
          {/* Mapeia e renderiza os nomes dos dias da semana */}
          {dayNames.map(dayName => (
            <div key={dayName} className="day-name">
              {dayName}
            </div>
          ))}
          {/* Mapeia e renderiza as células dos dias */}
          {calendarDays.map((day, index) => (
            <div
              key={index}
              className="calendar-day-cell"
              onClick={() => {
                if (day !== null) {
                  handleDayClick(day);
                }
              }}
            >
              {day !== null && (
                <>
                  <div className="day-number">{day}</div>
                  <div className="day-items">
                    {/* Renderiza os itens agendados para o dia */}
                    {groupedByDay[day] && groupedByDay[day].map(item => (
                      <div key={item.id} className="calendar-item">
                        <img src={item.image} alt={item.name} />
                        <p>{item.name}</p>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      </div>
      {/* Modal de visualização do dia, exibido apenas se um dia estiver selecionado */}
      {selectedDay !== null && (
        <div className="day-view-overlay" onClick={handleCloseDayView}>
          <div className="day-view-container" onClick={(e) => e.stopPropagation()}>
            <div className="day-view-header">
              <div className="day-info">
                <h2>{selectedDay}</h2>
                <span>{new Date(currentYear, currentMonth, selectedDay).toLocaleDateString('pt-BR', { weekday: 'long' })}</span>
              </div>
              <button className="close-button" onClick={handleCloseDayView}>
                &times;
              </button>
            </div>
            <div className="day-view-body">
              {itensForDay.length > 0 ? (
                itensForDay.map(item => (
                  <div key={item.id} className="day-item-card">
                    <img src={item.image} alt={item.name} />
                    <div className="day-item-details">
                      <h3>{item.name}</h3>
                      <p>Tipo: {item.species}</p>
                      <p>Status: {item.status}</p>
                      <p>Histórico:</p>
                      {/* Itera sobre o array de datas para exibir todas */}
                      {item.scheduleDates && item.scheduleDates.map((date, index) => (
                        <p key={index}>- Agendado para: {new Date(date).toLocaleDateString()}</p>
                      ))}
                    </div>
                  </div>
                ))
              ) : (
                <p>Nenhum item agendado para este dia.</p>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Calendar;