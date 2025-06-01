import { useEffect, useRef, useState } from 'react';
import { Calendar } from 'react-date-range';
import format from 'date-fns/format';
import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';

const CalendarComp = () => {
  const [date, setDate] = useState(new Date());
  const [open, setOpen] = useState(false);
  const refOne = useRef(null);

  useEffect(() => {
    // Установка начальной даты
    setDate(new Date());
    
    const hideOnEscape = (e) => {
      if (e.key === 'Escape') {
        setOpen(false);
      }
    };

    const hideOnClickOutside = (e) => {
      if (refOne.current && !refOne.current.contains(e.target)) {
        setOpen(false);
      }
    };

    document.addEventListener('keydown', hideOnEscape);
    document.addEventListener('click', hideOnClickOutside, true);

    // Очистка эффекта
    return () => {
      document.removeEventListener('keydown', hideOnEscape);
      document.removeEventListener('click', hideOnClickOutside, true);
    };
  }, []);

  const handleSelect = (selectedDate) => {
    setDate(selectedDate);
    setOpen(false); // Закрываем календарь после выбора даты
  };

  return (
    <div className="calendarWrap" style={{ position: 'relative' }}>
      <input
        value={format(date, 'MM/dd/yyyy')}
        readOnly
        className="inputBox"
        onClick={() => setOpen(!open)}
        style={{ cursor: 'pointer' }}
      />

      {open && (
        <div 
          ref={refOne}
          style={{
            position: 'absolute',
            top: '100%',
            left: 0,
            zIndex: 999,
            marginTop: '8px'
          }}
        >
          <Calendar
            date={date}
            onChange={handleSelect}
            className="calendarElement"
          />
        </div>
      )}
    </div>
  );
};

export default CalendarComp;